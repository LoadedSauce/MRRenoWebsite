// src/lib/seo/site.ts
//
// Sitewide SEO constants and business facts for M.R. Renovations.
// This file is the single source of truth -- do not duplicate these values
// elsewhere in the codebase. Update here only.

export const SITE = {
  // ----- Brand ---------------------------------------------------------------
  brandName: "M.R. Renovations",
  brandShortName: "MR Renovations",
  legalName: "M.R. Renovations",

  // ----- URL -----------------------------------------------------------------
  // Read from env so previews/staging get the right canonical host.
  // Value must NOT include a trailing slash.
  baseUrl: (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.m-r-reno.com"
  ).replace(/\/+$/, ""),

  // ----- Business location (Maple Grove HQ) ---------------------------------
  address: {
    locality: "Maple Grove",
    region: "MN",
    regionFull: "Minnesota",
    country: "US",
    streetAddress: "7201 Forestview Lane N., Lower Suite" as string,
    postalCode: "55369" as string,
  },

  // Approximate Maple Grove centroid -- used for areaServed GeoCircle.
  geo: {
    latitude: 45.0725,
    longitude: -93.4558,
  },

  // ----- Contact -------------------------------------------------------------
  // Blank values are omitted from JSON-LD and meta tags, never emitted as
  // empty attributes.
  phone: "+1-763-900-2024" as string,        // E.164 for tel: links
  phoneDisplay: "(763) 900-2024" as string,  // visible UI format
  email: "j.walker@mrrenovations-llc.com" as string,

  // ----- Service footprint --------------------------------------------------
  // Operating radius from Maple Grove. Brand guardrail is 25-30 mi --
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
  social: {
    twitter: "" as string,
    facebook: "https://www.facebook.com/p/MR-Renovations-LLC-61575213753141/" as string,
    instagram: "" as string,
  },

  // ----- Default Open Graph image ------------------------------------------
  // TODO: ship a real 1200x630 asset at /public/og/default.png (ticket P1.9).
  // Used for all OG/Twitter cards that don't supply their own.
  defaultOgImage: {
    url: "/og/default.png",
    width: 1200,
    height: 630,
    alt: "M.R. Renovations - Remodeling Contractor in Maple Grove, MN",
  },

  // ----- Canonical trailing-slash policy ------------------------------------
  // Next.js App Router defaults to no trailing slash; we match that.
  // If this changes, update next.config and re-run canonical tests.
  trailingSlash: false as const,
} as const;

export type CoreServiceSlug = (typeof SITE.coreServices)[number]["slug"];
