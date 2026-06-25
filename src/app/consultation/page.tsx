import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import { LeadFormShell } from "@/components/lead-form-shell";

export const metadata: Metadata = {
  title: "Free Consultation \u00b7 M. R. Renovations",
  description:
    "Start with a no-gimmick estimate from M. R. Renovations. Family-owned design-build serving Maple Grove and the Twin Cities for 43+ years.",
};

const reassurances = [
  {
    title: "No high-pressure sales",
    body: "We respect your time. No \u201Ctoday only\u201D pricing. No follow-up spam.",
  },
  {
    title: "Real designer, real estimate",
    body: "An in-home consult with a project manager who will be on your build.",
  },
  {
    title: "Backed by a Lifetime Warranty",
    body: "Our workmanship is warrantied for the life of the home and transfers if you sell.",
  },
];

export default function ConsultationPage() {
  return (
    <PageShell>
      {/* ── Hero strip ─────────────────────────────────────────── */}
      <section className="bg-navy-deep text-paper">
        <Container width="wide" className="py-16 sm:py-20 lg:py-24">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-soft-orange/95">
            Free Consultation
          </p>
          <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-paper max-w-3xl">
            Start with a <span className="accent">no-gimmick estimate.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-soft-navy/90 max-w-2xl">
            Tell us about your project. We&rsquo;ll get back to you within one business day with next steps &mdash; no pressure, no obligation.
          </p>
        </Container>
      </section>

      {/* ── Form section ───────────────────────────────────────── */}
      <section className="bg-paper">
        <Container width="wide" className="py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
                What to expect
              </p>
              <h2 className="mt-3 font-display font-bold text-2xl sm:text-3xl tracking-tight text-ink leading-[1.15]">
                A real conversation, then a clear next step.
              </h2>
              <p className="mt-5 text-base text-muted leading-relaxed">
                After you submit, a project manager will reach out to schedule a free in-home consultation. We&rsquo;ll listen first, then sketch.
              </p>

              <ul className="mt-8 space-y-5">
                {reassurances.map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <span
                      className="mt-1.5 inline-block w-2 h-2 rounded-full bg-orange shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-display font-semibold text-ink">{item.title}</p>
                      <p className="mt-1 text-sm text-muted leading-relaxed">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-sm text-muted leading-relaxed">
                Prefer to talk first? Call{" "}
                <a
                  href="tel:7639002024"
                  className="text-navy font-semibold underline underline-offset-4"
                >
                  763-900-2024
                </a>
                {" "}or visit our{" "}
                <Link
                  href="/contact"
                  className="text-navy font-semibold underline underline-offset-4"
                >
                  contact page
                </Link>
                .
              </p>
            </div>

            <div className="lg:col-span-7">
              <LeadFormShell />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Closing reassurance band ───────────────────────────── */}
      <section className="bg-cream">
        <Container width="wide" className="py-14 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 text-center sm:text-left">
            <div>
              <p className="font-display font-bold text-3xl text-orange">43+</p>
              <p className="mt-2 font-display font-semibold text-ink">Years of craft</p>
              <p className="mt-1 text-sm text-muted">Family-owned. Still answering the phone.</p>
            </div>
            <div>
              <p className="font-display font-bold text-3xl text-orange">500+</p>
              <p className="mt-2 font-display font-semibold text-ink">Twin Cities homes</p>
              <p className="mt-1 text-sm text-muted">Built, finished, and warrantied.</p>
            </div>
            <div>
              <p className="font-display font-bold text-3xl text-orange">&infin;</p>
              <p className="mt-2 font-display font-semibold text-ink">Lifetime Warranty</p>
              <p className="mt-1 text-sm text-muted">Stays with the home, even if you sell.</p>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
