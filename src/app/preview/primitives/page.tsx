import { PageShell }       from "@/components/page-shell";
import { Container }       from "@/components/container";
import { Hero }            from "@/components/primitives/Hero";
import { Gallery }         from "@/components/primitives/Gallery";
import { BeforeAfter }     from "@/components/primitives/BeforeAfter";
import { TestimonialCard } from "@/components/primitives/TestimonialCard";
import { FaqAccordion }    from "@/components/primitives/FaqAccordion";
import { rogersServiceArea } from "@/lib/service-area-data-example";

const previewImages = [
  { src: "/images/project-miller-kitchen.jpg", alt: "Completed kitchen with white cabinetry and island.",        caption: "The Miller Kitchen \u00b7 Maple Grove, MN"   },
  { src: "/images/project-johnson-lower.jpg",  alt: "Finished basement with built-in millwork.",                 caption: "The Johnson Lower Level \u00b7 Plymouth, MN" },
  { src: "/images/project-carter-addition.jpg",alt: "Two-story home addition, exterior shot.",                   caption: "The Carter Addition \u00b7 Wayzata, MN"      },
  { src: "/images/service-kitchen.jpg",        alt: "Kitchen remodel sample."    },
  { src: "/images/service-bathroom.jpg",       alt: "Bathroom remodel sample."   },
  { src: "/images/service-basement.jpg",       alt: "Basement finish sample."    },
];

const previewFaq = [
  {
    question: "How long does a kitchen remodel take in Rogers?",
    answer:
      "Most full kitchen remodels in Rogers take six to ten weeks from permit approval to final walkthrough. We provide a written project schedule before any work begins.",
  },
  {
    question: "Do you handle permits for Rogers projects?",
    answer:
      "Yes. We pull all permits directly with the City of Rogers and coordinate inspections. Homeowners never need to visit city hall.",
  },
  {
    question: "What is the Lifetime Transferable Workmanship Warranty?",
    answer:
      "Our workmanship is backed for the life of the home, and the warranty transfers to the next owner if the home is sold. We document this in writing at project close.",
  },
];

