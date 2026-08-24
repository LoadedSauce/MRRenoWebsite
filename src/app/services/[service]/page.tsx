// src/app/services/[service]/page.tsx
//
// Tier 2 service hub page -- e.g. /services/kitchens
//
// City-neutral. No city name, no area-specific copy. This is the clean
// service template that nav links and non-city ads point to.
//
// City-specific landing pages live at /services/[service]/[area] and receive
// the full ServicePageTemplate with area prop populated.

import { notFound } from "next/navigation";
import { serviceRegistry } from "@/lib/service-data";
import {
  ServicePageTemplate,
  type TestimonialProps,
} from "@/components/templates/ServicePageTemplate";
import type { Metadata } from "next";
import { buildServiceHubMetadata } from "@/lib/seo/routes";
import {
  JsonLd,
  buildBreadcrumbListSchema,
  buildServiceSchema,
  buildFaqPageSchema,
  buildPageGraph,
} from "@/lib/seo/schema";
import { getService, getVisibleFaqs } from "@/lib/data/services";
import {
  getTestimonialForService,
  getPortfolioItemsByService,
  getServiceHeroPhoto,
} from "@/lib/supabase/queries";
import { loadPageContent, detectEditMode } from "@/lib/page-content/loader";

// ADM-5: ISR -- pages regenerate hourly so admin edits surface without a deploy.
export const revalidate = 3600;

type ServiceSlug = keyof typeof serviceRegistry;

// -- Static params -----------------------------------------------------------
// Note: hub pages become dynamic-render at request time because the page now
// reads `searchParams` to detect edit mode. `generateStaticParams` is retained
// for the URL surface (metadata / SEO); ISR is capped by revalidate = 3600.

export function generateStaticParams() {
  return Object.keys(serviceRegistry).map((slug) => ({ service: slug }));
}

// -- Metadata ----------------------------------------------------------------

interface PageProps {
  params: Promise<{ service: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service: sSlug } = await params;
  const service = getService(sSlug);
  if (!service) return {};
  return buildServiceHubMetadata(service);
}

// -- Page --------------------------------------------------------------------

export default async function ServiceHubPage({ params, searchParams }: PageProps) {
  const { service: serviceParam } = await params;
  const sp = await searchParams;

  const service =
    serviceParam in serviceRegistry
      ? serviceRegistry[serviceParam as ServiceSlug]
      : undefined;

  if (!service) notFound();

  // Inline-edit mode (framework introduced in PR #109). Only enabled on hub
  // pages -- Tier 3 area pages fall through with pageContent undefined.
  const isEditMode = await detectEditMode(sp);
  const pageContent = await loadPageContent(`service.${serviceParam}`, isEditMode);

  // -- Testimonial (live, service-matched with sitewide fallback) -----------

  const testimonialRow = await getTestimonialForService(serviceParam);
  const testimonial: TestimonialProps = testimonialRow
    ? {
        quote: testimonialRow.quote,
        authorName: testimonialRow.author_name,
        city: testimonialRow.city ?? "Twin Cities, MN",
        projectType: service.displayName,
        starCount: 5,
      }
    : {
        quote:
          "M.R. Renovations delivered exactly what they promised. On time, on budget, and the craftsmanship is excellent.",
        authorName: "Sarah M.",
        city: "Twin Cities, MN",
        projectType: service.displayName,
        starCount: 5,
      };

  const portfolioItems = await getPortfolioItemsByService(serviceParam);
  const galleryImages =
    portfolioItems.length > 0
      ? portfolioItems.map((item) => ({
          src: item.photo_url,
          alt: item.caption ?? `${service.displayName} project`,
          caption: item.caption ?? undefined,
        }))
      : undefined;

  // Migration 0012: admin can set one hero photo per service. When present,
  // overrides the default hero image on the Tier 2 hub page.
  const heroRow = await getServiceHeroPhoto(serviceParam);
  const heroImage = heroRow
    ? {
        src: heroRow.photo_url,
        alt: heroRow.caption ?? `${service.displayName} project`,
      }
    : undefined;

  // -- FAQ items (service base only -- no city overrides on hub page) --------
  const faqItems = getVisibleFaqs(serviceParam, "__hub__");

  // -- Structured data -------------------------------------------------------

  const seoService = getService(serviceParam);

  const graphNodes = [];
  if (seoService) {
    graphNodes.push(
      buildBreadcrumbListSchema([
        { name: "Home", path: "/" },
        { name: seoService.name, path: `/services/${seoService.slug}` },
      ]),
      buildServiceSchema(seoService)
    );
    if (faqItems.length > 0) {
      graphNodes.push(buildFaqPageSchema(faqItems));
    }
  }

  const graph = graphNodes.length > 0 ? buildPageGraph(graphNodes) : null;

  return (
    <>
      {graph ? <JsonLd data={graph} /> : null}
      <ServicePageTemplate
        service={service}
        testimonial={testimonial}
        faqItems={faqItems}
        portfolioItems={galleryImages}
        heroImage={heroImage}
        pageContent={pageContent}
      />
    </>
  );
}
