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
    title: "Check your rate",
    body: "Fill out a short form on Hearth's platform. Takes about two minutes. Checking your rate does not affect your credit score.",
  },
  {
    number: "02",
    title: "Review your options",
    body: "Hearth presents loan options from a network of lenders. You compare rates, terms, and monthly payments and choose what fits your budget. No obligation to proceed.",
  },
  {
    number: "03",
    title: "Get funded",
    body: "Once you select a loan and complete the application, funds are typically available within one to three business days. You pay M.R. Renovations directly from your account -- no contractor involvement in the loan.",
  },
];

const keyDetails = [
  { label: "Loan Amounts", value: "$1,000 -- $100,000" },
  { label: "Terms Available", value: "24 -- 144 months" },
  { label: "Rate Check", value: "Soft pull only" },
  { label: "Funding Speed", value: "1-3 business days" },
];

export default function FinancingPage() {
  return (
    <main>
      {/* -- HERO ---------------------------------------------------------- */}
      <section className="bg-paper border-b border-faint">
        <Container width="default" className="py-16 lg:py-20">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            Financing
          </p>
          <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05]">
            Financing your renovation.
          </h1>
          <p className="mt-5 text-lg text-muted leading-relaxed max-w-2xl">
            We partner with Hearth to give you access to home improvement financing from a network of lenders. Check your options in minutes with no impact to your credit score -- no commitment required.
          </p>
        </Container>
      </section>

      {/* -- HOW IT WORKS -------------------------------------------------- */}
      <section className="bg-paper">
        <Container width="default" className="py-16 lg:py-20">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            How It Works
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl tracking-tight text-navy leading-[1.1]">
            Three steps.
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col gap-4">
                <span className="font-display font-bold text-4xl text-orange/25 tracking-tight select-none">
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

      {/* -- KEY DETAILS STRIP --------------------------------------------- */}
      <section className="bg-navy text-paper">
        <Container width="wide" className="py-10">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            {keyDetails.map((detail) => (
              <div key={detail.label}>
                <dt className="font-display font-semibold tracking-[0.12em] uppercase text-[10px] text-soft-orange/90">
                  {detail.label}
                </dt>
                <dd className="mt-1 font-display font-bold text-lg sm:text-xl text-paper tracking-tight">
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* -- CASH ALTERNATIVE ---------------------------------------------- */}
      <section className="bg-soft-navy">
        <Container width="default" className="py-12 lg:py-16">
          <div className="max-w-2xl">
            <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
              Cash Alternative
            </p>
            <h2 className="mt-3 font-display font-bold text-2xl sm:text-3xl tracking-tight text-navy">
              Prefer to pay cash?
            </h2>
            <p className="mt-4 text-base text-muted leading-relaxed">
              We offer a 2% discount on the total contract price for projects paid in full by cash or check at project start. Ask your project manager for details when you receive your written proposal.
            </p>
          </div>
        </Container>
      </section>

      {/* -- CTA ----------------------------------------------------------- */}
      <section className="bg-paper">
        <Container width="default" className="py-16 lg:py-20 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-navy">
            Check your financing options.
          </h2>
          <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
            No impact to your credit score. No commitment required.
          </p>
          <div className="mt-8">
            <a
              href="https://app.gethearth.com/partners/mr-renovations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-orange hover:bg-orange-deep text-paper font-display font-semibold px-7 py-3 rounded-md transition-colors"
            >
              Check Your Rate with Hearth
            </a>
          </div>

          {/* Legal disclosure */}
          <p className="mt-8 text-xs text-muted/70 max-w-2xl mx-auto leading-relaxed">
            M.R. Renovations, LLC is not a lender. Financing is provided by third-party lenders through the Hearth platform. Loan approval, rates, and terms are determined by the lender based on your creditworthiness and are not guaranteed. All financing products are subject to lender eligibility requirements. M.R. Renovations receives no commission or referral fee from Hearth loan originations. Confirm final disclosure language with Hearth partner agreement before go-live.
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
