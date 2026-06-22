import { notFound } from "next/navigation";
import { serviceRegistry } from "@/lib/service-data";
import { rogers } from "@/lib/service-area-data/rogers";
import {
  ServicePageTemplate,
  type TestimonialProps,
} from "@/components/templates/ServicePageTemplate";

// â”€â”€ Area registry â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Expand as new city files are added to src/lib/service-area-data/.

const areaRegistry = {
  rogers,
} as const;

type ServiceSlug = keyof typeof serviceRegistry;
type AreaSlug    = keyof typeof areaRegistry;

// â”€â”€ Static params â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Kitchens x Rogers only for Phase 1.4.

export function generateStaticParams() {
  return [{ service: "kitchens", area: "rogers" }];
}

// â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface PageProps {
  params: Promise<{ service: string; area: string }>;
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

  // â”€â”€ Page-instance testimonial â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  return (
    <ServicePageTemplate
      service={service}
      area={area}
      testimonial={testimonial}
    />
  );
}