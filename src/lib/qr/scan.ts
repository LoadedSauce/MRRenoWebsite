// src/lib/qr/scan.ts
//
// INT-004 pure helpers for the /r/<slug> scan route.
//
// These live outside the route handler because Next.js route files may only
// export the HTTP verbs and a few config values, which would make this logic
// untestable in place. Everything here is deterministic and side-effect free.

import { createHash } from "node:crypto";

/**
 * User agents that fetch a URL without a human looking at it: crawlers, and
 * the link previewers that fire when someone pastes a URL into a chat app.
 * These are logged (so total_hits stays honest) but flagged, and the
 * qr_performance view excludes them from the headline scan count.
 */
const BOT_PATTERN =
  /bot|crawler|spider|crawling|slurp|facebookexternalhit|facebot|whatsapp|telegram|discord|slack|linkedin|twitter|pinterest|embedly|quora|redditbot|applebot|bingpreview|semrush|ahrefs|mj12|dotbot|petalbot|yandex|duckduck|curl|wget|python-requests|axios|go-http-client|okhttp|headless|lighthouse|preview|monitor|uptime|pingdom|gtmetrix/i;

export function isBotAgent(ua: string | null | undefined): boolean {
  if (!ua || ua.trim().length === 0) return true; // no UA at all is not a person
  return BOT_PATTERN.test(ua);
}

/** Mirrors the qr_codes_slug_format CHECK constraint. */
export const QR_SLUG_RE = /^[a-z0-9][a-z0-9-]{1,30}$/;

export function isValidSlug(slug: string): boolean {
  return QR_SLUG_RE.test(slug);
}

/**
 * Salted hash of the client IP. Returns null when QR_IP_SALT is unset, in
 * which case repeat detection degrades to "every scan is unique" -- the
 * correct failure mode, since we would rather over-count scans than store an
 * unsalted (and therefore trivially reversible) hash of someone's address.
 */
export function hashIp(ip: string | null, salt: string | undefined): string | null {
  if (!ip || !salt) return null;
  return createHash("sha256").update(`${ip}${salt}`).digest("hex");
}

/** First entry of x-forwarded-for is the original client. */
export function clientIp(headers: Headers): string | null {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip");
}

/** Vercel injects these on every edge request; absent locally. */
export function geoFromHeaders(headers: Headers) {
  const clean = (v: string | null) => {
    if (!v) return null;
    try {
      const t = decodeURIComponent(v).trim();
      return t.length > 0 ? t : null;
    } catch {
      const t = v.trim();
      return t.length > 0 ? t : null;
    }
  };
  return {
    city: clean(headers.get("x-vercel-ip-city")),
    region: clean(headers.get("x-vercel-ip-country-region")),
    country: clean(headers.get("x-vercel-ip-country")),
  };
}

export interface QrRedirectCode {
  slug: string;
  destination_path: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string | null;
  utm_content: string | null;
}

/**
 * Build the destination URL: the registry's path plus its UTMs.
 *
 * UTMs already present on the incoming request win over the registry values,
 * so a one-off tracking link can override the defaults without a DB edit.
 * `qr` is always stamped so client-side analytics see the source too.
 *
 * The destination is forced onto `origin`. destination_path is admin
 * controlled, but an absolute URL there would turn this route into an open
 * redirect -- a phishing primitive hosted on our own domain, which is exactly
 * the kind of thing that gets a domain flagged.
 */
export function buildDestination(
  origin: string,
  code: QrRedirectCode,
  incoming: URLSearchParams
): string {
  const rawPath = code.destination_path || "/";
  const isAbsolute = /^[a-z][a-z0-9+.-]*:/i.test(rawPath) || rawPath.startsWith("//");
  const safePath = isAbsolute ? "/" : rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

  const url = new URL(safePath, origin);

  // Carry through anything already on the inbound URL first, then fill gaps
  // from the registry.
  incoming.forEach((value, key) => url.searchParams.set(key, value));

  const setIfAbsent = (key: string, value: string | null) => {
    if (!value) return;
    if (incoming.has(key)) return;
    url.searchParams.set(key, value);
  };

  setIfAbsent("utm_source", code.utm_source);
  setIfAbsent("utm_medium", code.utm_medium);
  setIfAbsent("utm_campaign", code.utm_campaign);
  setIfAbsent("utm_content", code.utm_content);

  url.searchParams.set("qr", code.slug);

  return url.toString();
}
