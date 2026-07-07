/**
 * Attribution context captured at form-submit time from `window.location`.
 *
 * Limitation: this captures whatever is in the URL at the moment of submit.
 * For full session-wide UTM persistence across navigation (so a user landing
 * on `/?utm_source=google` and later submitting from `/consultation` still
 * has Google attributed), we would need to write UTMs into sessionStorage on
 * first arrival and read them at submit. That is recommended for Phase 1.2b.
 */

export interface Attribution {
  landing_url: string | null;
  source_channel: string | null;
  source_campaign: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  // Ad-platform click identifiers (Ticket E). Same submit-time capture caveat
  // as the UTMs above.
  gclid: string | null;
  fbclid: string | null;
}

const EMPTY: Attribution = {
  landing_url: null,
  source_channel: null,
  source_campaign: null,
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_term: null,
  utm_content: null,
  gclid: null,
  fbclid: null,
};

/**
 * Infer a source_channel from utm_medium when available.
 * Falls back to null when we cannot tell — Roofr/analytics can derive later.
 */
function inferChannel(utmMedium: string | null, utmSource: string | null): string | null {
  if (!utmMedium && !utmSource) return null;
  const m = (utmMedium ?? "").toLowerCase();
  if (m === "cpc" || m === "ppc" || m === "paid" || m === "paid_search" || m === "paid_social") {
    return "paid";
  }
  if (m === "email") return "email";
  if (m === "social" || m === "organic_social") return "social";
  if (m === "organic" || m === "seo") return "organic";
  if (m === "referral") return "referral";
  // We know there's UTM data but the medium isn't a recognised bucket
  return "campaign";
}

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY;

  try {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const get = (k: string) => {
      const v = params.get(k);
      return v && v.trim().length > 0 ? v.trim() : null;
    };

    const utm_source = get("utm_source");
    const utm_medium = get("utm_medium");
    const utm_campaign = get("utm_campaign");
    const utm_term = get("utm_term");
    const utm_content = get("utm_content");

    return {
      landing_url: url.href,
      source_channel: inferChannel(utm_medium, utm_source),
      source_campaign: utm_campaign,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      gclid: get("gclid"),
      fbclid: get("fbclid"),
    };
  } catch {
    return EMPTY;
  }
}
