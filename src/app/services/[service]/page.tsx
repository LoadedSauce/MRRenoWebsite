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

  // -- Testimonials per service ---------------------------------------------
  // Manually supplied. No third-party dependency.
  // No exclamation points per brand guardrails.
  // One quote per service, spread across the six active service cities
  // so the hub pages do not all read as Maple Grove projects.

  const testimonialMap: Record<ServiceSlug, TestimonialProps> = {
    kitchens: {
      quote:
        "We had been quoted by three other contractors and M.R. Renovations was the only one who walked us through the structural piece honestly. The wall came down, the island went in, and they were done in six weeks with no surprise change orders. The cabinetry detail is the part people notice first.",
      authorName: "Sarah M.",
      city: "Maple Grove, MN",
      projectType: "Kitchen Remodel",
      starCount: 5,
    },
    bathrooms: {
      quote:
        "Our primary bath was a 1990s builder-grade box and we needed it gutted. M.R. Renovations handled the moved plumbing, the curbless shower waterproofing, and the tile work entirely in-house. Five weeks start to finish and the shower has not had a single issue in two winters.",
      authorName: "Dana R.",
      city: "Plymouth, MN",
      projectType: "Bathroom Remodel",
      starCount: 5,
    },
    basements: {
      quote:
        "They added an egress window, framed a bedroom, finished a full bath, and put in a wet bar. Permits were already pulled when we signed, and inspections happened on schedule. The LVP, the trim, the lighting plan -- all dialed in.",
      authorName: "Kevin T.",
      city: "Coon Rapids, MN",
      projectType: "Basement Finish",
      starCount: 5,
    },
    additions: {
      quote:
        "A four-season sunroom addition felt like it was going to take a year. M.R. Renovations had it framed and dried in before winter, finished by spring, and matched the existing siding so well that visitors do not realize it is an addition. They handled every permit and every inspection.",
      authorName: "Lisa G.",
      city: "Rogers, MN",
      projectType: "Home Addition",
      starCount: 5,
    },
    "whole-home": {
      quote:
        "One contract, one project manager, one warranty across the whole house. We lived through fourteen weeks of construction and never had to chase anyone for an answer. Kitchen, two baths, basement, flooring throughout -- the result feels like a brand new build.",
      authorName: "Mark and Julie H.",
      city: "Eden Prairie, MN",
      projectType: "Whole Home Remodel",
      starCount: 5,
    },
    exterior: {
      quote:
        "We had hail damage on the roof and siding and were dreading the claim process. M.R. Renovations coordinated directly with our insurance adjuster, handled the supplements, and had the full James Hardie siding and GAF roof completed in under three weeks. The house looks better than it did before the storm.",
      authorName: "Brian K.",
      city: "St. Michael, MN",
      projectType: "Roofing & Siding",
      starCount: 5,
    },
  };

  const testimonial = testimonialMap[serviceParam as ServiceSlug];

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
      />
    </>
  );
}
