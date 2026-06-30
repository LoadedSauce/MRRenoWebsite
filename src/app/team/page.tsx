import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import { JsonLd, buildPageGraph, buildWebPageSchema } from "@/lib/seo/schema";
import { buildTeamMetadata } from "@/lib/seo/routes";
import { getActiveTeamMembers } from "@/lib/supabase/queries";

export const revalidate = 3600;
export const metadata: Metadata = buildTeamMetadata();

export default async function TeamPage() {
  const teamMembers = await getActiveTeamMembers();

  return (
    <PageShell>
      <JsonLd
        data={buildPageGraph([
          buildWebPageSchema("/team", "Meet the Team | M.R. Renovations"),
        ])}
      />

      {/* ── ABOUT (moved from home page) ─────────────────────── */}
      <section className="bg-paper">
        <Container width="wide" className="py-16 lg:py-24">
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
              <h1 className="mt-3 font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-ink leading-[1.1]">
                A family contractor with the <span className="accent">process of a design firm.</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-muted leading-relaxed">
                43+ years of remodeling experience, run with the calm, written, on-time discipline you&rsquo;d expect from a much bigger firm.
              </p>

              <ul className="mt-8 space-y-5">
                {[
                  {
                    title: "43+ years, one family",
                    body: "Founded in Maple Grove. Still answering the phone ourselves. Still standing behind every project.",
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

      {/* ── FULL TEAM ROSTER ─────────────────────────────────── */}
      <section className="bg-cream">
        <Container width="wide" className="py-20 lg:py-24">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
            Meet the team
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-ink max-w-3xl leading-[1.1]">
            The people behind <span className="accent">every project.</span>
          </h2>

          {teamMembers.length > 0 ? (
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-soft-navy">
                    {member.photo_url ? (
                      <Image
                        src={member.photo_url}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="flex items-center justify-center h-full font-display font-bold text-2xl text-muted">
                        {member.name[0]}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 font-display font-semibold text-sm text-ink">{member.name}</p>
                  <p className="text-xs text-muted">{member.role}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-base text-muted">
              Team roster coming soon.
            </p>
          )}
        </Container>
      </section>
    </PageShell>
  );
}
