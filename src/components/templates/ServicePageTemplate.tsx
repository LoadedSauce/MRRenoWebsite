import type { ServiceData, ServiceFaqItem } from "@/lib/service-data";
import type { ServiceAreaData } from "@/lib/service-area-types";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import { Hero } from "@/components/primitives/Hero";
import { Gallery } from "@/components/primitives/Gallery";
import { BeforeAfter } from "@/components/primitives/BeforeAfter";
import type { BeforeAfterImage } from "@/components/primitives/BeforeAfter";
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

// -- Before/after images prop ------------------------------------------------
//
// Optional. When absent, the Before/After section is omitted from the DOM
// entirely -- no broken images, no placeholder boxes.
// When real photos are ready, pass this prop from the route's page.tsx and
// the section renders automatically. No further changes to the template needed.

export type BeforeAfterImages = {
  before: BeforeAfterImage;
  after: BeforeAfterImage;
};

// -- Component props ---------------------------------------------------------
//
// `area` is optional. When omitted the template renders as a city-neutral
// service hub page (/services/kitchens). When provided it renders as a
// city-specific landing page (/services/kitchens/rogers) with local
// copy layered on top of the service defaults.

export interface ServicePageTemplateProps {
  service: ServiceData;
  area?: ServiceAreaData;
  testimonial: TestimonialProps;
  // P1.7: merged FAQ items (service base + area overrides).
  // Computed by getVisibleFaqs() in page.tsx and passed down so the template
  // never has to know about the merge logic or area data shape.
  // When empty, the FAQ section is omitted from the DOM entirely.
  faqItems: ServiceFaqItem[];
  // P1.19: optional before/after image pair. Section hidden when absent.
  beforeAfterImages?: BeforeAfterImages;
  // ADM-5: optional live portfolio items for the Gallery. When provided and
  // non-empty, they override service.galleryImages; otherwise the static
  // service-data.ts gallery renders as fallback.
  portfolioItems?: Array<{ src: string; alt: string; caption?: string }>;
}

// -- Template ----------------------------------------------------------------

export function ServicePageTemplate({
  service,
  area,
  testimonial,
  faqItems,
  beforeAfterImages,
  portfolioItems,
}: ServicePageTemplateProps) {
  // Hero sub-copy: area service note > service default
  const heroCopy =
    (area?.serviceNotes?.[service.slug] ?? service.heroDefaultSubcopy);

  // Approved stat strip values (locked)
  // Experience and Google Rating are sitewide constants -- do not vary per page.
  const heroStats = [
    { label: "Experience",    value: "43+ Yrs" },
    { label: "Google Rating", value: "5.0 \u2605" },
    { label: "Projects",      value: "500+"    },
    { label: "Warranty",      value: "\u221e"  },
  ];

  // City label used in a few places -- only present when area is provided
  const cityLabel = area ? `${area.cityName}, ${area.stateAbbr}` : null;

  // P1.33: city-specific content, surfaced on Tier 3 (area) pages only.
  // Sourced from the ServiceAreaData already passed in via `area` -- the
  // registry data was always flowing through; it was just never rendered.
  const areaServiceNote = area?.serviceNotes?.[service.slug];
  const areaRecentProjects = (area?.recentProjectExamples ?? []).filter(
    (p) => p.serviceSlug === service.slug
  );

  return (
    <PageShell>

      {/* -- HERO --------------------------------------------------------- */}
      <Hero
        eyebrow={
          cityLabel
            ? `${cityLabel} \u00b7 ${service.displayName}`
            : service.displayName
        }
        headline={
          cityLabel ? (
            <>
              {service.displayName} in{" "}
              <span className="accent">{cityLabel}</span>
            </>
          ) : (
            <span className="accent">{service.displayName}</span>
          )
        }
        subCopy={heroCopy}
        primaryCta={{ label: "Get a Free Estimate", href: "/consultation" }}
        secondaryCta={{ label: "See Our Work", href: "#gallery" }}
        stats={heroStats}
        imageSrc={service.galleryImages[0]?.src}
        imageAlt={
          service.galleryImages[0]?.alt ??
          `${service.displayName} project${cityLabel ? ` in ${cityLabel}` : ""}`
        }
      />

      {/* -- GALLERY ------------------------------------------------------ */}
      <section id="gallery" className="bg-navy">
        <Container width="wide" className="py-16 lg:py-20">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            Recent work
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl tracking-tight text-paper leading-[1.1]">
            {cityLabel ? (
              <>A few <span className="accent">local transformations.</span></>
            ) : (
              <>A few <span className="accent">recent transformations.</span></>
            )}
          </h2>
          <div className="mt-10">
            <Gallery
              images={
                portfolioItems && portfolioItems.length > 0
                  ? portfolioItems
                  : service.galleryImages
              }
            />
          </div>
        </Container>
      </section>

      {/* -- BEFORE / AFTER ----------------------------------------------- */}
      {beforeAfterImages && (
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
                before={beforeAfterImages.before}
                after={beforeAfterImages.after}
                caption={
                  cityLabel
                    ? `${service.displayName} \u00b7 ${cityLabel}`
                    : service.displayName
                }
              />
            </div>
          </Container>
        </section>
      )}

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

      {/* -- CITY-SPECIFIC CONTENT (Tier 3 area pages only) --------------- */}
      {area &&
        (area.heroBlurb || areaServiceNote || areaRecentProjects.length > 0) && (
          <section className="bg-cream">
            <Container width="wide" className="py-16 lg:py-20">
              <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
                {service.displayName} in {area.cityName}
              </p>

              {area.heroBlurb && (
                <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed max-w-3xl">
                  {area.heroBlurb}
                </p>
              )}

              {areaServiceNote && (
                <p className="mt-4 text-base text-muted leading-relaxed max-w-3xl">
                  {areaServiceNote}
                </p>
              )}

              {areaRecentProjects.length > 0 && (
                <div className="mt-10">
                  <p className="font-display font-bold text-xl text-ink">
                    Recent {service.displayName} Work in {area.cityName}
                  </p>
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {areaRecentProjects.map((project) => (
                      <div
                        key={project.title}
                        className="rounded-xl border border-faint bg-paper p-6"
                      >
                        <p className="font-display font-bold text-ink">
                          {project.title}
                        </p>
                        <p className="mt-2 text-sm text-muted leading-relaxed">
                          {project.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {area.neighborhoods && area.neighborhoods.length > 0 && (
                <p className="mt-8 text-sm text-muted">
                  We work throughout {area.cityName} including{" "}
                  {area.neighborhoods.slice(0, 4).join(", ")}.
                </p>
              )}

              {area.driveTimeText && (
                <p className="mt-3 text-sm text-muted">{area.driveTimeText}</p>
              )}
            </Container>
          </section>
        )}

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
            Tell us about your{cityLabel ? ` ${area!.cityName}` : ""} project. We&rsquo;ll get back to
            you within one business day.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center w-full sm:w-auto bg-orange hover:opacity-90 text-paper font-display font-semibold px-6 py-3.5 rounded-md transition-colors"
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
