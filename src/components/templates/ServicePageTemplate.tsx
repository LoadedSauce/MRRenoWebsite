import type { ServiceData, ServiceFaqItem } from "@/lib/service-data";
import type { ServiceAreaData } from "@/lib/service-area-types";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import { Hero } from "@/components/primitives/Hero";
import { Gallery } from "@/components/primitives/Gallery";
import { BeforeAfter } from "@/components/primitives/BeforeAfter";
import { TestimonialCard } from "@/components/primitives/TestimonialCard";
import { FaqAccordion } from "@/components/primitives/FaqAccordion";
import Link from "next/link";

// -- Testimonial props -------------------------------------------------------
//
// Manual block only -- no Google embed, no third-party dependency.
// starCount is locked at 5 for this section; the literal type enforces it.
//
// This section is STRUCTURALLY ISOLATED. To swap to a live reviews widget:
//   1. Replace <TestimonialCard {...testimonial} ... /> below with the widget.
//   2. Remove TestimonialProps from the route's page-instance const.
//   3. No changes needed to the surrounding section layout.

export type TestimonialProps = {
  quote: string;
  authorName: string;
  city: string;
  projectType: string;
  starCount: 5;
};

// -- Component props ---------------------------------------------------------

export interface ServicePageTemplateProps {
  service: ServiceData;
  area: ServiceAreaData;
  testimonial: TestimonialProps;
  // P1.7: merged FAQ items (service base + area overrides).
  // Computed by getVisibleFaqs() in page.tsx and passed down so the template
  // never has to know about the merge logic or area data shape.
  // When empty, the FAQ section is omitted from the DOM entirely.
  faqItems: ServiceFaqItem[];
}

// -- Template ----------------------------------------------------------------

export function ServicePageTemplate({
  service,
  area,
  testimonial,
  faqItems,
}: ServicePageTemplateProps) {
  // Hero sub-copy: area-specific service note > service default
  const heroCopy =
    area.serviceNotes?.[service.slug] ?? service.heroDefaultSubcopy;

  // Approved stat strip values (locked)
  const heroStats = [
    { label: "Experience",    value: "43 Yrs" },
    { label: "Google Rating", value: "5.0 \u2605" },
    { label: "Projects",      value: "500+"   },
    { label: "Warranty",      value: "\u221e" },
  ];

  return (
    <PageShell>

      {/* -- HERO --------------------------------------------------------- */}
      <Hero
        eyebrow={`${area.cityName}, ${area.stateAbbr} \u00b7 ${service.displayName}`}
        headline={
          <>
            {service.displayName} in{" "}
            <span className="accent">
              {area.cityName}, {area.stateAbbr}
            </span>
          </>
        }
        subCopy={heroCopy}
        primaryCta={{ label: "Get a Free Estimate", href: "tel:7639002024" }}
        secondaryCta={{ label: "See Our Work", href: "#gallery" }}
        stats={heroStats}
        imageSrc={service.galleryImages[0]?.src}
        imageAlt={
          service.galleryImages[0]?.alt ??
          `${service.displayName} project in ${area.cityName}, ${area.stateAbbr}`
        }
      />

      {/* -- GALLERY ------------------------------------------------------ */}
      <section id="gallery" className="bg-navy">
        <Container width="wide" className="py-16 lg:py-20">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            Recent work in {area.cityName}
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl tracking-tight text-paper leading-[1.1]">
            A few <span className="accent">local transformations.</span>
          </h2>
          <div className="mt-10">
            <Gallery images={service.galleryImages} />
          </div>
        </Container>
      </section>

      {/* -- BEFORE / AFTER ----------------------------------------------- */}
      <section className="bg-paper">
        <Container width="wide" className="py-16 lg:py-20">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            Transformation
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink leading-[1.1] mb-10">
            The before and <span className="accent">after.</span>
          </h2>
          <div className="max-w-3xl">
            <BeforeAfter
              before={{
                src: "/images/before-after/kitchen-before.jpg",
                alt: `Kitchen before remodel -- dated cabinetry and laminate countertops`,
              }}
              after={{
                src: "/images/before-after/kitchen-after.jpg",
                alt: `Kitchen after remodel -- custom cabinetry, quartz island, and tile backsplash`,
              }}
              caption={`${service.displayName} \u00b7 ${area.cityName}, ${area.stateAbbr}`}
            />
          </div>
        </Container>
      </section>

      {/* -- TESTIMONIAL -------------------------------------------------- */}
      {/*
        STRUCTURALLY ISOLATED SECTION.
        To swap to a live Google reviews widget:
          Replace <TestimonialCard ... /> with the widget component.
          The surrounding section layout does not change.
      */}
      <section aria-label="Customer testimonial" className="bg-cream">
        <Container width="narrow" className="py-16 lg:py-20">
          <TestimonialCard
            quote={testimonial.quote}
            authorName={testimonial.authorName}
            authorCity={testimonial.city}
            projectType={testimonial.projectType}
            starCount={testimonial.starCount}
            tone="cream"
            align="center"
          />
        </Container>
      </section>

      {/* -- FAQ ---------------------------------------------------------- */}
      {/* Section is omitted entirely from the DOM when faqItems is empty. */}
      {faqItems.length > 0 && (
        <section aria-labelledby="faq-heading" className="bg-paper">
          <Container width="default" className="py-16 lg:py-20">
            <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
              Common questions
            </p>
            <h2
              id="faq-heading"
              className="mt-3 font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink leading-[1.1] mb-8"
            >
              Answers before <span className="accent">you call.</span>
            </h2>
            <FaqAccordion items={faqItems} tone="light" />
          </Container>
        </section>
      )}

      {/* -- CTA BAND ----------------------------------------------------- */}
      <section className="bg-navy text-paper">
        <Container width="wide" className="py-16 lg:py-20 text-center">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            Ready when you are
          </p>
          <h2 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight text-paper leading-[1.05] max-w-2xl mx-auto">
            Let&rsquo;s build something{" "}
            <span className="accent">that lasts.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-soft-navy/85 leading-relaxed max-w-lg mx-auto">
            Tell us about your {area.cityName} project. We&rsquo;ll get back to
            you within one business day.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center w-full sm:w-auto bg-orange hover:bg-orange-deep text-paper font-display font-semibold px-6 py-3.5 rounded-md transition-colors"
            >
              Start your free estimate
            </Link>
            <a
              href="tel:7639002024"
              className="inline-flex items-center justify-center w-full sm:w-auto bg-paper/10 hover:bg-paper/20 text-paper border border-paper/40 font-display font-semibold px-6 py-3.5 rounded-md transition-colors"
            >
              Or call 763-900-2024
            </a>
          </div>
        </Container>
      </section>

    </PageShell>
  );
}
