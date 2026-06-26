"use server";

import type { LeadSubmission, SubmitResult } from "@/lib/lead-types";

const SOURCE_CHANNEL = "Website" as const;

/**
 * Server Action: insert a single lead into public.leads, then upload any
 * attached photos to Supabase Storage (lead-photos bucket).
 *
 * Architecture notes:
 *  - Lead insert: switches from anon key to service_role key so we can
 *    read the inserted row id back (Prefer: return=representation).
 *    The id is needed to associate uploaded photos with the lead.
 *    SUPABASE_SERVICE_ROLE_KEY is server-side only -- never shipped to the
 *    browser. Rule 7 amendment covers this usage.
 *  - Photo upload: performed after lead insert succeeds. Upload failure is
 *    non-fatal -- the lead saves regardless. Errors are logged with the
 *    lead id so they are findable in Vercel Functions logs.
 *  - Photo storage path: lead-photos/{timestamp}-{random}-{filename}
 *  - photo_urls column (text[]): updated via PATCH after successful uploads.
 *    If 0 photos uploaded successfully, the column remains NULL.
 *  - No new npm dependencies: uses native fetch for PostgREST calls and
 *    Buffer.from() for base64 decode (available in Node.js runtime).
 *
 * NOTICED (pre-ticket read):
 *  - Previous version used anon key + Prefer: return=minimal (no id capture).
 *  - photo_urls column did not exist on leads before this ticket (confirmed
 *    via Supabase connector). Migration form_photos_lead_photo_urls added it.
 *  - lead-photos bucket created as private (public: false) before this PR.
 */
export async function submitLead(payload: LeadSubmission): Promise<SubmitResult> {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "Invalid submission." };
  }
  if (payload.form_type !== "consultation" && payload.form_type !== "contact") {
    return { ok: false, error: "Invalid form type." };
  }

  const firstName = payload.first_name?.trim() ?? "";
  const lastName = payload.last_name?.trim() ?? "";

  if (firstName.length < 1) {
    return { ok: false, error: "Please enter your first name." };
  }
  if (lastName.length < 1) {
    return { ok: false, error: "Please enter your last name." };
  }

  const hasEmail = !!(payload.email && payload.email.trim());
  const hasPhone = !!(payload.phone && payload.phone.trim());
  if (!hasEmail && !hasPhone) {
    return { ok: false, error: "Please provide an email or phone number." };
  }
  if (hasEmail) {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email!.trim());
    if (!emailOk) {
      return { ok: false, error: "Please enter a valid email address." };
    }
  }

  if (!payload.street_address?.trim()) {
    return { ok: false, error: "Please enter your street address." };
  }
  if (!payload.city?.trim()) {
    return { ok: false, error: "Please enter your city." };
  }
  if (!payload.state?.trim()) {
    return { ok: false, error: "Please enter your state." };
  }
  if (!payload.zip?.trim()) {
    return { ok: false, error: "Please enter your ZIP code." };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("[submitLead] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
    return { ok: false, error: "Submission temporarily unavailable. Please call 763-900-2024." };
  }

  const baseUrl = url.replace(/\/$/, "");

  const clean = (v: unknown): string | null => {
    if (typeof v !== "string") return null;
    const trimmed = v.trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  const row = {
    form_type: payload.form_type,
    first_name: firstName,
    last_name: lastName,
    email: clean(payload.email),
    phone: clean(payload.phone),
    project_type: clean(payload.project_type),
    project_details: clean(payload.project_details),
    preferred_contact: clean(payload.preferred_contact),
    street_address: clean(payload.street_address),
    city: clean(payload.city),
    state: clean(payload.state),
    zip: clean(payload.zip),
    source_channel: SOURCE_CHANNEL,
    source_campaign: clean(payload.source_campaign),
    landing_url: clean(payload.landing_url),
    utm_source: clean(payload.utm_source),
    utm_medium: clean(payload.utm_medium),
    utm_campaign: clean(payload.utm_campaign),
    utm_term: clean(payload.utm_term),
    utm_content: clean(payload.utm_content),
  };

  let leadId: string | null = null;

  try {
    const endpoint = `${baseUrl}/rest/v1/leads`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        // return=representation so we get the row back with the generated id
        Prefer: "return=representation",
      },
      body: JSON.stringify(row),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      console.error(`[submitLead] Supabase rejected insert (HTTP ${res.status}): ${errorBody}`);
      return {
        ok: false,
        error: "We could not submit your request. Please try again or call 763-900-2024.",
      };
    }

    const inserted = await res.json().catch(() => null);
    // PostgREST returns an array even for single inserts
    leadId = Array.isArray(inserted) && inserted.length > 0 ? (inserted[0].id ?? null) : null;
  } catch (err) {
    console.error("[submitLead] Network or runtime error:", err);
    return {
      ok: false,
      error: "We could not submit your request. Please try again or call 763-900-2024.",
    };
  }

  // ── Photo upload (non-fatal) ─────────────────────────────────────────────
  const photoDataUrls = payload.photo_data_urls ?? [];
  const photoFilenames = payload.photo_filenames ?? [];

  if (photoDataUrls.length > 0 && leadId) {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < photoDataUrls.length; i++) {
      const dataUrl = photoDataUrls[i];
      const originalFilename = photoFilenames[i] ?? `photo-${i + 1}.jpg`;

      try {
        // Parse data URL: data:<mime>;base64,<data>
        const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (!match) {
          console.error(`[submitLead] lead ${leadId}: photo ${i} is not a valid data URL`);
          continue;
        }
        const mimeType = match[1];
        const base64Data = match[2];
        const bytes = Buffer.from(base64Data, "base64");

        // Sanitize filename: strip path separators, keep extension
        const safeName = originalFilename.replace(/[^a-zA-Z0-9._-]/g, "-");
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

        // Upload via Supabase Storage REST API
        const storageEndpoint = `${baseUrl}/storage/v1/object/lead-photos/${path}`;
        const uploadRes = await fetch(storageEndpoint, {
          method: "POST",
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": mimeType,
            "x-upsert": "false",
          },
          body: bytes,
          cache: "no-store",
        });

        if (uploadRes.ok) {
          // Private bucket -- store the path (not a public URL)
          uploadedUrls.push(path);
        } else {
          const errBody = await uploadRes.text().catch(() => "");
          console.error(`[submitLead] lead ${leadId}: photo upload failed (HTTP ${uploadRes.status}): ${errBody}`);
        }
      } catch (uploadErr) {
        console.error(`[submitLead] lead ${leadId}: photo ${i} upload threw:`, uploadErr);
      }
    }

    // Update lead row with photo paths if any uploaded successfully
    if (uploadedUrls.length > 0) {
      try {
        const patchEndpoint = `${baseUrl}/rest/v1/leads?id=eq.${leadId}`;
        const patchRes = await fetch(patchEndpoint, {
          method: "PATCH",
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ photo_urls: uploadedUrls }),
          cache: "no-store",
        });
        if (!patchRes.ok) {
          const errBody = await patchRes.text().catch(() => "");
          console.error(`[submitLead] lead ${leadId}: photo_urls patch failed (HTTP ${patchRes.status}): ${errBody}`);
        }
      } catch (patchErr) {
        console.error(`[submitLead] lead ${leadId}: photo_urls patch threw:`, patchErr);
      }
    }
  } else if (photoDataUrls.length > 0 && !leadId) {
    console.error("[submitLead] Photos present but no lead id returned -- skipping upload");
  }

  return { ok: true };
}
