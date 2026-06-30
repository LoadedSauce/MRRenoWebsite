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
import {
  getTestimonialForArea,
  getPortfolioItemsByService,
} from "@/lib/supabase/queries";

// ADM-5: ISR -- pages regenerate hourly so admin edits surface without a deploy.
export const revalidate = 3600;

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

  const testimonialRow = await getTestimonialForArea(serviceParam, area.cityName);
  const testimonial: TestimonialProps = testimonialRow
    ? {
        quote: testimonialRow.quote,
        authorName: testimonialRow.author_name,
        city: testimonialRow.city ?? `${area.cityName}, ${area.stateAbbr}`,
        projectType: service.displayName,
        starCount: 5,
      }
    : {
        quote:
          "M.R. Renovations delivered exactly what they promised. On time, on budget, and the craftsmanship is excellent.",
        authorName: "Sarah M.",
        city: `${area.cityName}, ${area.stateAbbr}`,
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
        portfolioItems={galleryImages}
      />
    </>
  );
}