export default function PrimitivesPreviewPage() {
  return (
    <PageShell>

      {/* Page header */}
      <div className="bg-cream border-b border-cream-deep">
        <Container width="wide" className="py-6">
          <p className="font-display font-semibold text-xs uppercase tracking-[0.14em] text-orange">
            Internal \u2014 not linked from navigation
          </p>
          <h1 className="mt-2 font-display font-bold text-2xl text-ink">
            Template Primitives Preview
          </h1>
          <p className="mt-1 text-sm text-muted">
            Phase 1.3 \u2014 verify all primitives against the live design system before the service-page build starts.
          </p>
        </Container>
      </div>

      {/* 1. Hero */}
      <Hero
        eyebrow={`Kitchen Remodeling \u00b7 ${rogersServiceArea.cityName}, MN`}
        headline={
          <>
            Kitchen remodels built to last{" "}
            <span className="accent">in Rogers.</span>
          </>
        }
        subCopy={rogersServiceArea.heroBlurb}
        primaryCta={{ label: "Get a Free Estimate", href: "/consultation" }}
        secondaryCta={{ label: "Call 763-900-2024", href: "tel:7639002024" }}
        stats={[
          { label: "Years of Craft",      value: "40"   },
          { label: "Projects Completed",  value: "500+" },
          { label: "Warranty",            value: "\u221e" },
          { label: "Avg. Rating",         value: "4.9"  },
        ]}
      />

      {/* 2. Gallery */}
      <section className="bg-navy-deep">
        <Container width="wide" className="py-16 lg:py-20">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            Primitive \u2014 Gallery
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl tracking-tight text-paper leading-[1.1]">
            Project photography
          </h2>
          <p className="mt-4 text-base text-soft-navy/85 max-w-2xl">
            3-col desktop, 2-col mobile. Click any image to open the lightbox. Keyboard: arrow keys navigate, Escape closes.
          </p>
          <div className="mt-10">
            <Gallery images={previewImages} />
          </div>
        </Container>
      </section>

      {/* 3. Before / After */}
      <section className="bg-paper">
        <Container width="wide" className="py-16 lg:py-20">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            Primitive \u2014 Before / After
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink leading-[1.1]">
            Static side-by-side
          </h2>
          <p className="mt-4 text-base text-muted max-w-2xl">
            No slider. Desktop: side-by-side. Mobile: stacked, before on top.
          </p>
          <div className="mt-10 max-w-4xl">
            <BeforeAfter
              before={{
                src: "/images/service-kitchen.jpg",
                alt: "Kitchen before remodel \u2014 dated cabinetry and laminate countertops.",
              }}
              after={{
                src: "/images/project-miller-kitchen.jpg",
                alt: "Kitchen after remodel \u2014 custom cabinetry and quartz island.",
              }}
              caption="The Miller Kitchen \u00b7 Maple Grove, MN \u00b7 Kitchen Remodel"
            />
          </div>
        </Container>
      </section>

      {/* 4a. Testimonial â€” cream / centered (matches existing home-page review section) */}
      <section className="bg-cream">
        <Container width="narrow" className="py-16 lg:py-20">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange text-center mb-8">
            Primitive \u2014 TestimonialCard (cream, centered)
          </p>
          <TestimonialCard
            quote="M.R. Renovations transformed our outdated kitchen into a modern masterpiece. Their attention to detail and commitment to quality were outstanding \u2014 and the Lifetime Warranty sealed it for us."
            authorName="Sarah Miller"
            authorCity="Maple Grove"
            projectType="Kitchen Remodel"
            starCount={5}
            tone="cream"
            align="center"
          />
        </Container>
      </section>

      {/* 4b. Testimonial â€” navy / left-aligned card grid */}
      <section className="bg-navy">
        <Container width="default" className="py-16 lg:py-20">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange mb-8">
            TestimonialCard \u2014 navy tone, left-aligned grid
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            <TestimonialCard
              quote="From permit to final walkthrough, the process was exactly what they promised. No surprises."
              authorName="James T."
              authorCity="Rogers"
              projectType="Basement Finish"
              starCount={5}
              tone="navy"
              align="left"
            />
            <TestimonialCard
              quote="One project manager from day one. That alone was worth it."
              authorName="Linda K."
              authorCity="Plymouth"
              projectType="Whole-Home Renovation"
              tone="navy"
              align="left"
            />
          </div>
        </Container>
      </section>

      {/* 5a. FAQ â€” light tone */}
      <section className="bg-paper">
        <Container width="default" className="py-16 lg:py-20">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            Primitive \u2014 FaqAccordion (light)
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink leading-[1.1] mb-8">
            Common questions
          </h2>
          <FaqAccordion items={previewFaq} tone="light" />
        </Container>
      </section>

      {/* 5b. FAQ â€” dark tone */}
      <section className="bg-navy-deep">
        <Container width="default" className="py-16 lg:py-20">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange mb-8">
            FaqAccordion \u2014 dark tone
          </p>
          <FaqAccordion items={previewFaq} tone="dark" />
        </Container>
      </section>

      {/* 6. ServiceAreaData fixture dump */}
      <section className="bg-cream">
        <Container width="default" className="py-16 lg:py-20">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            ServiceAreaData \u2014 Rogers fixture
          </p>
          <h2 className="mt-3 font-display font-bold text-2xl text-ink mb-6">
            Local-content data shape
          </h2>
          <pre className="rounded-lg bg-navy-deep text-paper text-xs p-6 overflow-x-auto leading-relaxed">
            {JSON.stringify(rogersServiceArea, null, 2)}
          </pre>
        </Container>
      </section>

    </PageShell>
  );
}