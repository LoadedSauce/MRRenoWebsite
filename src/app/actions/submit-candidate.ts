"use server";

// Server Action: insert a job-candidate submission into public.candidates,
// then upload the resume to the private candidate-resumes storage bucket.
//
// Mirrors submit-lead.ts: server-side service_role key, native fetch to
// PostgREST + Storage REST, Buffer for base64 decode, no new dependencies.
// Validation is manual (the repo has no validation library; Zod was declined
// for this ticket to avoid a new dependency -- flagged in the PR NOTICED).
//
// This writes ONLY to public.candidates and the candidate-resumes bucket. It
// never touches public.leads and never triggers Roofr/Zapier automation
// (Rule 17): candidates are not sales leads.
//
// SCHEMA GATE (Rule 16): the candidates table and candidate-resumes bucket do
// not exist on the live project yet -- their migration is held for Perplexity
// (supabase/migrations/0008_candidates.sql). This action is written against
// the proposed shape; its live insert/upload is unverifiable until applied.

export interface CandidateSubmission {
  name: string;
  email: string;
  phone?: string | null;
  role_interest?: string | null;
  experience_summary?: string | null;
  resume_data_url?: string | null; // data:<mime>;base64,<data>
  resume_filename?: string | null;
}

export type CandidateResult = { ok: true } | { ok: false; error: string };

const RESUME_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const RESUME_ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function submitCandidate(
  payload: CandidateSubmission
): Promise<CandidateResult> {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "Invalid submission." };
  }

  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";

  if (name.length < 1) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "[submitCandidate] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
    );
    return {
      ok: false,
      error: "Applications are temporarily unavailable. Please call 763-900-2024.",
    };
  }

  const baseUrl = url.replace(/\/$/, "");

  const clean = (v: unknown): string | null => {
    if (typeof v !== "string") return null;
    const trimmed = v.trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  const row = {
    name,
    email,
    phone: clean(payload.phone),
    role_interest: clean(payload.role_interest),
    experience_summary: clean(payload.experience_summary),
    status: "new",
  };

  let candidateId: string | null = null;

  try {
    const res = await fetch(`${baseUrl}/rest/v1/candidates`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(row),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      console.error(
        `[submitCandidate] Supabase rejected insert (HTTP ${res.status}): ${errorBody}`
      );
      return {
        ok: false,
        error: "We could not submit your application. Please try again or call 763-900-2024.",
      };
    }

    const inserted = await res.json().catch(() => null);
    candidateId =
      Array.isArray(inserted) && inserted.length > 0 ? (inserted[0].id ?? null) : null;
  } catch (err) {
    console.error("[submitCandidate] Network or runtime error:", err);
    return {
      ok: false,
      error: "We could not submit your application. Please try again or call 763-900-2024.",
    };
  }

  // ── Resume upload (non-fatal: the application saves regardless) ─────────────
  const dataUrl = payload.resume_data_url;
  if (dataUrl && candidateId) {
    try {
      const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        console.error(`[submitCandidate] candidate ${candidateId}: resume is not a valid data URL`);
      } else {
        const mimeType = match[1];
        const bytes = Buffer.from(match[2], "base64");

        if (!RESUME_ALLOWED_MIME.has(mimeType)) {
          console.error(`[submitCandidate] candidate ${candidateId}: rejected resume mime ${mimeType}`);
        } else if (bytes.length > RESUME_MAX_BYTES) {
          console.error(`[submitCandidate] candidate ${candidateId}: resume exceeds size limit`);
        } else {
          const safeName = (payload.resume_filename ?? "resume").replace(/[^a-zA-Z0-9._-]/g, "-");
          const path = `${candidateId}/${Date.now()}-${safeName}`;

          const uploadRes = await fetch(
            `${baseUrl}/storage/v1/object/candidate-resumes/${path}`,
            {
              method: "POST",
              headers: {
                apikey: serviceKey,
                Authorization: `Bearer ${serviceKey}`,
                "Content-Type": mimeType,
                "x-upsert": "false",
              },
              body: bytes,
              cache: "no-store",
            }
          );

          if (uploadRes.ok) {
            await fetch(`${baseUrl}/rest/v1/candidates?id=eq.${candidateId}`, {
              method: "PATCH",
              headers: {
                apikey: serviceKey,
                Authorization: `Bearer ${serviceKey}`,
                "Content-Type": "application/json",
                Prefer: "return=minimal",
              },
              body: JSON.stringify({ resume_storage_path: path }),
              cache: "no-store",
            });
          } else {
            const errBody = await uploadRes.text().catch(() => "");
            console.error(
              `[submitCandidate] candidate ${candidateId}: resume upload failed (HTTP ${uploadRes.status}): ${errBody}`
            );
          }
        }
      }
    } catch (uploadErr) {
      console.error(`[submitCandidate] candidate ${candidateId}: resume upload threw:`, uploadErr);
    }
  }

  return { ok: true };
}
