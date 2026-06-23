import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import type { Metadata } from "next";
import { buildHomeMetadata } from "@/lib/seo/routes";

export const metadata: Metadata = buildHomeMetadata();

const services = [
  {
    n: "01",
    name: "Kitchen Remodeling",
    body: "Custom cabinetry, quartz, islands, and the hidden electrical, plumbing, and structural work that separates a real remodel from a refresh.",
    href: "#kitchen",
    badge: "Most Requested",
    image: "/images/service-kitchen.jpg",
    alt: "Recently completed M.R. Renovations kitchen with cherry cabinets and mosaic tile backsplash.",
  },
  {
    n: "02",
    name: "Bathroom Remodeling",
    body: "From en-suite spa retreats to family-friendly mushroom baths. Tile work that lasts decades.",
    href: "#bathroom",
    image: "/images/service-bathroom.jpg",
    alt: "Bathroom remodel with double vanity and barn-style mirror frames.",
  },
  {
    n: "03",
    name: "Basement Finishing",
    body: "Code-correct egress, true-height ceilings, finished living square footage that adds resale value.",
    href: "#basement",
    image: "/images/service-basement.jpg",
    alt: "Finished basement with dark accent wall and modern living layout.",
  },
  {
    n: "04",
    name: "Home Additions",
    body: "Second-stories, primary-suite additions, four-season rooms. Engineered, permitted, beautiful.",
    href: "#additions",
    image: "/images/service-additions.jpg",
    alt: "Home addition framing in progress, structural rough-in visible.",
  },
  {
    n: "05",
    name: "Whole-Home Renovation",
    body: "A single contract, a single project manager, one Lifetime Warranty covering the entire home.",
    href: "#whole-home",
    image: "/images/service-whole-home.jpg",
    alt: "Open-concept kitchen and living area from a whole-home renovation.",
  },
  {
    n: "06",
    name: "Roofing, Siding & Exterior",
    body: "Storm restoration, full exterior packages, windows, doors, and garages. James Hardie, GAF, Marvin, and Trex certified.",
    href: "#exterior",
    image: "/images/service-exterior.jpg",
    alt: "Exterior of a craftsman-style home with mature landscaping.",
  },
];

const processSteps = [
  {
    n: "01",
    title: "Listen & Design",
    body: "In-home consult. We listen first, then sketch. Fee design phase with three concepts and two revisions. You see real renderings before any construction estimate.",
  },
  {
    n: "02",
    title: "Plan & Price",
    body: "Line-itemized, guaranteed-price contract. Every selection priced. Every assumption stated in writing. No TBD allowed.",
  },
  {
    n: "03",
    title: "Build & Warranty",
    body: "One project manager from day one. Weekly walk-throughs. Final punch-list signed by you. Then backed by our Lifetime Transferable Workmanship Warranty.",
  },
];

const projects = [
  {
    area: "Kitchen",
    weeks: "6 weeks",
    title: "The Miller Kitchen",
    location: "Maple Grove, MN",
    image: "/images/project-miller-kitchen.jpg",
    alt: "Recently finished kitchen with white cabinetry and large island.",
  },
  {
    area: "Basement",
    weeks: "8 weeks",
    title: "The Johnson Lower Level",
    location: "Plymouth, MN",
    image: "/images/project-johnson-lower.jpg",
    alt: "Finished basement living area with built-in millwork.",
  },
  {
    area: "Addition",
    weeks: "12 weeks",
    title: "The Carter Addition",
    location: "Wayzata, MN",
    image: "/images/project-carter-addition.jpg",
    alt: "Two-story addition exterior shot in the Twin Cities.",
  },
];

const offers = [
  {
    label: "FREE",
    title: "No-Gimmick Estimates",
    body: "Real in-home consults with a real designer. No \"today only\" pricing pressure. Ever.",
  },
  {
    label: "2%",
    title: "Cash Discount",
    body: "Pay by check or wire and we credit 2% off the full project cost.",
  },
  {
    label: "5%",
    title: "Service Discount",
    body: "First Responders, Veterans, and Seniors 65+ receive 5% off your project. Thank you for your service.",
  },
];

