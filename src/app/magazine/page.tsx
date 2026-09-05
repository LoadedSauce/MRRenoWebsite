import type { Metadata } from "next";
import { HomePageBody } from "@/components/templates/HomePageBody";
import { canonical } from "@/lib/seo/canonical";

/**
 * INT-004 print-campaign landing page.
 *
 * Byte-for-byte the same experience as the home page -- it exists so print
 * spend has its own URL to measure. Scans of the Maple Grove Magazine code
 * land here via /r/mgmag, which logs the scan and attaches UTMs, so GA4 and
 * the admin Reports page can both attribute this traffic without guessing.
 *
 * Two deliberate differences from `/`:
 *
 * 1. noindex, nofollow. The body is identical to the home page, so letting
 *    Google index it would put two identical pages in the same results and
 *    split the ranking signal for our most valuable page. Print scanners
 *    reach it by URL, not by search, so nothing is lost. The canonical tag
 *    points at `/` as a second belt-and-braces signal.
 *
 * 2. No ISR. `/` is cached for an hour; this page is rendered per request so
 *    a campaign landing never serves a stale offer to someone who scanned a
 *    code five minutes after a copy change.
 *
 * Content comes from the SAME "home" page_content keys -- see HomePageBody.
 * There is no separate copy to keep in sync.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  // `absolute` bypasses the root layout's "%s | M.R. Renovations" template.
  // Without it the brand name lands twice, since it is already in the title.
  title: {
    absolute: "M.R. Renovations | Remodeling Contractor in Maple Grove, MN",
  },
  description:
    "Family-owned design-build remodeling for Twin Cities homeowners. Kitchens, bathrooms, basements, additions, and whole-home renovations.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  alternates: { canonical: canonical("/") },
};

export default async function MagazineLanding({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <HomePageBody searchParams={searchParams} />;
}
