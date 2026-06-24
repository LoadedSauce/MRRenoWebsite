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

// -- Static params -----------------------------------------------------------
// Kitchens x Rogers only for Phase 1.4.

export function generateStaticParams() {
  return [{ service: "kitchens", area: "rogers" }];
}

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

  // -- Page-instance testimonial -------------------------------------------
  //
  // Manually supplied. No Google embed. No third-party dependency.
  // Swap inner content in ServicePageTemplate when live widget is ready.
  // No exclamation points per brand guardrails.

  const testimonial: TestimonialProps = {
    quote:
      "M.R. Renovations did an outstanding job on our kitchen. They kept the site clean, communicated every step of the way, handled all the Rogers permits without us lifting a finger, and the finished result exceeded what we had imagined.",
    authorName: "Jennifer K.",
    city: "Rogers, MN",
    projectType: "Kitchen Remodel",
    starCount: 5,
  };

  // -- P1.7: FAQ merge -------------------------------------------------------
  // getVisibleFaqs merges service base faqItems + area faqOverrides.
  // Empty array means no FAQ section renders and no FAQPage node is emitted.

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
    // FAQPage node only when there are visible questions
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
