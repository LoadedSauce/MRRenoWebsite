// src/lib/seo/routes.ts
//
// Route-family metadata builders. Each builder returns a Next.js `Metadata`
// object that should be returned from a route's `generateMetadata` export
// (or assigned to `metadata` for static routes).
//
// Titles and descriptions follow the locked patterns in P1.5. Description
// strings are clamped to 140-160 chars at a word boundary.

import type { Metadata } from "next";
import { SITE } from "./site";
import { canonical, path } from "./canonical";

// ----- Description trimmer -------------------------------------------------

const DESC_MIN = 140;
const DESC_MAX = 160;

function clampDescription(input: string): string {
  const trimmed = input.replace(/\s+/g, " ").trim();
  if (trimmed.length <= DESC_MAX) return trimmed;

  const slice = trimmed.slice(0, DESC_MAX);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > DESC_MIN ? slice.slice(0, lastSpace) : slice;
  return cut.trimEnd();
}

// ----- Shared OG / Twitter defaults ----------------------------------------

function ogDefaults(
  url: string,
  title: string,
  description: string,
  type: "website" | "article" = "website"
): Metadata["openGraph"] {
  return {
    title,
    description,
    url,
    siteName: SITE.brandName,
    type,
    locale: "en_US",
    images: [
      {
        url: SITE.defaultOgImage.url,
        width: SITE.defaultOgImage.width,
        height: SITE.defaultOgImage.height,
        alt: SITE.defaultOgImage.alt,
      },
    ],
  };
}

function twitterDefaults(title: string, description: string): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [SITE.defaultOgImage.url],
    ...(SITE.social.twitter
      ? { site: SITE.social.twitter, creator: SITE.social.twitter }
      : {}),
  };
}

// ----- Root / layout defaults ---------------------------------------------

/**
 * Defaults for `src/app/layout.tsx`. Sets metadataBase, the title template,
 * default robots, and default OG/Twitter so individual routes only need to
 * override what's specific to them.
 */
