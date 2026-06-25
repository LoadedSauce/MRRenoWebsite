import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Our Process | M.R. Renovations",
  description:
    "How M.R. Renovations manages your project from first call to final walkthrough -- 9 steps, one project manager, and a Lifetime Transferable Workmanship Warranty at the end.",
  alternates: { canonical: "https://www.m-r-reno.com/process" },
};

const steps = [
  {
    number: "01",
    title: "First Call",
    body: "You call or submit online. A real person at M.R. Renovations picks up or calls back within one business day -- not a call center, not a booking app. We ask a few questions about scope, timeline, and budget range so we can staff the right project manager before the estimate visit.",
  },
  {
    number: "02",
    title: "On-Site Estimate",
    body: "Your project manager visits the site, walks the space with you, and asks the questions most contractors skip -- structural considerations, permit requirements, how you live in the space, what has been done before. No tape measure theater. The visit takes 45 to 90 minutes and produces a real scope, not a ballpark.",
  },
  {
    number: "03",
    title: "Written Proposal",
    body: "You receive a written proposal within three business days. It covers full scope of work, materials specified by brand and grade, payment schedule tied to project milestones, and projected timeline with start date. No change-order traps built into the base price.",
  },
  {
    number: "04",
    title: "Contract and Permit Pull",
    body: "Once you sign, we pull every required permit before a single tool enters the house. Building, plumbing, electrical, mechanical -- whichever trades are in scope. Most municipalities in our service area turn permits in two to three weeks. We track them and notify you when we have a confirmed start date.",
  },
  {
    number: "05",
    title: "Demo and Rough Work",
    body: "We demolish what needs to go, handle all framing and structural changes (where applicable), and complete rough plumbing, electrical, and HVAC work. All rough work is inspected before it is closed in. You do not want to find out five years from now that something was done wrong behind the drywall.",
  },
  {
    number: "06",
    title: "Selections and Lead Time",
    body: "If you have not finalized material selections -- tile, cabinetry, countertops, fixtures -- this is the window to lock them in. Your project manager provides lead-time guidance so materials arrive on schedule. Delays in selections are the most common cause of project extensions. We flag this early.",
  },
  {
    number: "07",
    title: "Finish Work",
    body: "Drywall, insulation, paint, flooring, cabinetry, countertops, tile, fixtures, trim, and hardware. The finish phase is where the project becomes what you imagined. Your project manager is on-site at every major milestone and available by phone daily.",
  },
  {
    number: "08",
    title: "Punch List",
    body: "Before we call a project done, we walk the completed space with you and build a written punch list of anything that does not meet our standard or yours. Every item on the list is resolved before final payment is collected. No exceptions.",
  },
  {
    number: "09",
    title: "Final Walkthrough and Warranty",
    body: "We walk the completed project with you one final time. You receive written documentation of your Lifetime Transferable Workmanship Warranty, all manufacturer warranty cards, permit close-out paperwork, and your project manager's direct contact for any questions after move-in. The relationship does not end at the final invoice.",
  },
];

const trustStats = [
  { label: "Years in Business", value: "43+" },
  { label: "Sitewide Rating", value: "5.0" },
  { label: "MN License", value: "BC809200" },
  { label: "Warranty", value: "Lifetime" },
];

export default function ProcessPage() {
  return (
    <main>
      {/* -- HERO ---------------------------------------------------------- */}
      <section className="bg-paper border-b border-faint">
        <Container width="default" className="py-16 lg:py-20">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            How We Work
          </p>
          <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05]">
            How we work.
          </h1>
          <p className="mt-5 text-lg text-muted leading-relaxed max-w-2xl">
            Every M.R. Renovations project follows the same nine steps -- one project manager from start to finish, full permit coverage, and a written Lifetime Transferable Workmanship Warranty at the end. No surprises.
          </p>
        </Container>
      </section>

      {/* -- 9-STEP PROCESS ------------------------------------------------ */}
      <section className="bg-paper">
        <Container width="default" className="py-16 lg:py-20">
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                className={`flex gap-8 py-10 ${idx < steps.length - 1 ? "border-b border-faint" : ""}`}
              >
                {/* Step number */}
                <div className="shrink-0 w-14 pt-1">
                  <span className="font-display font-bold text-3xl text-orange/30 tracking-tight select-none">
                    {step.number}
                  </span>
                </div>
                {/* Step content */}
                <div className="flex-1">
                  <h2 className="font-display font-bold text-xl text-navy tracking-tight">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-base text-muted leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* -- TRUST STRIP --------------------------------------------------- */}
      <section className="bg-navy text-paper">
        <Container width="wide" className="py-10">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            {trustStats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display font-semibold tracking-[0.12em] uppercase text-[10px] text-soft-orange/90">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-display font-bold text-2xl sm:text-3xl text-paper tracking-tight">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* -- CTA ----------------------------------------------------------- */}
      <section className="bg-paper">
        <Container width="default" className="py-16 lg:py-20 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-navy">
            Ready to start?
          </h2>
          <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
            Get a free on-site estimate from the project manager who will run your job.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center bg-orange hover:bg-orange-deep text-paper font-display font-semibold px-7 py-3 rounded-md transition-colors"
            >
              Get a Free Estimate
            </Link>
            <a
              href="tel:7639002024"
              className="inline-flex items-center justify-center bg-soft-navy text-navy font-display font-semibold px-7 py-3 rounded-md hover:bg-faint transition-colors"
            >
              Call 763-900-2024
            </a>
          </div>
        </Container>
      </section>
    </main>
  );
}