export default function Home() {
  return (
    <PageShell>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden text-paper bg-navy-deep">
        {/* Background photo */}
        <Image
          src="/images/hero-home.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        {/* Gradient overlay for text legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-navy-deep/95 via-navy-deep/70 to-navy-deep/40"
          aria-hidden="true"
        />

        <Container width="wide" className="relative py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-soft-orange/95">
              Maple Grove, MN &middot; Twin Cities &middot; Since 1985
            </p>
            <h1 className="mt-5 font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-paper">
              Built once. <span className="accent">Built right.</span><br className="hidden sm:block" />
              <span> </span><span className="accent">Built to last.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-soft-navy/95 max-w-2xl">
              Family-owned design-build for Twin Cities homeowners who want their renovation done with craft, transparency, and a Lifetime Transferable Workmanship Warranty.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center bg-orange hover:bg-orange-deep text-paper font-display font-semibold px-6 py-3.5 rounded-md transition-colors"
              >
                Get a Free Estimate
              </Link>
              <Link
                href="#projects"
                className="inline-flex items-center justify-center bg-paper/10 hover:bg-paper/20 text-paper border border-paper/40 font-display font-semibold px-6 py-3.5 rounded-md transition-colors backdrop-blur-sm"
              >
                See Our Work
              </Link>
            </div>
          </div>

          <dl className="mt-14 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8 border-t border-paper/15 pt-8">
            <div>
              <dt className="font-display font-semibold tracking-[0.12em] uppercase text-[10px] text-soft-orange/90">Years of Craft</dt>
              <dd className="mt-1 font-display font-bold text-3xl text-paper">40</dd>
            </div>
            <div>
              <dt className="font-display font-semibold tracking-[0.12em] uppercase text-[10px] text-soft-orange/90">Twin Cities Homes</dt>
              <dd className="mt-1 font-display font-bold text-3xl text-paper">500+</dd>
            </div>
            <div>
              <dt className="font-display font-semibold tracking-[0.12em] uppercase text-[10px] text-soft-orange/90">Lifetime Warranty</dt>
              <dd className="mt-1 font-display font-bold text-3xl text-paper">&infin;</dd>
            </div>
            <div>
              <dt className="font-display font-semibold tracking-[0.12em] uppercase text-[10px] text-soft-orange/90">Verified Reviews</dt>
              <dd className="mt-1 font-display font-bold text-3xl text-paper">
                <span aria-hidden="true">&#9733;</span> 4.9
              </dd>
            </div>
          </dl>
        </Container>
      </section>

      {/* ── WARRANTY STRIP ─────────────────────────────────────── */}
      <section id="warranty" className="bg-navy text-paper">
        <Container width="wide" className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-paper/10 text-orange font-display font-bold text-xl shrink-0"
              aria-hidden="true"
            >
              &infin;
            </span>
            <div>
              <p className="font-display font-bold text-paper text-base sm:text-lg">
                Lifetime Transferable Workmanship Warranty
              </p>
              <p className="text-sm text-soft-navy/90">
                It stays with the home, even if you sell. Almost no contractor in Minnesota offers this.
              </p>
            </div>
          </div>
          <Link
            href="#warranty-details"
            className="inline-flex items-center justify-center bg-paper text-navy font-display font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-soft-navy transition-colors whitespace-nowrap"
          >
            How the warranty works &rarr;
          </Link>
        </Container>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────── */}
      <section id="services" className="bg-paper">
        <Container width="wide" className="py-20 lg:py-24">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            What we build
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-ink max-w-3xl leading-[1.1]">
            Whole-home transformations and <span className="accent">specialty remodels</span> for Twin Cities families.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
            Six core practices. Every project led by a real project manager. Every detail backed by our Lifetime Workmanship Warranty.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <article key={s.n} className="group">
                <Link href={s.href} className="block">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-navy">
                    <Image
                      src={s.image}
                      alt={s.alt}
                      fill
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {s.badge ? (
                      <span className="absolute top-3 left-3 inline-flex items-center bg-orange text-paper font-display font-semibold text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded">
                        {s.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="font-display font-semibold text-orange text-sm">{s.n}</span>
                    {s.badge ? <span className="text-xs text-muted">{s.badge}</span> : null}
                  </div>
                  <h3 className="mt-1 font-display font-bold text-xl text-ink group-hover:text-navy transition-colors">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{s.body}</p>
                  <p className="mt-3 text-sm font-display font-semibold text-orange">
                    View {s.name.toLowerCase().split(",")[0]} &rarr;
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ── PROCESS ─────────────────────────────────────────── */}
      <section id="process" className="bg-cream">
        <Container width="wide" className="py-20 lg:py-24">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            How we move
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-ink max-w-3xl leading-[1.1]">
            A transparent process, <span className="accent">start to finish.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
            No mystery line items. No vanishing project managers. No surprise change orders. Just three clear phases and the same MR team from estimate to final walkthrough.
          </p>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-10 lg:divide-x lg:divide-cream-deep">
            {processSteps.map((step, i) => (
              <div key={step.n} className={i > 0 ? "lg:pl-12" : ""}>
                <p className="font-display font-bold text-4xl text-orange">{step.n}</p>
                <p className="mt-4 font-display font-bold text-xl text-ink">{step.title}</p>
                <p className="mt-3 text-sm text-muted leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────── */}
      <section id="about" className="bg-paper">
        <Container width="wide" className="py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-navy">
                <Image
                  src="/images/about-team.jpg"
                  alt="M.R. Renovations team reviewing project plans."
                  fill
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
                Why M.R.
              </p>
              <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-ink leading-[1.1]">
                A family contractor with the <span className="accent">process of a design firm.</span>
              </h2>
              <p className="mt-5 text-base sm:text-lg text-muted leading-relaxed">
                Forty years of remodeling experience, run with the calm, written, on-time discipline you&rsquo;d expect from a much bigger firm.
              </p>

              <ul className="mt-8 space-y-5">
                {[
                  {
                    title: "40 years, one family",
                    body: "Founded in 1985. Still answering the phone ourselves. Still standing behind every project.",
                  },
                  {
                    title: "Lifetime Transferable Warranty",
                    body: "Our workmanship is warrantied for the life of the home &mdash; and it transfers to the next owner. Vanishingly rare in residential construction.",
                  },
                  {
                    title: "Guaranteed pricing, no gimmicks",
                    body: "Line-itemized contracts, fixed-fee design, transparent allowances. The estimate is the price.",
                  },
                  {
                    title: "One project manager, start to finish",
                    body: "The same person from the first sketch to the final walkthrough. No handoffs, no excuses.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <span className="mt-1.5 inline-block w-2 h-2 rounded-full bg-orange shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-display font-semibold text-ink">{item.title}</p>
                      <p
                        className="mt-1 text-sm text-muted leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.body }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ── RECENT WORK ──────────────────────────────────────── */}
      <section id="projects" className="bg-navy-deep text-paper">
        <Container width="wide" className="py-20 lg:py-24">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            Recent work
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-paper max-w-3xl leading-[1.1]">
            A few <span className="accent">Twin Cities transformations.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-soft-navy/85 leading-relaxed max-w-2xl">
            Real homes. Real budgets. Real timelines. Click any project for the full before-and-after story, scope, and homeowner interview.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => (
              <Link
                key={p.title}
                href="#project"
                className="group block rounded-lg overflow-hidden bg-navy"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 border-t border-paper/15">
                  <p className="font-display font-semibold tracking-[0.12em] uppercase text-[10px] text-orange">
                    {p.area} &middot; {p.weeks}
                  </p>
                  <p className="mt-1 font-display font-bold text-paper text-lg">{p.title}</p>
                  <p className="text-sm text-soft-navy/85">{p.location}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="#all-projects"
              className="inline-flex items-center justify-center bg-paper text-navy font-display font-semibold px-6 py-3 rounded-md hover:bg-soft-navy transition-colors"
            >
              View all projects
            </Link>
          </div>
        </Container>
      </section>

      {/* ── REVIEWS ─────────────────────────────────────────── */}
      <section id="reviews" className="bg-cream">
        <Container width="narrow" className="py-20 lg:py-24 text-center">
          <p className="text-orange text-lg" aria-hidden="true">
            &#9733; &#9733; &#9733; &#9733; &#9733;
          </p>
          <blockquote className="mt-6">
            <p className="font-display font-bold text-2xl sm:text-3xl text-ink leading-snug">
              &ldquo;M.&nbsp;R. Renovations transformed our outdated kitchen into a modern masterpiece. Their attention to detail and commitment to quality were outstanding &mdash; and the Lifetime Warranty sealed it for us.&rdquo;
            </p>
            <footer className="mt-6 text-sm">
              <p className="font-display font-semibold text-ink tracking-[0.08em] uppercase text-xs">
                Sarah Miller <span className="text-orange">&middot;</span> Kitchen Remodel <span className="text-orange">&middot;</span> Maple Grove
              </p>
            </footer>
          </blockquote>

          <div className="mt-10">
            <Link
              href="#all-reviews"
              className="inline-flex items-center justify-center bg-paper text-navy border border-faint font-display font-semibold px-6 py-3 rounded-md hover:bg-soft-navy transition-colors"
            >
              Read all 50+ reviews
            </Link>
          </div>
        </Container>
      </section>

      {/* ── CURRENT OFFERS ──────────────────────────────────── */}
      <section id="offers" className="bg-paper">
        <Container width="wide" className="py-20 lg:py-24">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            Current offers
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-ink max-w-3xl leading-[1.1]">
            Honest savings, <span className="accent">no gimmicks.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {offers.map((o) => (
              <div key={o.title} className="rounded-xl bg-cream border border-cream-deep p-7">
                <p className="font-display font-bold text-3xl text-orange">{o.label}</p>
                <p className="mt-4 font-display font-bold text-lg text-ink">{o.title}</p>
                <p className="mt-2 text-sm text-muted leading-relaxed">{o.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section className="bg-navy text-paper">
        <Container width="wide" className="py-20 lg:py-24 text-center">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">Ready when you are</p>
          <h2 className="mt-3 font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-paper leading-[1.05] max-w-3xl mx-auto">
            Let&rsquo;s build something <span className="accent">that lasts.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-soft-navy/85 leading-relaxed max-w-xl mx-auto">
            Tell us about your project. We&rsquo;ll get back to you within one business day with next steps &mdash; no pressure, no obligation.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center bg-orange hover:bg-orange-deep text-paper font-display font-semibold px-6 py-3.5 rounded-md transition-colors"
            >
              Start your free estimate
            </Link>
            <a
              href="tel:7639002024"
              className="inline-flex items-center justify-center bg-paper/10 hover:bg-paper/20 text-paper border border-paper/40 font-display font-semibold px-6 py-3.5 rounded-md transition-colors"
            >
              Or call 763-900-2024
            </a>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
