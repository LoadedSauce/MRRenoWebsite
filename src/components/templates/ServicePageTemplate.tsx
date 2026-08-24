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
import { CTABand } from "@/components/cta-band";
import { getResource } from "@/lib/resources/index";
import Link from "next/link";
import type { PageContent } from "@/lib/page-content/loader";
import { EditableText } from "@/components/editable/EditableText";
import { EditModeOverlay } from "@/components/editable/EditModeOverlay";

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
  // Admin-selected hero photo for this service (migration 0012). When set,
  // overrides service.galleryImages[0] as the Hero primitive image; also
  // overrides the first portfolioItems entry if that fallback would apply.
  heroImage?: { src: string; alt: string };
  // Inline-edit-mode content bag. May be passed from Tier 2 hub pages OR
  // Tier 3 area pages. On Tier 2 hubs the pageKey is `service.<slug>` and
  // edits the hub-only chrome. On Tier 3 area pages the pageKey is
  // `service-area:<citySlug>` and edits city-specific copy (hero blurb,
  // drive-time, per-service note). The template branches on `cityLabel`
  // (== `area != null`) to route reads to the correct namespace.
  pageContent?: PageContent;
}

// -- Template ----------------------------------------------------------------

export function ServicePageTemplate({
  service,
  area,
  testimonial,
  faqItems,
  beforeAfterImages,
  portfolioItems,
  heroImage,
  pageContent,
}: ServicePageTemplateProps) {
  // Hero sub-copy: pageContent service-note override (Tier 3 only) > area
  // service note from service-area-data.ts > service default. On Tier 2
  // hub renders `area` is undefined so the service default is the only
  // source.
  const areaServiceNoteFallback = area?.serviceNotes?.[service.slug];
  const resolvedAreaServiceNote =
    area && pageContent
      ? pageContent.text(
          `service-area.service-note.${service.slug}`,
          areaServiceNoteFallback ?? ""
        )
      : areaServiceNoteFallback;
  const heroCopy =
    (resolvedAreaServiceNote && resolvedAreaServiceNote.length > 0
      ? resolvedAreaServiceNote
      : service.heroDefaultSubcopy);

  // Approved stat strip values (locked)
  // Experience and Google Rating are sitewide constants -- do not vary per page.
  const heroStats = [
    { label: "Experience",    value: "40+ Yrs" },
    { label: "Google Rating", value: "5.0 \u2605" },
    { label: "Projects",      value: "500+"    },
    { label: "Warranty",      value: "\u221e"  },
  ];

  // City label used in a few places -- only present when area is provided
  const cityLabel = area ? `${area.cityName}, ${area.stateAbbr}` : null;

  // P1.33: city-specific content, surfaced on Tier 3 (area) pages only.
  // Sourced from the ServiceAreaData already passed in via `area`. When the
  // page-content bag is present (Tier 3 area render with page_text_blocks
  // rows keyed by `service-area:<city>`), inline overrides layer on top of
  // the structural fallbacks that ship in service-area-data.ts.
  const areaServiceNote = resolvedAreaServiceNote;
  const areaHeroBlurb =
    area && pageContent
      ? pageContent.text("service-area.hero-blurb", area.heroBlurb)
      : area?.heroBlurb;
  const areaDriveTime =
    area && pageContent
      ? pageContent.text("service-area.drive-time-text", area.driveTimeText)
      : area?.driveTimeText;
  const areaRecentProjects = (area?.recentProjectExamples ?? []).filter(
    (p) => p.serviceSlug === service.slug
  );

  // P1.44: related cost guide nudge. Slug-to-slug lookup against the resources
  // registry -- services without a published guide (whole-home, exterior) get
  // undefined and the section renders nothing. No exclusion list to maintain.
  const relatedGuide = getResource(service.slug);

  // Hero image resolution (in priority order):
  //   1. Admin-selected hero photo via heroImage prop (migration 0012)
  //   2. First live portfolioItems entry if any exist (admin has featured items but no explicit hero)
  //   3. First static service-data.ts galleryImages entry
  //   4. undefined -> Hero primitive renders the design-system placeholder
  // If the page passed in pageContent, let a framework-set hero photo (from
  // page_photo_slots) override the migration 0012 admin hero. Registered slot
  // key is `service.<slug>.hero.image`.
  const contentHeroPhoto = pageContent?.photo(`service.${service.slug}.hero.image`, {
    src: "",
    alt: "",
  });
  const heroSrc =
    (contentHeroPhoto?.src || undefined) ??
    heroImage?.src ??
    portfolioItems?.[0]?.src ??
    service.galleryImages[0]?.src;
  const heroAlt =
    (contentHeroPhoto?.alt || undefined) ??
    heroImage?.alt ??
    portfolioItems?.[0]?.alt ??
    service.galleryImages[0]?.alt ??
    `${service.displayName} project${cityLabel ? ` in ${cityLabel}` : ""}`;

  // Little helpers to keep the JSX below readable. When pageContent is absent
  // (Tier 3 area page render), each call collapses to the fallback string.
  const p = `service.${service.slug}`;
  const eText = (blockKey: string, fallback: string, multiline = false) =>
    pageContent ? (
      <EditableText
        content={pageContent}
        blockKey={blockKey}
        fallback={fallback}
        multiline={multiline}
      />
    ) : (
      <>{fallback}</>
    );

  return (
    <PageShell>

      {/* -- HERO --------------------------------------------------------- */}
      <Hero
        eyebrow={
          cityLabel
            ? `${cityLabel} \u00b7 ${service.displayName}`
            : eText(`${p}.hero.eyebrow`, service.displayName)
        }
        headline={
          cityLabel ? (
            <>
              {service.displayName} in{" "}
              <span className="accent">{cityLabel}</span>
            </>
          ) : (
            <span className="accent">
              {eText(`${p}.hero.headline`, service.displayName)}
            </span>
          )
        }
        subCopy={
          pageContent && !cityLabel
            ? eText(`${p}.hero.subcopy`, heroCopy, true)
            : heroCopy
        }
        primaryCta={{
          label:
            pageContent && !cityLabel
              ? eText(`${p}.hero.cta.primary`, "Get a Free Estimate")
              : "Get a Free Estimate",
          href: "/consultation",
        }}
        secondaryCta={{
          label:
            pageContent && !cityLabel
              ? eText(`${p}.hero.cta.secondary`, "See Our Work")
              : "See Our Work",
          href: "#gallery",
        }}
        stats={heroStats}
        imageSrc={heroSrc}
        imageAlt={heroAlt}
      />

      {/* -- GALLERY ------------------------------------------------------ */}
      <section id="gallery" className="bg-navy">
        <Container width="wide" className="py-16 lg:py-20">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange-on-dark">
            {eText(`${p}.gallery.eyebrow`, "Recent work")}
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl tracking-tight text-paper leading-[1.1]">
            {cityLabel ? (
              <>A few <span className="accent">local transformations.</span></>
            ) : pageContent ? (
              eText(`${p}.gallery.headline`, "A few recent transformations.", true)
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
        (areaHeroBlurb || areaServiceNote || areaRecentProjects.length > 0) && (
          <section className="bg-cream">
            <Container width="wide" className="py-16 lg:py-20">
              <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
                {service.displayName} in {area.cityName}
              </p>

              {areaHeroBlurb && (
                <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed max-w-3xl">
                  {pageContent ? (
                    <EditableText
                      content={pageContent}
                      blockKey="service-area.hero-blurb"
                      fallback={area.heroBlurb}
                      multiline
                    />
                  ) : (
                    areaHeroBlurb
                  )}
                </p>
              )}

              {areaServiceNote && (
                <p className="mt-4 text-base text-muted leading-relaxed max-w-3xl">
                  {pageContent ? (
                    <EditableText
                      content={pageContent}
                      blockKey={`service-area.service-note.${service.slug}`}
                      fallback={areaServiceNoteFallback ?? ""}
                      multiline
                    />
                  ) : (
                    areaServiceNote
                  )}
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

              {areaDriveTime && (
                <p className="mt-3 text-sm text-muted">
                  {pageContent ? (
                    <EditableText
                      content={pageContent}
                      blockKey="service-area.drive-time-text"
                      fallback={area.driveTimeText}
                    />
                  ) : (
                    areaDriveTime
                  )}
                </p>
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
              {eText(`${p}.faq.eyebrow`, "Common questions")}
            </p>
            <h2
              id="faq-heading"
              className="mt-3 font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink leading-[1.1] mb-8"
            >
              {pageContent && !cityLabel ? (
                eText(`${p}.faq.headline`, "Answers before you call.", true)
              ) : (
                <>Answers before <span className="accent">you call.</span></>
              )}
            </h2>
            <FaqAccordion items={faqItems} tone="light" />
          </Container>
        </section>
      )}

      {/* -- RELATED COST GUIDE (renders only when a matching guide exists) */}
      {relatedGuide && relatedGuide.published && (
        <CTABand
          tone="tinted"
          eyebrow="Free Resource"
          title={relatedGuide.title}
          description={relatedGuide.dek}
          primary={{
            label: "Read the Guide",
            href: `/resources/${relatedGuide.slug}`,
          }}
        />
      )}

      {/* -- FINANCING CTA (renders on all Tier 2 and Tier 3 service pages) -- */}
      {/* Links to /financing, never to Hearth directly -- the /financing page
          carries the required Hearth broker disclosure (NMLS 1628533). */}
      <CTABand
        tone="tinted"
        eyebrow={
          pageContent && !cityLabel
            ? eText(`${p}.financing.eyebrow`, "Financing Available")
            : "Financing Available"
        }
        title={
          pageContent && !cityLabel
            ? eText(`${p}.financing.title`, "Payments starting as low as your grocery bill")
            : "Payments starting as low as your grocery bill"
        }
        description={
          pageContent && !cityLabel
            ? eText(
                `${p}.financing.description`,
                "Loans from $1,000 to $250,000 through Hearth. Check your rate in under 60 seconds. No impact to your credit score.",
                true
              )
            : "Loans from $1,000 to $250,000 through Hearth. Check your rate in under 60 seconds. No impact to your credit score."
        }
        primary={{
          label:
            pageContent && !cityLabel
              ? eText(`${p}.financing.cta`, "View Financing Options")
              : "View Financing Options",
          href: "/financing",
        }}
      />

      {/* -- CTA BAND ----------------------------------------------------- */}
      <section className="bg-navy text-paper">
        <Container width="wide" className="py-16 lg:py-20 text-center">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange-on-dark">
            {eText(`${p}.final.eyebrow`, "Ready when you are")}
          </p>
          <h2 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight text-paper leading-[1.05] max-w-2xl mx-auto">
            {pageContent && !cityLabel ? (
              eText(`${p}.final.headline`, "Let's build something that lasts.", true)
            ) : (
              <>
                Let&rsquo;s build something{" "}
                <span className="accent">that lasts.</span>
              </>
            )}
          </h2>
          <p className="mt-5 text-base sm:text-lg text-soft-navy/85 leading-relaxed max-w-lg mx-auto">
            {pageContent && !cityLabel ? (
              eText(
                `${p}.final.subcopy`,
                "Tell us about your project. We'll get back to you within one business day.",
                true
              )
            ) : (
              <>
                Tell us about your{cityLabel ? ` ${area!.cityName}` : ""} project. We&rsquo;ll get back to
                you within one business day.
              </>
            )}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center w-full sm:w-auto bg-orange hover:brightness-105 text-ink font-display font-semibold px-6 py-3.5 rounded-md transition"
            >
              {eText(`${p}.final.cta.primary`, "Start your free estimate")}
            </Link>
            <a
              href="tel:7639002024"
              className="inline-flex items-center justify-center w-full sm:w-auto bg-paper/10 hover:bg-paper/20 text-paper border border-paper/40 font-display font-semibold px-6 py-3.5 rounded-md transition-colors"
            >
              {eText(`${p}.final.cta.secondary`, "Or call 763-900-2024")}
            </a>
          </div>
        </Container>
      </section>

      {pageContent?.isEditMode ? (
        <EditModeOverlay
          currentPath={
            area
              ? `/services/${service.slug}/${area.citySlug}?edit=1`
              : `/services/${service.slug}?edit=1`
          }
        />
      ) : null}
    </PageShell>
  );
}
