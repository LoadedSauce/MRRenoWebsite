import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import { JsonLd, buildPageGraph, buildWebPageSchema } from "@/lib/seo/schema";
import { buildWarrantyMetadata } from "@/lib/seo/routes";

export const metadata: Metadata = buildWarrantyMetadata();

const faqItems = [
  {
    question: "Does the warranty transfer when I sell my home?",
    answer:
      "Yes -- that is the point. The warranty transfers to the next owner of the home. It requires a transfer fee, an on-site visit from M.R. Renovations, and registration in the new owner's name. It cannot be mailed. It must be completed in person before the sale closes.",
  },
  {
    question: "What voids the warranty?",
    answer:
      "Any work performed on the warranted scope by any contractor other than M.R. Renovations voids the warranty on that scope. The warranty covers our workmanship only -- it does not cover damage from acts of nature, homeowner modifications, or deferred maintenance.",
  },
  {
    question: "When does the warranty take effect?",
    answer:
      "The warranty is not valid until all payments outlined in your contract have been received in full. Your project manager presents and signs the warranty certificate at the final walkthrough.",
  },
  {
    question: "How do I file a warranty claim?",
    answer:
      "Contact us within 24 hours of noticing the issue. Reach M.R. Renovations by email at M.Randolph@Mrrenovations-llc.com or by phone at 763-415-0654. A written description of the issue is required to open a claim.",
  },
];

