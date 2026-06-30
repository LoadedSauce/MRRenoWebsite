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
import { getService, getServiceArea, getVisibleFaqs } from "@/lib/data/services";
import {
  getTestimonialForService,
  getPortfolioItemsByService,
} from "@/lib/supabase/queries";

// ADM-5: ISR -- pages regenerate hourly so admin edits surface without a deploy.
export const revalidate = 3600;

type ServiceSlug = keyof typeof serviceRegistry;

// -- Static params -----------------------------------------------------------

export function generateStaticParams() {
  return Object.keys(serviceRegistry).map((slug) => ({ service: slug }));
}

// -- Metadata ----------------------------------------------------------------

interface PageProps {
  params: Promise<{ service: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service: sSlug } = await params;
  const service = getService(sSlug);
  if (!service) return {};
  return buildServiceHubMetadata(service);
}

// -- Page --------------------------------------------------------------------

export default async function ServiceHubPage({ params }: PageProps) {
  const { service: serviceParam } = await params;

  const service =
    serviceParam in serviceRegistry
      ? serviceRegistry[serviceParam as ServiceSlug]
      : undefined;

  if (!service) notFound();

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

  // -- FAQ items (service base only -- no city overrides on hub page) --------
  const faqItems = getVisibleFaqs(serviceParam, "__hub__");

  // -- Structured data -------------------------------------------------------

  const seoService = getService(serviceParam);
  const seoArea = getServiceArea("rogers");

  const graphNodes = [];
  if (seoService && seoArea) {
    graphNodes.push(
      buildBreadcrumbListSchema([
        { name: "Home", path: "/" },
        { name: seoService.name, path: `/services/${seoService.slug}` },
      ]),
      buildServiceSchema(seoService, seoArea)
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
      />
    </>
  );
}
