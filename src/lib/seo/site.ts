// src/lib/seo/site.ts
//
// Sitewide SEO constants and business facts for M.R. Renovations.
// This file is the single source of truth â€” do not duplicate these values
// elsewhere in the codebase. Update here only.

export const SITE = {
  // ----- Brand ---------------------------------------------------------------
  brandName: "M.R. Renovations",
  brandShortName: "MR Renovations",
  legalName: "M.R. Renovations",

  // ----- URL -----------------------------------------------------------------
  // Read from env so previews/staging get the right canonical host.
  // TODO: confirm production URL and set NEXT_PUBLIC_SITE_URL in prod env.
  // Value must NOT include a trailing slash.
  baseUrl: (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mrrenovations.com"
  ).replace(/\/+$/, ""),

  // ----- Business location (Maple Grove HQ) ---------------------------------
  address: {
    locality: "Maple Grove",
    region: "MN",
    regionFull: "Minnesota",
    country: "US",
    // TODO: confirm street address and ZIP before LocalBusiness schema ships.
    // Leave blank to omit from JSON-LD output.
    streetAddress: "" as string,
    postalCode: "" as string,
  },

  // Approximate Maple Grove centroid â€” used for areaServed GeoCircle.
  // TODO: confirm coordinates approved for public schema.
  geo: {
    latitude: 45.0725,
    longitude: -93.4558,
  },

  // ----- Contact -------------------------------------------------------------
  // TODO: replace with real values before launch. Blank values are omitted
  // from JSON-LD and meta tags, never emitted as empty attributes.
  phone: "" as string,        // E.164 for tel: links, e.g. "+1-763-555-0100"
  phoneDisplay: "" as string, // visible UI format, e.g. "(763) 555-0100"
  email: "" as string,        // e.g. "hello@mrrenovations.com"

  // ----- Service footprint --------------------------------------------------
  // Operating radius from Maple Grove. The brand guardrail is 25â€“30 mi â€”
  // 30 is the outer bound, used for areaServed GeoCircle radius.
  serviceRadiusMiles: 30,

  // ----- Core services ------------------------------------------------------
  // Slugs must match the route segments under /services/[service]/...
  // and the registry in src/lib/data/services. Order = nav/sitemap priority.
  coreServices: [
    { slug: "kitchens",   name: "Kitchen Remodeling" },
    { slug: "additions",  name: "Home Additions" },
    { slug: "whole-home", name: "Whole Home Remodeling" },
    { slug: "basements",  name: "Basement Finishing" },
    { slug: "bathrooms",  name: "Bathroom Remodels" },
  ] as const,

  // ----- Social -------------------------------------------------------------
  // Blank entries are omitted from sameAs and twitter:site/creator.
  // TODO: fill in real handles/URLs.
  social: {
    twitter: "" as string,   // e.g. "@mrrenovations"
    facebook: "" as string,  // full URL
    instagram: "" as string, // full URL
  },

  // ----- Default Open Graph image ------------------------------------------
  // TODO: ship a real 1200x630 asset at /public/og/default.png and confirm
  // alt text. Used for all OG/Twitter cards that don't supply their own.
  defaultOgImage: {
    url: "/og/default.png",
    width: 1200,
    height: 630,
    alt: "M.R. Renovations â€” Remodeling Contractor in Maple Grove, MN",
  },

  // ----- Canonical trailing-slash policy ------------------------------------
  // Next.js App Router defaults to no trailing slash; we match that.
  // If this changes, update next.config and re-run canonical tests.
  trailingSlash: false as const,
} as const;

export type CoreServiceSlug = (typeof SITE.coreServices)[number]["slug"];