export default function WarrantyPage() {
  return (
    <PageShell>
      <JsonLd
        data={buildPageGraph([
          buildWebPageSchema(
            "/warranty",
            "Lifetime Transferable Workmanship Warranty | M.R. Renovations"
          ),
        ])}
      />
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-navy text-paper">
        <Container width="wide" className="py-20 lg:py-28">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange-on-dark">
            Our commitment
          </p>
          <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-paper max-w-3xl">
            The Lifetime Transferable Workmanship Warranty
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-soft-navy/90 max-w-2xl">
            Every project M.R. Renovations completes is backed by a written lifetime warranty on our workmanship. It covers the life of the home -- and it transfers to the next owner when you sell. Almost no residential contractor in Minnesota offers this.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center bg-orange hover:brightness-105 text-ink font-display font-semibold px-6 py-3.5 rounded-md transition"
            >
              Request a Free Consultation
            </Link>
            <a
              href="tel:7634150654"
              className="inline-flex items-center justify-center bg-paper/10 hover:bg-paper/20 text-paper border border-paper/40 font-display font-semibold px-6 py-3.5 rounded-md transition-colors"
            >
              Call 763-415-0654
            </a>
          </div>
        </Container>
      </section>

      {/* ── WHAT IT COVERS ───────────────────────────────────── */}
      <section className="bg-paper">
        <Container width="wide" className="py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
                Coverage
              </p>
              <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink leading-[1.1]">
                What the warranty covers
              </h2>
              <p className="mt-5 text-base text-muted leading-relaxed">
                The warranty covers all labor and installation performed by M.R. Renovations crews on your project.
              </p>
              <ul className="mt-7 space-y-4">
                {[
                  {
                    title: "Installation to industry standards",
                    body: "All work is performed to Minnesota residential code and accepted trade standards. If any M.R. Renovations installation falls below those standards, we return and correct it at no charge.",
                  },
                  {
                    title: "Defects from improper installation",
                    body: "If a defect in our workmanship causes damage -- a shower pan that fails, framing that settles incorrectly, tile that separates due to improper substrate prep -- we repair or replace it at no charge.",
                  },
                  {
                    title: "Lifetime duration",
                    body: "The warranty does not expire after one year or five years. It covers the life of the home as long as the conditions below are met.",
                  },
                  {
                    title: "Transferable to new owners",
                    body: "If you sell your home, the warranty can be transferred to the new owner. Transfer requires a fee, an on-site visit, and formal registration in the new owner's name.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <span
                      className="mt-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange/10 shrink-0"
                      aria-hidden="true"
                    >
                      <svg className="w-3 h-3 text-orange" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <div>
                      <p className="font-display font-semibold text-ink">{item.title}</p>
                      <p className="mt-1 text-sm text-muted leading-relaxed">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
                Conditions
              </p>
              <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink leading-[1.1]">
                What voids coverage
              </h2>
              <p className="mt-5 text-base text-muted leading-relaxed">
                The warranty is straightforward. There are two conditions that supersede it.
              </p>
              <div className="mt-7 space-y-5">
                <div className="rounded-xl border border-faint bg-soft-navy/40 p-6">
                  <p className="font-display font-semibold text-ink text-sm">
                    01 -- Payment must be received in full
                  </p>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    No warranty claims are valid until all payments outlined in your project contract have been received. The warranty certificate is presented and signed at the final walkthrough, after final payment.
                  </p>
                </div>
                <div className="rounded-xl border border-faint bg-soft-navy/40 p-6">
                  <p className="font-display font-semibold text-ink text-sm">
                    02 -- Work must not be altered by another contractor
                  </p>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    Any work performed on the warranted scope by any contractor other than M.R. Renovations voids the warranty on that scope. This warranty supersedes all prior verbal or written guarantees and represents the complete written agreement on workmanship coverage.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-soft-orange/30 border border-orange/20 p-6">
                <p className="font-display font-semibold text-ink text-sm">
                  Manufacturer warranties
                </p>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Manufacturer warranties on materials -- cabinetry, countertops, fixtures, flooring, roofing systems, windows, doors -- are separate from the M.R. Renovations workmanship warranty and are passed through to you at project completion. Your project manager delivers all manufacturer warranty cards and documentation at the final walkthrough.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── CLAIM PROCESS ────────────────────────────────────── */}
      <section className="bg-cream">
        <Container width="wide" className="py-20 lg:py-24">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            Filing a claim
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink max-w-2xl leading-[1.1]">
            How to report a warranty issue
          </h2>
          <p className="mt-5 text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
            Contact us within 24 hours of noticing the issue. Warranty claims are handled directly -- no third-party administrators, no automated queues.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="rounded-xl bg-paper border border-faint p-7">
              <p className="font-display font-bold text-2xl text-orange">01</p>
              <p className="mt-4 font-display font-semibold text-ink">Contact within 24 hours</p>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Report the issue within 24 hours of first noticing it. Delayed reporting may affect the scope of coverage.
              </p>
            </div>
            <div className="rounded-xl bg-paper border border-faint p-7">
              <p className="font-display font-bold text-2xl text-orange">02</p>
              <p className="mt-4 font-display font-semibold text-ink">Provide a written description</p>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                A written description of the issue is required to open a claim. Photographs are helpful but not required to start the process.
              </p>
            </div>
            <div className="rounded-xl bg-paper border border-faint p-7">
              <p className="font-display font-bold text-2xl text-orange">03</p>
              <p className="mt-4 font-display font-semibold text-ink">We schedule a site visit</p>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Your project manager or a senior crew member will assess the issue in person and confirm the repair plan before any work begins.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center rounded-xl bg-navy text-paper p-7">
            <div className="flex-1">
              <p className="font-display font-semibold text-paper">
                Reach us directly
              </p>
              <p className="mt-1 text-sm text-soft-navy/85">
                Warranty claims -- and all project questions -- are handled by the M.R. Renovations team, not a call center.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="mailto:M.Randolph@Mrrenovations-llc.com"
                className="inline-flex items-center justify-center bg-paper text-navy font-display font-semibold text-sm px-5 py-2.5 rounded-md hover:bg-soft-navy transition-colors whitespace-nowrap"
              >
                Email us
              </a>
              <a
                href="tel:7634150654"
                className="inline-flex items-center justify-center bg-orange hover:brightness-105 text-ink font-display font-semibold text-sm px-5 py-2.5 rounded-md transition whitespace-nowrap"
              >
                763-415-0654
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="bg-paper">
        <Container width="narrow" className="py-20 lg:py-24">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            Common questions
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink leading-[1.1]">
            Warranty FAQ
          </h2>

          <dl className="mt-10 divide-y divide-faint">
            {faqItems.map((item) => (
              <div key={item.question} className="py-6">
                <dt className="font-display font-semibold text-ink text-base">
                  {item.question}
                </dt>
                <dd className="mt-3 text-sm text-muted leading-relaxed">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── CTA STRIP ────────────────────────────────────────── */}
      <section className="bg-navy text-paper">
        <Container width="wide" className="py-16 lg:py-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="font-display font-bold text-paper text-xl sm:text-2xl max-w-xl leading-snug">
              Ready to start a project backed by a lifetime warranty?
            </p>
            <p className="mt-2 text-sm text-soft-navy/85">
              No pressure. We respond within one business day.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center bg-orange hover:brightness-105 text-ink font-display font-semibold px-6 py-3.5 rounded-md transition whitespace-nowrap"
            >
              Request a Free Consultation
            </Link>
            <a
              href="tel:7634150654"
              className="inline-flex items-center justify-center bg-paper/10 hover:bg-paper/20 text-paper border border-paper/40 font-display font-semibold px-6 py-3.5 rounded-md transition-colors whitespace-nowrap"
            >
              763-415-0654
            </a>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
