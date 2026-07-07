import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import { canonical } from "@/lib/seo/canonical";
import { getActiveJobListings } from "@/lib/supabase/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Careers | M.R. Renovations",
  description:
    "Join the M.R. Renovations team. Family-owned design-build serving the Twin Cities for 43 years.",
  alternates: { canonical: canonical("/careers") },
};

export default async function CareersPage() {
  const jobs = await getActiveJobListings();

  return (
    <PageShell>
      {/* Hero */}
      <section className="bg-navy text-paper">
        <Container width="wide" className="py-20 lg:py-28">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange-on-dark">
            Join the team
          </p>
          <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.05] text-paper max-w-2xl">
            Build something that lasts.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-soft-navy/90 max-w-xl leading-relaxed">
            Family-owned design-build serving the Twin Cities for 43 years. We hire
            craftspeople who take pride in their work.
          </p>
        </Container>
      </section>

      {/* Listings */}
      <section className="bg-paper">
        <Container width="wide" className="py-20 lg:py-24">
          {jobs.length === 0 ? (
            <div className="max-w-lg">
              <h2 className="font-display font-bold text-2xl text-ink">
                No open positions at this time.
              </h2>
              <p className="mt-4 text-base text-muted leading-relaxed">
                We do not always have open listings, but we are always interested in
                meeting skilled tradespeople. Send a brief introduction to{" "}
                <a
                  href="mailto:M.Randolph@Mrrenovations-llc.com"
                  className="text-orange underline underline-offset-2"
                >
                  M.Randolph@Mrrenovations-llc.com
                </a>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-w-2xl">
              <h2 className="font-display font-bold text-2xl text-ink">
                Open positions
              </h2>
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-faint bg-paper p-7"
                >
                  <h3 className="font-display font-bold text-xl text-ink">
                    {job.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center bg-orange hover:brightness-105 text-ink font-display font-semibold text-sm px-5 py-2.5 rounded-md transition"
                    >
                      Apply via contact form
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </PageShell>
  );
}
