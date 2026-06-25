import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Financing Options | M.R. Renovations",
  description:
    "M.R. Renovations partners with Hearth to offer home improvement financing. Check your rate in minutes with no impact to your credit score.",
  alternates: { canonical: "https://www.m-r-reno.com/financing" },
};

const steps = [
  {
    number: "01",
    title: "Check your options",
    body: "Visit the M.R. Renovations Hearth portal and complete a short form to see estimated monthly payment options. Checking your options does not impact your credit score.",
  },
  {
    number: "02",
    title: "Choose what works",
    body: "Review financing options from a network of lenders. Terms from 1 to 12 years. Loans up to $250,000. No obligation to proceed.",
  },
  {
    number: "03",
    title: "Get moving",
    body: "Funds available in as little as 24 hours if approved. You pay M.R. Renovations directly -- no contractor involvement in your loan.",
  },
];

const keyDetails = [
  { label: "Loans from",     value: "$1,000 -- $250,000" },
  { label: "Terms",          value: "1 to 12 years"       },
  { label: "Pre-qualification", value: "No credit impact" },
  { label: "Prepayment",     value: "No penalties"         },
];

export default function FinancingPage() {
  return (
    <main>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-navy text-paper">
        <Container width="default" className="py-16 lg:py-20">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-soft-orange/90">
            Financing
          </p>
          <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight text-paper leading-[1.05]">
            Flexible financing for your project.
          </h1>
          <p className="mt-5 text-lg text-paper/75 leading-relaxed max-w-2xl">
            Your project does not have to wait. M.R. Renovations offers financing options through Hearth, giving you the ability to move forward on your timeline.
          </p>
        </Container>
      </section>

      {/* ── INTRO ────────────────────────────────────────────────────────── */}
      <section className="bg-paper">
        <Container width="default" className="py-14 lg:py-16">
          <p className="text-lg text-muted leading-relaxed max-w-2xl">
            Renovations are a significant investment. Hearth financing lets homeowners make decisions based on what they want, not just what they have available right now.
          </p>
        </Container>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="bg-paper border-t border-faint">
        <Container width="default" className="py-14 lg:py-16">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            How it works
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl tracking-tight text-navy">
            Three steps.
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col gap-3">
                <span className="font-display font-bold text-4xl text-orange/20 tracking-tight select-none">
                  {step.number}
                </span>
                <h3 className="font-display font-bold text-lg text-navy">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── KEY DETAILS STRIP ────────────────────────────────────────────── */}
      <section className="bg-soft-navy">
        <Container width="wide" className="py-10">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {keyDetails.map((detail) => (
              <div key={detail.label}>
                <div className="mx-auto w-8 h-1 bg-orange rounded-full mb-3" />
                <dt className="font-display font-semibold tracking-[0.12em] uppercase text-[10px] text-muted">
                  {detail.label}
                </dt>
                <dd className="mt-1 font-display font-bold text-lg text-navy tracking-tight">
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── CASH ALTERNATIVE ─────────────────────────────────────────────── */}
      <section className="bg-paper">
        <Container width="default" className="py-14 lg:py-16">
          <div className="bg-soft-orange rounded-lg p-8 max-w-2xl">
            <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
              Cash Alternative
            </p>
            <h2 className="mt-3 font-display font-bold text-2xl text-navy tracking-tight">
              Prefer to pay cash?
            </h2>
            <p className="mt-3 text-base text-muted leading-relaxed">
              M.R. Renovations offers a 2% discount on the full project cost for clients who pay in full by cash or check. Two clear paths -- choose what works for your situation. Ask your project manager for details when you receive your written proposal.
            </p>
          </div>
        </Container>
      </section>

      {/* ── PRIMARY CTA ──────────────────────────────────────────────────── */}
      <section className="bg-paper border-t border-faint">
        <Container width="default" className="py-14 lg:py-16 text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-navy">
            Check your financing options.
          </h2>
          <p className="mt-3 text-base text-muted max-w-md mx-auto">
            No impact to your credit score. No commitment required.
          </p>
          <div className="mt-6">
            <a
              href="https://app.gethearth.com/partners/m-r-renovations-llc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-orange hover:bg-orange-deep text-paper font-display font-semibold px-7 py-3 rounded-md transition-colors"
            >
              View Financing Options
            </a>
          </div>

          {/* Legal disclosure */}
          <p className="mt-8 text-xs text-muted/60 max-w-2xl mx-auto leading-relaxed">
            Hearth is a technology company licensed as a broker as may be required by state law. Hearth does not accept applications for credit, does not make loans, and does not make credit decisions. Annual percentage rates, terms, and amounts are provided by Hearth's lending partners. NMLS ID# 1628533.
          </p>

          {/* Secondary links */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <Link href="/consultation" className="text-navy hover:text-orange font-medium transition-colors">
              Get a Free Estimate &rarr;
            </Link>
            <a href="tel:7639002024" className="text-navy hover:text-orange font-medium transition-colors">
              Call 763-900-2024
            </a>
          </div>
        </Container>
      </section>

    </main>
  );
}
