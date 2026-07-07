"use client";

import { useState } from "react";
import { submitGuideRequest } from "@/app/actions/submit-guide-request";

/**
 * Email-capture form for gated resource posts (P1.43). On success it swaps to
 * a confirmation state. Writes to guide_requests via the submitGuideRequest
 * server action (table pending Perplexity migration review -- see the action).
 */
export function GuideRequestForm({ guideSlug }: { guideSlug: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    const attribution =
      typeof window !== "undefined"
        ? (() => {
            const params = new URLSearchParams(window.location.search);
            return {
              landing_url: window.location.href,
              utm_source: params.get("utm_source"),
              utm_medium: params.get("utm_medium"),
              utm_campaign: params.get("utm_campaign"),
            };
          })()
        : {};

    const result = await submitGuideRequest({
      name,
      email,
      guide_slug: guideSlug,
      ...attribution,
    });

    if (result.ok) {
      setStatus("done");
    } else {
      setError(result.error);
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-lg border border-faint bg-soft-navy p-6 text-center">
        <p className="font-display font-bold text-lg text-ink">Check your inbox.</p>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          Thanks. We have your request and will send the full guide to the email
          you provided.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-faint bg-soft-navy p-6"
    >
      <p className="font-display font-bold text-lg text-ink">
        Get the full guide
      </p>
      <p className="mt-1 text-sm text-muted leading-relaxed">
        Enter your name and email and we will send you the complete guide.
      </p>

      <div className="mt-5 space-y-3">
        <div>
          <label
            htmlFor="gr-name"
            className="block text-xs font-display font-semibold uppercase tracking-[0.1em] text-ink"
          >
            Name
          </label>
          <input
            id="gr-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-faint bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-navy"
          />
        </div>
        <div>
          <label
            htmlFor="gr-email"
            className="block text-xs font-display font-semibold uppercase tracking-[0.1em] text-ink"
          >
            Email
          </label>
          <input
            id="gr-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-faint bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-navy"
          />
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-orange" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-orange px-6 py-3 font-display font-semibold text-sm text-ink transition hover:brightness-105 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send me the guide"}
      </button>
    </form>
  );
}
