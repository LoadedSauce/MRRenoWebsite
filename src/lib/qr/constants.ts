// src/lib/qr/constants.ts
//
// INT-004 shared constants. Kept in their own module so the scan route
// (which sets the cookie) and the lead action (which reads it) cannot drift
// apart on the name or the lifetime.

/**
 * Cookie linking a browser back to the QR scan that brought it here.
 * Value is JSON: { s: <slug>, i: <qr_scans.id> }. httpOnly -- set in
 * /r/[slug], read only in server actions.
 */
export const QR_COOKIE_NAME = "mr_qr";

/**
 * 90 days.
 *
 * Print has a long tail that digital does not: a magazine sits on a coffee
 * table for weeks, and a kitchen remodel is a considered purchase that people
 * research for a month before calling anyone. A 30-day window would quietly
 * hand print's conversions to whatever channel the homeowner happened to
 * touch last, and print is exactly the channel we are trying to measure.
 */
export const QR_COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

/** Parsed form of the cookie payload. */
export interface QrCookiePayload {
  slug: string;
  scanId: string | null;
}

/**
 * Parse the cookie value. Returns null for anything unexpected -- a malformed
 * cookie must never break a lead submission.
 */
export function parseQrCookie(raw: string | undefined): QrCookiePayload | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { s?: unknown; i?: unknown };
    const slug = typeof parsed.s === "string" ? parsed.s.trim() : "";
    if (!/^[a-z0-9][a-z0-9-]{1,30}$/.test(slug)) return null;
    const scanId = typeof parsed.i === "string" && parsed.i.length > 0 ? parsed.i : null;
    return { slug, scanId };
  } catch {
    return null;
  }
}
