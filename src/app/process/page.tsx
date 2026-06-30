import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import { JsonLd, buildPageGraph, buildWebPageSchema } from "@/lib/seo/schema";
import { buildProcessMetadata } from "@/lib/seo/routes";

export const metadata: Metadata = buildProcessMetadata();

export default function ProcessPage() {
  return (
    <PageShell>
      <JsonLd
        data={buildPageGraph([
          buildWebPageSchema(
            "/process",
            "Our Remodeling Process | M.R. Renovations"
          ),
        ])}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-paper">
        <Container width="wide" className="py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: text */}
            <div>
              <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
                Our Process
              </p>
              <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05]">
                What to expect when you work with us.
              </h1>
              <p className="mt-5 text-lg text-muted leading-relaxed">
                One project manager. Full permit coverage. No subcontractor chaos. Every M.R. Renovations project follows the same nine steps -- so you always know where you stand.
              </p>
              <div className="mt-8">
                <Link
                  href="/consultation"
                  className="inline-flex items-center justify-center bg-orange hover:bg-orange-deep text-paper font-display font-semibold px-7 py-3 rounded-md transition-colors"
                >
                  Request a Free Consultation
                </Link>
              </div>
            </div>

            {/* Right: photo with orange left-border accent */}
            <div className="relative border-l-4 border-orange pl-0 overflow-hidden rounded-lg">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/whole-home/whole-home-remodel-walnut-kitchen-open-concept-maple-grove-mn.jpg"
                  alt="Completed whole-home kitchen remodel with open concept layout"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ── STAT STRIP ───────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-faint">
        <Container width="wide" className="py-10">
          <dl className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-faint">
            {[
              { value: "43+",       label: "Years of hands-on experience" },
              { value: "9 steps",   label: "First call through final walkthrough" },
              { value: "Lifetime",  label: "Transferable workmanship warranty" },
            ].map((stat) => (
              <div key={stat.value} className="px-8 py-6 sm:py-0 text-center">
                <div className="mx-auto w-10 h-1 bg-orange rounded-full mb-4" />
                <dt className="font-display font-bold text-3xl text-navy">{stat.value}</dt>
                <dd className="mt-1 text-sm text-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── PHASE LABEL: GETTING STARTED ─────────────────────────────────── */}
      <div className="bg-paper">
        <Container width="wide" className="pt-16">
          <p className="font-display font-semibold tracking-[0.18em] uppercase text-xs text-muted border-b border-faint pb-3">
            Getting started
          </p>
        </Container>
      </div>

      {/* ── STEP 01 -- white bg, text left / photo right ─────────────────── */}
      <section className="bg-paper">
        <Container width="wide" className="py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="font-display font-bold text-5xl text-orange/20 tracking-tight select-none">01</p>
              <h2 className="mt-2 font-display font-bold text-2xl text-navy tracking-tight">Reach out</h2>
              <p className="mt-3 text-base text-muted leading-relaxed">
                Call, email, or submit the online form. A real person at M.R. Renovations responds -- not a call center, not an automated booking system. We follow up before anything is scheduled so we understand your project before we send anyone to your door.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-soft-orange/30">
              {/* Placeholder slot -- no vendor/showroom photo available yet */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-bold text-4xl text-orange/20 select-none">Step 01</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── STEP 02 -- soft-navy bg, photo left / text right ─────────────── */}
      <section className="bg-soft-navy">
        <Container width="wide" className="py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-navy/20 order-2 lg:order-1">
              <Image
                src="/images/bathroom/bathroom-remodel-marble-tile-shower-quartz-vanity-maple-grove-mn.jpg"
                alt="Completed bathroom remodel -- marble tile shower and quartz vanity"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="font-display font-bold text-5xl text-orange/20 tracking-tight select-none">02</p>
              <h2 className="mt-2 font-display font-bold text-2xl text-navy tracking-tight">Discovery appointment</h2>
              <p className="mt-3 text-base text-muted leading-relaxed">
                Your project manager visits the site in person. We take measurements, photos, and detailed notes -- and we ask the questions most contractors skip. Structural considerations, permit requirements, how you use the space today, what has been done before. The visit takes 45 to 90 minutes and produces a real scope.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── STEP 03 -- white bg, text left / photo right ─────────────────── */}
      <section className="bg-paper">
        <Container width="wide" className="py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="font-display font-bold text-5xl text-orange/20 tracking-tight select-none">03</p>
              <h2 className="mt-2 font-display font-bold text-2xl text-navy tracking-tight">Estimate preparation</h2>
              <p className="mt-3 text-base text-muted leading-relaxed">
                You receive a fully itemized written proposal within three business days. It covers scope of work, materials specified by brand and grade, a payment schedule tied to project milestones, and a projected timeline with start date. We schedule a presentation date so we can walk every line with you -- no emailed PDFs left without context.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-faint">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-bold text-4xl text-navy/10 select-none">Step 03</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── STEPS 04 + 05 -- soft-navy bg, 2 white cards side-by-side ───── */}
      <section className="bg-soft-navy">
        <Container width="wide" className="py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Card 04 */}
            <div className="bg-white rounded-lg border-l-[3px] border-orange p-8">
              <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-muted">Step 04</p>
              <h2 className="mt-3 font-display font-bold text-xl text-navy tracking-tight">Presentation meeting</h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                We walk every line of the estimate with you in person. All decision-makers in the room. Questions answered before ink hits paper. No pressure to sign at the meeting -- the proposal is yours to review.
              </p>
            </div>

            {/* Card 05 */}
            <div className="bg-white rounded-lg border-l-[3px] border-orange p-8">
              <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-muted">Step 05</p>
              <h2 className="mt-3 font-display font-bold text-xl text-navy tracking-tight">Signing and next steps</h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Once you sign, the yard sign goes up and the clock starts. A material selection meeting is scheduled 7 to 21 days out -- early enough to get materials on order without rushing your decisions.
              </p>
            </div>

          </div>
        </Container>
      </section>

      {/* ── PHASE LABEL: AFTER SIGNING ───────────────────────────────────── */}
      <div className="bg-paper">
        <Container width="wide" className="pt-16">
          <p className="font-display font-semibold tracking-[0.18em] uppercase text-xs text-muted border-b border-faint pb-3">
            After signing
          </p>
        </Container>
      </div>

      {/* ── STEP 06 -- soft-navy bg, photo left / text right, LARGER text ── */}
      <section className="bg-soft-navy">
        <Container width="wide" className="py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative h-[230px] rounded-lg overflow-hidden bg-navy/20 order-2 lg:order-1">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-bold text-4xl text-paper/10 select-none">Showroom</span>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-block bg-soft-orange text-orange font-display font-semibold text-xs tracking-[0.14em] uppercase px-3 py-1 rounded-sm mb-3">
                What sets us apart
              </span>
              <p className="font-display font-bold text-5xl text-orange/20 tracking-tight select-none">06</p>
              <h2 className="mt-2 font-display font-bold leading-tight text-navy" style={{fontSize: "1.4rem"}}>
                Material selection
              </h2>
              <p className="mt-3 text-muted leading-relaxed" style={{fontSize: "0.96rem"}}>
                We walk the showroom with you. Not a catalog, not a sample board left at your door -- actual materials chosen in person from our vendor network. Tile, cabinetry, countertops, fixtures. You see exactly what will be installed in your home before a single order is placed.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── STEPS 07 + 08 -- white bg, 2-col compact cards ───────────────── */}
      <section className="bg-paper">
        <Container width="wide" className="py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Card 07 */}
            <div className="border border-faint rounded-lg p-7">
              <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-muted">Step 07</p>
              <h2 className="mt-3 font-display font-bold text-xl text-navy tracking-tight">Cost confirmation</h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Once materials are selected, final material cost is calculated. Nine times out of ten, a credit is applied -- materials come in under the allowance built into your estimate.
              </p>
            </div>

            {/* Card 08 */}
            <div className="border border-faint rounded-lg p-7">
              <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-muted">Step 08</p>
              <h2 className="mt-3 font-display font-bold text-xl text-navy tracking-tight">Ordering and scheduling</h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Materials are ordered. The project schedule is built. Work begins when materials arrive on site -- no placeholder start dates that slip.
              </p>
            </div>

          </div>
        </Container>
      </section>

      {/* ── SEPARATOR ────────────────────────────────────────────────────── */}
      <div className="bg-paper">
        <Container width="wide">
          <hr className="border-faint" />
        </Container>
      </div>

      {/* ── STEP 09 -- white bg, text left / photo right, LARGER text ───── */}
      <section className="bg-paper">
        <Container width="wide" className="py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="font-display font-bold text-5xl text-orange/20 tracking-tight select-none">09</p>
              <h2 className="mt-2 font-display font-bold leading-tight text-navy" style={{fontSize: "1.4rem"}}>
                Final walkthrough and warranty
              </h2>
              <p className="mt-3 text-muted leading-relaxed" style={{fontSize: "0.96rem"}}>
                Professional cleaning before we arrive. A final walkthrough of every space together. Your Lifetime Transferable Workmanship Warranty is signed in person. Manufacturer warranty cards, permit close-out paperwork, and your project manager's direct contact are all handed over at close.
              </p>
              {/* Warranty note */}
              <div className="mt-6 flex items-start gap-3">
                <svg className="shrink-0 mt-0.5 w-5 h-5 text-orange" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 1.25l2.47 5.01 5.53.804-4 3.896.944 5.5L10 13.77l-4.947 2.69.944-5.5-4-3.896 5.53-.804L10 1.25z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-muted leading-relaxed">
                  The warranty stays with your home if you sell. The new owner is signed up in person. It does not get mailed. It does not expire.{" "}
                  <Link href="/warranty" className="text-orange underline underline-offset-2 hover:text-orange-deep transition-colors">
                    See full warranty terms.
                  </Link>
                </p>
              </div>
            </div>
            <div className="relative h-[230px] rounded-lg overflow-hidden bg-navy/10">
              <Image
                src="/images/kitchen/kitchen-remodel-white-shaker-cabinets-quartz-countertops-maple-grove-mn.jpg"
                alt="Completed kitchen remodel -- white shaker cabinets with quartz countertops"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA STRIP ────────────────────────────────────────────────────── */}
      <section className="bg-soft-navy">
        <Container width="wide" className="py-16 lg:py-20 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-navy">
            Ready to get started?
          </h2>
          <p className="mt-4 text-base text-muted max-w-xl mx-auto leading-relaxed">
            Talk to a real project manager. No automated quotes, no call centers. Free, no-obligation consultation at your site.
          </p>
          <div className="mt-8">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center bg-orange hover:bg-orange-deep text-paper font-display font-semibold px-7 py-3 rounded-md transition-colors"
            >
              Request a Free Consultation
            </Link>
          </div>
        </Container>
      </section>

    </PageShell>
  );
}
