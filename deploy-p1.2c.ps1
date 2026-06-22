# =============================================================================
# Phase 1.2c — Add required address block to contact form
# Branch: feature/p1.2c-contact-address off staging
# Run this entire script in PowerShell. One paste, one Enter.
# =============================================================================

$repo = "C:\Users\mbran\OneDrive\Desktop\MR Reno\WebsiteBuild\mr-renovations-site"
$author = "MRReno Build <hundredslikeit@live.com>"
$branch = "feature/p1.2c-contact-address"
$message = "feat(p1.2c): add required address block to contact form"

Set-Location $repo

# ── Branch setup ─────────────────────────────────────────────────────────────
git checkout staging
git pull
git checkout -b $branch

# ── File: src/components/contact-form.tsx ────────────────────────────────────
$contactForm = @'
"use client";

import { useState, useTransition } from "react";
import { submitLead } from "@/app/actions/submit-lead";
import { readAttribution } from "@/lib/attribution";

const contactPrefs = ["Phone", "Email", "Either is fine"];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

export function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferred, setPreferred] = useState("");
  const [message, setMessage] = useState("");
  // Address
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPreferred("");
    setMessage("");
    setStreetAddress("");
    setCity("");
    setState("");
    setZip("");
    setSubmitted(false);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!firstName.trim()) {
      setErrorMsg("Please enter your first name.");
      return;
    }
    if (!lastName.trim()) {
      setErrorMsg("Please enter your last name.");
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMsg("Please provide an email or phone number so we can reach you.");
      return;
    }
    if (!streetAddress.trim()) {
      setErrorMsg("Please enter your street address.");
      return;
    }
    if (!city.trim()) {
      setErrorMsg("Please enter your city.");
      return;
    }
    if (!state) {
      setErrorMsg("Please select your state.");
      return;
    }
    if (!zip.trim()) {
      setErrorMsg("Please enter your ZIP code.");
      return;
    }

    const attribution = readAttribution();

    startTransition(async () => {
      const result = await submitLead({
        form_type: "contact",
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone: phone || null,
        project_details: message || null,
        preferred_contact: preferred || null,
        street_address: streetAddress,
        city,
        state,
        zip,
        ...attribution,
      });
      if (result.ok) {
        setSubmitted(true);
      } else {
        setErrorMsg(result.error ?? "Submission failed. Please try again.");
      }
    });
  };

  const fieldBase =
    "w-full rounded-md border border-faint bg-paper px-4 py-3 text-base text-ink placeholder:text-muted focus:border-navy focus:outline-none focus:ring-2 focus:ring-orange/40 transition-colors";
  const labelBase = "block text-sm font-display font-semibold text-ink mb-2";
  const helpBase = "mt-1.5 text-xs text-muted";

  if (submitted) {
    return (
      <div className="rounded-xl bg-paper border border-faint shadow-md p-8 sm:p-10">
        <p className="font-display font-semibold tracking-[0.12em] uppercase text-xs text-orange">
          Message received
        </p>
        <h3 className="mt-3 font-display font-bold text-2xl text-ink">
          Thanks for reaching out.
        </h3>
        <p className="mt-3 text-muted leading-relaxed">
          We&rsquo;ll get back to you within one business day. For time-sensitive matters, call{" "}
          <a href="tel:7639002024" className="text-navy font-semibold underline underline-offset-4">
            763-900-2024
          </a>
          .
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 text-sm text-navy underline underline-offset-4 hover:text-orange transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-paper border border-faint shadow-md p-6 sm:p-8 space-y-5"
      noValidate
    >
      {/* Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-first-name" className={labelBase}>
            First name <span className="text-orange">*</span>
          </label>
          <input
            id="cf-first-name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={fieldBase}
            placeholder="Jane"
            autoComplete="given-name"
            required
          />
        </div>
        <div>
          <label htmlFor="cf-last-name" className={labelBase}>
            Last name <span className="text-orange">*</span>
          </label>
          <input
            id="cf-last-name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={fieldBase}
            placeholder="Doe"
            autoComplete="family-name"
            required
          />
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-email" className={labelBase}>
            Email
          </label>
          <input
            id="cf-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldBase}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className={labelBase}>
            Phone
          </label>
          <input
            id="cf-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldBase}
            placeholder="(763) 555-0100"
            autoComplete="tel"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="cf-street-address" className={labelBase}>
          Street address <span className="text-orange">*</span>
        </label>
        <input
          id="cf-street-address"
          type="text"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          className={fieldBase}
          placeholder="123 Maple St"
          autoComplete="street-address"
          required
        />
        <p className={helpBase}>Helps us serve your area and schedule follow-up.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="col-span-2 sm:col-span-2">
          <label htmlFor="cf-city" className={labelBase}>
            City <span className="text-orange">*</span>
          </label>
          <input
            id="cf-city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={fieldBase}
            placeholder="Maple Grove"
            autoComplete="address-level2"
            required
          />
        </div>
        <div>
          <label htmlFor="cf-state" className={labelBase}>
            State <span className="text-orange">*</span>
          </label>
          <select
            id="cf-state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={`${fieldBase} appearance-none`}
            autoComplete="address-level1"
            required
          >
            <option value="">—</option>
            {US_STATES.map((abbr) => (
              <option key={abbr} value={abbr}>
                {abbr}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cf-zip" className={labelBase}>
            ZIP <span className="text-orange">*</span>
          </label>
          <input
            id="cf-zip"
            type="text"
            inputMode="numeric"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className={fieldBase}
            placeholder="55369"
            autoComplete="postal-code"
            maxLength={10}
            required
          />
        </div>
      </div>

      {/* Preferred contact */}
      <div>
        <p className={labelBase}>Preferred contact method</p>
        <div className="grid grid-cols-3 gap-2.5">
          {contactPrefs.map((c) => {
            const selected = preferred === c;
            return (
              <label
                key={c}
                className={`flex items-center gap-3 rounded-md border bg-paper px-3 py-2.5 cursor-pointer transition-colors ${
                  selected
                    ? "border-navy bg-soft-navy/60"
                    : "border-faint hover:border-navy/40"
                }`}
              >
                <input
                  type="radio"
                  name="cf-preferred"
                  value={c}
                  checked={selected}
                  onChange={() => setPreferred(c)}
                  className="accent-orange"
                />
                <span className="text-sm font-medium text-ink">{c}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className={labelBase}>
          How can we help?
        </label>
        <textarea
          id="cf-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className={fieldBase}
          placeholder="Tell us a little about your project, question, or what you need."
        />
      </div>

      {errorMsg ? (
        <div
          role="alert"
          className="rounded-md border border-orange/40 bg-soft-orange/60 px-4 py-3 text-sm text-ink"
        >
          {errorMsg}
        </div>
      ) : null}

      <div className="flex items-center justify-end pt-2 border-t border-faint">
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="inline-flex items-center justify-center bg-orange hover:bg-orange-deep text-paper font-display font-semibold text-sm px-6 py-3 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Sending..." : "Send message"}
        </button>
      </div>

      <p className="text-xs text-muted">
        By submitting you agree to be contacted about your inquiry. We will never sell your information.
      </p>
    </form>
  );
}
'@

$contactForm | Set-Content -Path "$repo\src\components\contact-form.tsx" -Encoding UTF8 -NoNewline
Add-Content -Path "$repo\src\components\contact-form.tsx" -Value "" -Encoding UTF8

# ── File: src/app/actions/submit-lead.ts ─────────────────────────────────────
$submitLead = @'
"use server";

import type { LeadSubmission, SubmitResult } from "@/lib/lead-types";

const SOURCE_CHANNEL = "Website" as const;

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
 *
 * SCHEMA-002 / Phase 1.2b changes:
 *  - Accepts first_name + last_name instead of full_name.
 *  - Composes full_name server-side to satisfy the legacy NOT-NULL column
 *    until migration 0003 drops it.
 *  - Inserts street_address, city, state, zip.
 *  - source_channel is always "Website".
 *
 * Phase 1.2c change:
 *  - Address validation now applies to both consultation and contact.
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

  // Address required on both consultation and contact (Phase 1.2c).
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
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("[submitLead] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    return { ok: false, error: "Submission temporarily unavailable. Please call 763-900-2024." };
  }

  const clean = (v: unknown): string | null => {
    if (typeof v !== "string") return null;
    const trimmed = v.trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  const row = {
    form_type: payload.form_type,
    full_name: `${firstName} ${lastName}`,
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
      cache: "no-store",
    });

    if (res.ok) {
      return { ok: true };
    }

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
'@

$submitLead | Set-Content -Path "$repo\src\app\actions\submit-lead.ts" -Encoding UTF8 -NoNewline
Add-Content -Path "$repo\src\app\actions\submit-lead.ts" -Value "" -Encoding UTF8

# ── Commit and push ───────────────────────────────────────────────────────────
git add -A
git commit --author=$author -m $message
git push -u origin $branch

Write-Host ""
Write-Host "Done. Paste the Vercel preview URL back to Claude." -ForegroundColor Green