export function buildRootMetadata(): Metadata {
  const defaultTitle = `${SITE.brandName} | Remodeling Contractor in Maple Grove, MN`;
  const defaultDescription = clampDescription(
    `${SITE.brandName} -- licensed remodeling contractor in Maple Grove, MN. ` +
      `Kitchen, bathroom, basement, addition, and whole-home remodeling. ` +
      `Lifetime Transferable Workmanship Warranty. Free estimates.`
  );

  return {
    metadataBase: new URL(SITE.baseUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${SITE.brandName}`,
    },
    description: defaultDescription,
    applicationName: SITE.brandName,
    robots: { index: true, follow: true },
    openGraph: ogDefaults(SITE.baseUrl, defaultTitle, defaultDescription),
    twitter: twitterDefaults(defaultTitle, defaultDescription),
  };
}

// ----- Home ---------------------------------------------------------------

export function buildHomeMetadata(): Metadata {
  const url = canonical("/");
  const title = `${SITE.brandName} | Remodeling Contractor in Maple Grove, MN`;
  const description = clampDescription(
    `Kitchen, bathroom, basement, addition, and whole-home remodeling from ` +
      `${SITE.brandName}. Minnesota licensed contractor BC809200 serving ` +
      `Maple Grove and the northwest metro. Free estimates, Lifetime Warranty.`
  );
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: ogDefaults(url, title, description),
    twitter: twitterDefaults(title, description),
  };
}

// ----- Service hub --------------------------------------------------------

export interface ServiceLike {
  slug: string;
  name: string;              // e.g. "Kitchen Remodeling"
  shortLabel?: string;       // e.g. "Kitchens"
  description?: string;      // optional override for the meta description
}

export function buildServiceHubMetadata(service: ServiceLike): Metadata {
  const url = canonical(path("services", service.slug));
  const title = `${service.name} | ${SITE.brandName}`;
  const description = clampDescription(
    service.description ??
      `${service.name} from ${SITE.brandName}, a Maple Grove, MN remodeling ` +
        `contractor. Free No-Gimmick Estimates and a Lifetime Transferable Warranty.`
  );
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: ogDefaults(url, title, description),
    twitter: twitterDefaults(title, description),
  };
}

// ----- Service x area (Tier 3) -------------------------------------------

export interface ServiceAreaLike {
  slug: string;       // city slug, e.g. "rogers"
  name: string;       // display city name, e.g. "Rogers"
  isActive?: boolean; // optional flag from the registry
}

export function buildServiceAreaMetadata(
  service: ServiceLike,
  area: ServiceAreaLike
): Metadata {
  const url = canonical(path("services", service.slug, area.slug));
  const title = `${service.name} in ${area.name}, MN | ${SITE.brandName}`;
  // Brand is intentionally omitted from the Tier 3 description body: the
  // title, URL breadcrumb, and Google's site-name row already carry the
  // brand three times in the SERP card, so the limited description budget
  // is spent on the brand promises and service intent instead. Tuned to fit
  // the mobile SERP cap so both promises render fully on phones.
  const description = clampDescription(
    `${service.name} contractor in ${area.name}, MN. ` +
      `${SITE.brandName} serves ${area.name} and the northwest metro with ` +
      `free estimates and a Lifetime Transferable Workmanship Warranty. ` +
      `Licensed MN contractor BC809200.`
  );
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: ogDefaults(url, title, description),
    twitter: twitterDefaults(title, description),
  };
}

// ----- Service-area hub --------------------------------------------------

export function buildServiceAreaHubMetadata(area: ServiceAreaLike): Metadata {
  const url = canonical(path("service-areas", area.slug));
  const title = `Home Remodeling in ${area.name}, MN | ${SITE.brandName}`;
  const description = clampDescription(
    `${SITE.brandName} serves ${area.name}, MN - kitchens, baths, basements, ` +
      `additions, and whole home renovations backed by a Lifetime Transferable Warranty.`
  );
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: ogDefaults(url, title, description),
    twitter: twitterDefaults(title, description),
  };
}

// ----- Single-topic templates (project / guide / info) -------------------

export interface TopicPage {
  slug: string;
  title: string;          // page topic, e.g. "Galley Kitchen Refresh in Plymouth"
  description?: string;   // recommended: 140-160 char unique meta description
  collection: "projects" | "guides" | "info";
}

export function buildTopicMetadata(page: TopicPage): Metadata {
  const url = canonical(path(page.collection, page.slug));
  const title = `${page.title} | ${SITE.brandName}`;
  const description = clampDescription(
    page.description ??
      `${page.title} - from ${SITE.brandName}, a Maple Grove, MN remodeling contractor.`
  );
  const ogType = page.collection === "projects" ? "website" : "article";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: ogDefaults(url, title, description, ogType),
    twitter: twitterDefaults(title, description),
  };
}

// ----- Non-indexable utility (preview, thank-you, etc.) -------------------

export function buildNoIndexMetadata(): Metadata {
  return { robots: { index: false, follow: false } };
}

// ----- Legal / utility pages (P1.34b) -------------------------------------

export function buildPrivacyMetadata(): Metadata {
  const url = canonical("/privacy");
  const title = "Privacy Policy | M.R. Renovations";
  const description =
    "How M.R. Renovations collects, uses, and protects your personal information when you use our website or submit a project inquiry.";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: false },
    openGraph: ogDefaults(url, title, description),
    twitter: twitterDefaults(title, description),
  };
}

export function buildTermsMetadata(): Metadata {
  const url = canonical("/terms");
  const title = "Terms of Use | M.R. Renovations";
  const description =
    "Terms governing use of the M.R. Renovations website, including inquiry submissions and estimate requests.";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: false },
    openGraph: ogDefaults(url, title, description),
    twitter: twitterDefaults(title, description),
  };
}

export function buildAccessibilityMetadata(): Metadata {
  const url = canonical("/accessibility");
  const title = "Accessibility Statement | M.R. Renovations";
  const description =
    "M.R. Renovations accessibility commitment and contact information for accessibility feedback.";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: false },
    openGraph: ogDefaults(url, title, description),
    twitter: twitterDefaults(title, description),
  };
}

// ----- Supporting / conversion pages (P1.32) ------------------------------

export function buildContactMetadata(): Metadata {
  const url = canonical("/contact");
  const title = "Contact M.R. Renovations | Maple Grove, MN Remodeling Contractor";
  const description = clampDescription(
    "Reach M.R. Renovations in Maple Grove, MN. Call (763) 900-2024 or send a message. " +
      "Family-owned design-build serving the northwest metro for 43+ years."
  );
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: ogDefaults(url, title, description),
    twitter: twitterDefaults(title, description),
  };
}

export function buildConsultationMetadata(): Metadata {
  const url = canonical("/consultation");
  const title = "Free Estimate | M.R. Renovations -- Maple Grove, MN";
  const description = clampDescription(
    "Schedule a no-gimmick, in-home estimate with M.R. Renovations. " +
      "Licensed Minnesota contractor BC809200. Lifetime Transferable Workmanship Warranty. " +
      "No pressure, no obligation."
  );
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: ogDefaults(url, title, description),
    twitter: twitterDefaults(title, description),
  };
}

export function buildProcessMetadata(): Metadata {
  const url = canonical("/process");
  const title = "Our Remodeling Process | M.R. Renovations";
  const description = clampDescription(
    "How M.R. Renovations runs your project -- 9 steps from first call to final walkthrough, " +
      "one project manager, and a Lifetime Transferable Workmanship Warranty at the end."
  );
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: ogDefaults(url, title, description),
    twitter: twitterDefaults(title, description),
  };
}

export function buildWarrantyMetadata(): Metadata {
  const url = canonical("/warranty");
  const title = "Lifetime Transferable Workmanship Warranty | M.R. Renovations";
  const description = clampDescription(
    "Every M.R. Renovations project is backed by a Lifetime Transferable Workmanship Warranty " +
      "-- it covers our labor for the life of the home and transfers to future owners."
  );
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: ogDefaults(url, title, description),
    twitter: twitterDefaults(title, description),
  };
}

export function buildFinancingMetadata(): Metadata {
  const url = canonical("/financing");
  const title = "Home Improvement Financing | M.R. Renovations";
  const description = clampDescription(
    "M.R. Renovations partners with Hearth to offer home improvement financing. " +
      "Check your rate in minutes with no impact to your credit score. Loans up to $250,000."
  );
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: ogDefaults(url, title, description),
    twitter: twitterDefaults(title, description),
  };
}
