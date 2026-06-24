// src/app/services/[service]/page.tsx
//
// Tier 2 service hub page -- e.g. /services/kitchens
//
// Renders the ServicePageTemplate with Maple Grove as the default area
// context. Maple Grove is the office city and serves as the hub fallback
// until a full maple-grove.ts area file is added to the registry (at which
// point the inline object below can be replaced with a registry lookup).
//
// City-specific pages remain at /services/[service]/[area].

import { notFound } from "next/navigation";
import { serviceRegistry } from "@/lib/service-data";
import type { ServiceAreaData } from "@/lib/service-area-types";
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

// -- Maple Grove area context ------------------------------------------------
// Inline until src/lib/service-area-data/maple-grove.ts is added to the
// registry. All required ServiceAreaData fields are populated here.

const mapleGrove: ServiceAreaData = {
  citySlug: "maple-grove",
  cityName: "Maple Grove",
  stateAbbr: "MN",
  driveTimeText: "Our office is located in Maple Grove.",
  neighborhoods: [
    "Arbor Lakes",
    "Fish Lake area",
    "Elm Creek",
    "Rush Creek",
    "Weaver Lake",
  ],
  nearbyLandmarks: [
    "Elm Creek Park Reserve",
    "Central Park",
    "Arbor Lakes shopping district",
    "Maple Grove Hospital",
  ],
  serviceNotes: {},
  recentProjectExamples: [
    {
      serviceSlug: "kitchens",
      title: "Maple Grove Kitchen Remodel",
      summary:
        "Custom walnut cabinetry, quartz countertops, and full electrical update in a 2000s two-story.",
    },
    {
      serviceSlug: "bathrooms",
      title: "Maple Grove Master Bath",
      summary:
        "Marble tile shower, double vanity, and heated floors in a primary suite remodel.",
    },
    {
      serviceSlug: "additions",
      title: "Maple Grove Four-Season Sunroom",
      summary:
        "New four-season sunroom addition with floor-to-ceiling windows and LVP flooring.",
    },
  ],
  heroBlurb:
    "M.R. Renovations is based in Maple Grove and has completed projects throughout the community for over four decades. We pull permits directly with the City of Maple Grove and have references across every neighborhood.",
};

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

  const testimonialMap: Record<ServiceSlug, TestimonialProps> = {
    kitchens: {
      quote:
        "M.R. Renovations completely transformed our kitchen. Their crew was professional, the timeline was accurate, and the quality of the cabinetry and countertops exceeded our expectations.",
      authorName: "Sarah M.",
      city: "Maple Grove, MN",
      projectType: "Kitchen Remodel",
      starCount: 5,
    },
    bathrooms: {
      quote:
        "From the first estimate to the final walkthrough, M.R. Renovations was communicative, clean, and delivered exactly what they promised. Our master bath is unrecognizable -- in the best way.",
      authorName: "Dana R.",
      city: "Maple Grove, MN",
      projectType: "Bathroom Remodel",
      starCount: 5,
    },
    basements: {
      quote:
        "We had a vision for our basement and M.R. Renovations brought it to life on time and on budget. The egress window, the bar area, the LVP flooring -- all perfect.",
      authorName: "Kevin T.",
      city: "Maple Grove, MN",
      projectType: "Basement Finish",
      starCount: 5,
    },
    additions: {
      quote:
        "Adding a four-season sunroom felt like a massive undertaking, but M.R. Renovations handled every permit, every inspection, and every detail. We use that room every single day.",
      authorName: "Lisa G.",
      city: "Maple Grove, MN",
      projectType: "Home Addition",
      starCount: 5,
    },
    "whole-home": {
      quote:
        "A whole-home remodel with one contractor and one warranty sounded too good to be true. M.R. Renovations proved us wrong -- single point of contact, zero surprises, stunning result.",
      authorName: "Mark and Julie H.",
      city: "Maple Grove, MN",
      projectType: "Whole Home Remodel",
      starCount: 5,
    },
  };

  const testimonial = testimonialMap[serviceParam as ServiceSlug];

  // -- FAQ items (service base only -- no city overrides on hub page) --------
  // Pass a non-existent area slug so getVisibleFaqs returns only base items.
  const faqItems = getVisibleFaqs(serviceParam, "__hub__");

  // -- Structured data -------------------------------------------------------

  const seoService = getService(serviceParam);
  // Use rogers for schema since it is the only registered area; the hub page
  // canonical URL does not include a city segment so this is schema-only.
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
        area={mapleGrove}
        testimonial={testimonial}
        faqItems={faqItems}
      />
    </>
  );
}
