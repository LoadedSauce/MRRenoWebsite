// src/lib/seo/schema.ts
//
// JSON-LD helper builders. All structured data flows through these helpers
// so the global @id graph stays consistent and we never invent claims that
// aren't visible on the page.
//
// Usage in a server component:
//
//   import { JsonLd, buildPageGraph, buildBreadcrumbListSchema } from "@/lib/seo/schema";
//   return (
//     <>
//       <JsonLd data={buildPageGraph([ buildBreadcrumbListSchema([...]) ])} />
//       {/* page content */}
//     </>
//   );

import React from "react";
import { SITE } from "./site";
import { canonical } from "./canonical";
import type { ServiceLike, ServiceAreaLike } from "./routes";

// ----- Stable @id URLs ----------------------------------------------------

export const SCHEMA_IDS = {
  organization: `${SITE.baseUrl}#organization`,
  localBusiness: `${SITE.baseUrl}#localbusiness`,
  website: `${SITE.baseUrl}#website`,
} as const;

// ----- Inline <script type="application/ld+json"> renderer ----------------

/**
 * Render a JSON-LD payload as an inline script tag. Use
 * dangerouslySetInnerHTML so quotes/escapes are preserved exactly.
 */
export function JsonLd({ data }: { data: unknown }): React.ReactElement {
  return React.createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  });
}

// ----- Organization / LocalBusiness ---------------------------------------

/**
 * Primary business entity. Uses GeneralContractor (a LocalBusiness subtype)
 * since MR is a remodeling contractor; this is more accurate than
 * the generic LocalBusiness type for Google's understanding.
 */
export function buildLocalBusinessSchema(): Record<string, unknown> {
  const sameAs = [
    SITE.social.facebook,
    SITE.social.instagram,
    SITE.social.twitter
      ? `https://twitter.com/${SITE.social.twitter.replace(/^@/, "")}`
      : "",
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": SCHEMA_IDS.localBusiness,
    name: SITE.brandName,
    legalName: SITE.legalName,
    url: SITE.baseUrl,
    ...(SITE.phone ? { telephone: SITE.phone } : {}),
    ...(SITE.email ? { email: SITE.email } : {}),
    image: `${SITE.baseUrl}${SITE.defaultOgImage.url}`,
    // TODO: replace with a real logo asset once available.
    logo: `${SITE.baseUrl}${SITE.defaultOgImage.url}`,
    address: {
      "@type": "PostalAddress",
      ...(SITE.address.streetAddress
        ? { streetAddress: SITE.address.streetAddress }
        : {}),
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      ...(SITE.address.postalCode ? { postalCode: SITE.address.postalCode } : {}),
      addressCountry: SITE.address.country,
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: SITE.geo.latitude,
        longitude: SITE.geo.longitude,
      },
      // miles â†’ meters
      geoRadius: String(Math.round(SITE.serviceRadiusMiles * 1609.34)),
    },
    knowsAbout: SITE.coreServices.map((s) => s.name),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function buildWebSiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SCHEMA_IDS.website,
    url: SITE.baseUrl,
    name: SITE.brandName,
    publisher: { "@id": SCHEMA_IDS.localBusiness },
  };
}

/**
 * Combined global graph for use in the root layout. Renders once per page.
 */
export function buildGlobalGraph(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [buildLocalBusinessSchema(), buildWebSiteSchema()],
  };
}

// ----- BreadcrumbList -----------------------------------------------------

export interface Breadcrumb {
  name: string;
  path: string; // path only, e.g. "/services/kitchens"
}

export function buildBreadcrumbListSchema(
  items: Breadcrumb[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  };
}

// ----- Service -----------------------------------------------------------

export function buildServiceSchema(
  service: ServiceLike,
  area?: ServiceAreaLike
): Record<string, unknown> {
  const name = area ? `${service.name} in ${area.name}, MN` : service.name;
  const urlPath = area
    ? `/services/${service.slug}/${area.slug}`
    : `/services/${service.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: service.name,
    provider: { "@id": SCHEMA_IDS.localBusiness },
    url: canonical(urlPath),
    ...(area
      ? {
          areaServed: {
            "@type": "City",
            name: `${area.name}, MN`,
          },
        }
      : {}),
    ...(service.description ? { description: service.description } : {}),
  };
}

// ----- FAQPage ------------------------------------------------------------

export interface FaqEntry {
  question: string;
  answer: string; // MUST match the answer text visible on the page exactly.
}

export function buildFaqPageSchema(faqs: FaqEntry[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

// ----- Per-page graph helper ---------------------------------------------

/**
 * Wrap a list of schema nodes in a single @graph payload so a route only
 * emits one <script> tag per page.
 */
export function buildPageGraph(
  nodes: Record<string, unknown>[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
