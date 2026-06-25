import { notFound } from "next/navigation";
import { serviceRegistry } from "@/lib/service-data";
import { serviceAreaRegistry } from "@/lib/service-area-data";
import {
  ServicePageTemplate,
  type TestimonialProps,
} from "@/components/templates/ServicePageTemplate";
import type { Metadata } from "next";
import { buildServiceAreaMetadata } from "@/lib/seo/routes";
import {
  JsonLd,
  buildBreadcrumbListSchema,
  buildServiceSchema,
  buildFaqPageSchema,
  buildPageGraph,
} from "@/lib/seo/schema";
import { getService, getServiceArea, getVisibleFaqs } from "@/lib/data/services";

// -- Area registry -----------------------------------------------------------
// Expand as new city files are added to src/lib/service-area-data/.

const areaRegistry = serviceAreaRegistry;

type ServiceSlug = keyof typeof serviceRegistry;
type AreaSlug    = keyof typeof areaRegistry;

// -- Service slugs (used in generateStaticParams) ----------------------------

const SERVICE_SLUGS = [
  "kitchens",
  "bathrooms",
  "basements",
  "additions",
  "whole-home",
  "exterior",
] as const;

// -- Static params -----------------------------------------------------------
// P1.17: 6 services x maple-grove + kitchens/rogers = 7 routes.

export function generateStaticParams() {
  const mapleGroveRoutes = SERVICE_SLUGS.map((service) => ({
    service,
    area: "maple-grove",
  }));
  return [
    ...mapleGroveRoutes,
    { service: "kitchens", area: "rogers" },
  ];
}

// -- Testimonials by area ----------------------------------------------------
//
// Manually supplied. No Google embed. No third-party dependency.
// Add an entry here whenever a new city launches.
// Falls back to `fallbackTestimonial` for any area not explicitly listed.

const testimonialsByArea: Record<string, TestimonialProps> = {
  rogers: {
    quote:
      "M.R. Renovations did an outstanding job on our kitchen. They kept the site clean, communicated every step of the way, handled all the Rogers permits without us lifting a finger, and the finished result exceeded what we had imagined.",
    authorName: "Jennifer K.",
    city: "Rogers, MN",
    projectType: "Kitchen Remodel",
    starCount: 5,
  },
  "maple-grove": {
    quote:
      "We used M.R. Renovations for our kitchen remodel and could not be more pleased. They are based right here in Maple Grove, which showed immediately -- they knew the permit process, they knew the neighborhood, and they treated our home with real care.",
    authorName: "David R.",
    city: "Maple Grove, MN",
    projectType: "Kitchen Remodel",
    starCount: 5,
  },
};

const fallbackTestimonial: TestimonialProps = {
  quote:
    "M.R. Renovations delivered exactly what they promised. The project came in on time, on budget, and the craftsmanship is excellent. We have already recommended them to three neighbors.",
  authorName: "Sarah M.",
  city: "Twin Cities, MN",
  projectType: "Home Renovation",
  starCount: 5,
};

// -- Page --------------------------------------------------------------------

interface PageProps {
  params: Promise<{ service: string; area: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service: sSlug, area: aSlug } = await params;
  const service = getService(sSlug);
  const area = getServiceArea(aSlug);
  if (!service || !area) return {};
  return buildServiceAreaMetadata(service, area);
}

export default async function ServiceAreaPage({ params }: PageProps) {
  const { service: serviceParam, area: areaParam } = await params;

  const service =
    serviceParam in serviceRegistry
      ? serviceRegistry[serviceParam as ServiceSlug]
      : undefined;

  const area =
    areaParam in areaRegistry
      ? areaRegistry[areaParam as AreaSlug]
      : undefined;

  if (!service || !area) {
    notFound();
  }

  // -- Testimonial -----------------------------------------------------------
  // Map lookup; falls back to generic Twin Cities testimonial if area
  // does not have an entry yet.

  const testimonial = testimonialsByArea[areaParam] ?? fallbackTestimonial;

  // -- P1.7: FAQ merge -------------------------------------------------------

  const faqItems = getVisibleFaqs(serviceParam, areaParam);

  // -- Structured data graph -------------------------------------------------

  const seoService = getService(serviceParam);
  const seoArea = getServiceArea(areaParam);

  const graphNodes = [];
  if (seoService && seoArea) {
    graphNodes.push(
      buildBreadcrumbListSchema([
        { name: "Home", path: "/" },
        { name: seoService.name, path: `/services/${seoService.slug}` },
        {
          name: `${seoService.name} in ${seoArea.name}, MN`,
          path: `/services/${seoService.slug}/${seoArea.slug}`,
        },
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
