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

const areaRegistry = serviceAreaRegistry;

type ServiceSlug = keyof typeof serviceRegistry;
type AreaSlug    = keyof typeof areaRegistry;

// -- Service slugs -----------------------------------------------------------

const SERVICE_SLUGS = [
  "kitchens",
  "bathrooms",
  "basements",
  "additions",
  "whole-home",
  "exterior",
] as const;

// -- Static params -----------------------------------------------------------
// P1.18: 6 services x 4 cities = 24 routes.

export function generateStaticParams() {
  const cities = ["maple-grove", "rogers", "plymouth", "coon-rapids"] as const;
  return SERVICE_SLUGS.flatMap((service) =>
    cities.map((area) => ({ service, area }))
  );
}

// -- Testimonials by area ----------------------------------------------------

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
  plymouth: {
    quote:
      "M.R. Renovations remodeled our basement and the result is stunning. They stayed on schedule, communicated every change, and their crew treated our home with respect throughout. We would hire them again without question.",
    authorName: "Lisa T.",
    city: "Plymouth, MN",
    projectType: "Basement Finish",
    starCount: 5,
  },
  "coon-rapids": {
    quote:
      "From the first estimate to the final walkthrough, M.R. Renovations was professional, transparent, and thorough. Our kitchen looks better than we imagined and the process was far smoother than we expected.",
    authorName: "Mark H.",
    city: "Coon Rapids, MN",
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

  const testimonial = testimonialsByArea[areaParam] ?? fallbackTestimonial;

  const faqItems = getVisibleFaqs(serviceParam, areaParam);

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
