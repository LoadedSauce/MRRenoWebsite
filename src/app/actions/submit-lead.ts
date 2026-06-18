"use server";

import type { LeadSubmission, SubmitResult } from "@/lib/lead-types";

/**
 * Server Action: insert a single lead into public.leads via the Supabase REST API.
 *
 * Architecture notes (per P1.2 ticket + Perplexity diagnostic):
 *  - Uses the publishable/anon key, which has INSERT-only RLS on public.leads.
 *  - Sends `Prefer: return=minimal` so PostgREST does NOT attempt to read the
 *    row back. Reading back would trigger the (correct, intentional) absence of
 *    an anon SELECT policy and surface as a misleading RLS-violation error.
 *  - Does NOT capture the new row id. Per AC #5a, id capture is deferred to
 *    the INT-001 Zapier trigger (Supabase Database Webhook on INSERT supplies
 *    the full new row including id natively to Zapier). This keeps the
 *    service-role key out of the app entirely.
 *  - Uses native fetch — no @supabase/supabase-js dependency added (Rule 5).
 */
export async function submitLead(payload: LeadSubmission): Promise<SubmitResult> {
  // ── Server-side validation ─────────────────────────────────────────
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "Invalid submission." };
  }
  if (payload.form_type !== "consultation" && payload.form_type !== "contact") {
    return { ok: false, error: "Invalid form type." };
  }
  if (!payload.full_name || payload.full_name.trim().length < 2) {
    return { ok: false, error: "Please enter your full name." };
  }
  // Schema allows email or phone to be null individually, but we require at
  // least one means of contact for the lead to be actionable.
  const hasEmail = !!(payload.email && payload.email.trim());
  const hasPhone = !!(payload.phone && payload.phone.trim());
  if (!hasEmail && !hasPhone) {
    return { ok: false, error: "Please provide an email or phone number." };
  }
  if (hasEmail) {
    // Liberal email pattern; the column accepts text either way and final
    // validation is downstream in the CRM.
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email!.trim());
    if (!emailOk) {
      return { ok: false, error: "Please enter a valid email address." };
    }
  }

  // ── Env vars ───────────────────────────────────────────────────────
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    // Fail closed and log to the server. The client gets a generic message.
    console.error("[submitLead] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    return { ok: false, error: "Submission temporarily unavailable. Please call 763-900-2024." };
  }

  // ── Build the row (only set fields with content; null otherwise) ───
  const clean = (v: unknown): string | null => {
    if (typeof v !== "string") return null;
    const trimmed = v.trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  const row = {
    form_type: payload.form_type,
    full_name: payload.full_name.trim(),
    email: clean(payload.email),
    phone: clean(payload.phone),
    project_type: clean(payload.project_type),
    project_details: clean(payload.project_details),
    preferred_contact: clean(payload.preferred_contact),
    source_channel: clean(payload.source_channel),
    source_campaign: clean(payload.source_campaign),
    landing_url: clean(payload.landing_url),
    utm_source: clean(payload.utm_source),
    utm_medium: clean(payload.utm_medium),
    utm_campaign: clean(payload.utm_campaign),
    utm_term: clean(payload.utm_term),
    utm_content: clean(payload.utm_content),
  };

  // ── POST to Supabase REST ──────────────────────────────────────────
  try {
    const endpoint = `${url.replace(/\/$/, "")}/rest/v1/leads`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
      // Server Action runs server-side; no need for cors mode hints
      cache: "no-store",
    });

    if (res.ok) {
      return { ok: true };
    }

    // Non-2xx — read body for server logs but don't leak details to client.
    const errorBody = await res.text().catch(() => "");
    console.error(`[submitLead] Supabase rejected insert (HTTP ${res.status}): ${errorBody}`);
    return {
      ok: false,
      error: "We could not submit your request. Please try again or call 763-900-2024.",
    };
  } catch (err) {
    console.error("[submitLead] Network or runtime error:", err);
    return {
      ok: false,
      error: "We could not submit your request. Please try again or call 763-900-2024.",
    };
  }
}
