// src/app/r/[slug]/route.ts
//
// INT-004: the endpoint every printed QR code points at.
//
//   printed code -> /r/<slug> -> log the scan -> 302 to the destination
//
// The indirection is the whole point. A printed code cannot be changed once it
// is on a page in a magazine, so the code encodes a slug we control and the
// destination lives in `public.qr_codes` where it stays editable forever.
//
// Three rules govern everything below:
//
//  1. THE REDIRECT MUST NEVER FAIL. A scanner is standing in their kitchen
//     holding a magazine. If logging breaks, they still land on the site.
//     Every failure path here ends in a redirect, never in an error page.
//  2. NO RAW IP IS EVER STORED. We keep a salted SHA-256 so the same phone
//     scanning twice can be recognised as a repeat, and nothing more.
//  3. NEVER 301. A permanent redirect is cached by the browser forever, which
//     would silently stop logging repeat scans and make the destination
//     un-repointable for anyone who already scanned. Always 302.
//
// Pure helpers live in @/lib/qr/scan so they can be tested directly -- Next
// only permits the HTTP verbs and a few config values to be exported here.

import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { QR_COOKIE_NAME, QR_COOKIE_MAX_AGE } from "@/lib/qr/constants";
import {
  buildDestination,
  clientIp,
  geoFromHeaders,
  hashIp,
  isBotAgent,
  isValidSlug,
} from "@/lib/qr/scan";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: rawSlug } = await params;
  const slug = (rawSlug ?? "").toLowerCase().trim();

  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const incoming = requestUrl.searchParams;

  // Unknown, retired or malformed code -> home page, quietly. Someone mistyped
  // a URL or a code was pulled; a 404 helps nobody holding a magazine.
  const home = () => NextResponse.redirect(new URL("/", origin), 302);

  if (!isValidSlug(slug)) return home();

  let code: {
    id: string;
    slug: string;
    destination_path: string;
    utm_source: string;
    utm_medium: string;
    utm_campaign: string | null;
    utm_content: string | null;
    is_active: boolean;
  } | null = null;

  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("qr_codes")
      .select(
        "id,slug,destination_path,utm_source,utm_medium,utm_campaign,utm_content,is_active"
      )
      .eq("slug", slug)
      .maybeSingle();
    code = data;
  } catch (err) {
    console.error(`[qr] registry lookup failed for "${slug}":`, err);
    return home();
  }

  if (!code || !code.is_active) return home();

  const response = NextResponse.redirect(
    buildDestination(origin, code, incoming),
    302
  );

  // ── Log the scan. Nothing below may prevent the redirect. ────────────────
  try {
    const headers = request.headers;
    const userAgent = headers.get("user-agent");
    const isBot = isBotAgent(userAgent);
    const ipHash = hashIp(clientIp(headers), process.env.QR_IP_SALT);

    const supabase = createServiceRoleClient();

    // A repeat is the same hashed device hitting the same code before. Bots
    // are never marked repeat -- they are already excluded from the headline
    // count, and double-flagging just muddies the data.
    let isRepeat = false;
    if (!isBot && ipHash) {
      const { count } = await supabase
        .from("qr_scans")
        .select("id", { count: "exact", head: true })
        .eq("qr_code_id", code.id)
        .eq("ip_hash", ipHash)
        .eq("is_bot", false);
      isRepeat = (count ?? 0) > 0;
    }

    const { city, region, country } = geoFromHeaders(headers);

    const { data: scan } = await supabase
      .from("qr_scans")
      .insert({
        qr_code_id: code.id,
        slug: code.slug,
        is_repeat: isRepeat,
        is_bot: isBot,
        user_agent: userAgent,
        referer: headers.get("referer"),
        ip_hash: ipHash,
        city,
        region,
        country,
      })
      .select("id")
      .single();

    // The cookie is what links this scan to a lead the person submits later,
    // possibly weeks after they put the magazine down. httpOnly so the page
    // cannot read or forge it, and so it survives an ad blocker.
    //
    // Bots get no cookie -- they never fill in forms.
    if (!isBot && scan?.id) {
      response.cookies.set({
        name: QR_COOKIE_NAME,
        value: JSON.stringify({ s: code.slug, i: scan.id }),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: QR_COOKIE_MAX_AGE,
      });
    }
  } catch (err) {
    // Rule 1. Log it and let the person through.
    console.error(`[qr] failed to log scan for "${slug}":`, err);
  }

  return response;
}
