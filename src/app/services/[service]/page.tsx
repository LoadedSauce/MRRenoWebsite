// src/app/services/[service]/page.tsx
//
// Tier 2 service hub page -- e.g. /services/kitchens
//
// Renders the ServicePageTemplate with a generic "Maple Grove" area context
// so the existing template (Hero, Gallery, FAQs, CTA) works without
// modification. City-specific pages remain at /services/[service]/[area].

import { notFound } from "next/navigation";
import { serviceRegistry } from "@/lib/service-data";
import { serviceAreaRegistry } from "@/lib/service-area-data";
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
// Generate a route for each service slug in the registry.

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

  // Use Maple Grove as the default area context for the hub page.
  // This provides a real area object to ServicePageTemplate without
  // inventing a new "generic" area type.
  const area =
    "maple-grove" in serviceAreaRegistry
      ? serviceAreaRegistry["maple-grove" as keyof typeof serviceAreaRegistry]
      : undefined;

  if (!area) notFound();

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
  // Pass serviceParam with a non-existent area slug so only base FAQs return.
  const faqItems = getVisibleFaqs(serviceParam, "__hub__");

  // -- Structured data -------------------------------------------------------

  const seoService = getService(serviceParam);
  const seoArea = getServiceArea("maple-grove");

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
        area={area}
        testimonial={testimonial}
        faqItems={faqItems}
      />
    </>
  );
}
