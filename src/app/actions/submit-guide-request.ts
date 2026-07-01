"use server";

// Server Action: insert a gated-guide email capture into public.guide_requests.
//
// Mirrors submit-lead.ts: server-side service_role key, native fetch to
// PostgREST, no new dependencies. SUPABASE_SERVICE_ROLE_KEY is never shipped
// to the browser.
//
// SCHEMA GATE (P1.43 / Rule 16): the guide_requests table does NOT yet exist
// on the live project -- its migration is drafted and held for Perplexity
// review (see supabase/migrations/0007_guide_requests.sql). This action is
// written against the proposed shape and will succeed once that migration is
// applied. Until then the insert returns an error, which the form surfaces
// gracefully. Runtime verification is therefore pending the migration.

const SOURCE_CHANNEL = "Website" as const;

export interface GuideRequestSubmission {
  name: string;
  email: string;
  guide_slug: string;
  landing_url?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}

export type GuideRequestResult = { ok: true } | { ok: false; error: string };

export async function submitGuideRequest(
  payload: GuideRequestSubmission
): Promise<GuideRequestResult> {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "Invalid submission." };
  }

  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const guideSlug = payload.guide_slug?.trim() ?? "";

  if (name.length < 1) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (guideSlug.length < 1) {
    return { ok: false, error: "Missing guide reference." };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "[submitGuideRequest] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
    );
    return {
      ok: false,
      error: "Request temporarily unavailable. Please call 763-900-2024.",
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
    guide_slug: guideSlug,
    source_channel: SOURCE_CHANNEL,
    landing_url: clean(payload.landing_url),
    utm_source: clean(payload.utm_source),
    utm_medium: clean(payload.utm_medium),
    utm_campaign: clean(payload.utm_campaign),
  };

  try {
    const res = await fetch(`${baseUrl}/rest/v1/guide_requests`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      console.error(
        `[submitGuideRequest] Supabase rejected insert (HTTP ${res.status}): ${errorBody}`
      );
      return {
        ok: false,
        error: "We could not save your request. Please try again or call 763-900-2024.",
      };
    }
  } catch (err) {
    console.error("[submitGuideRequest] Network or runtime error:", err);
    return {
      ok: false,
      error: "We could not save your request. Please try again or call 763-900-2024.",
    };
  }

  return { ok: true };
}
