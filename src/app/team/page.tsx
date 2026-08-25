import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import { JsonLd, buildPageGraph, buildWebPageSchema } from "@/lib/seo/schema";
import { buildTeamMetadata } from "@/lib/seo/routes";
import { CandidateForm } from "@/components/candidate-form";
import { loadPageContent, detectEditMode } from "@/lib/page-content/loader";
import { EditableText } from "@/components/editable/EditableText";
import { EditablePhoto } from "@/components/editable/EditablePhoto";
import { EditModeOverlay } from "@/components/editable/EditModeOverlay";
import { getActiveTeamMembers } from "@/lib/supabase/queries";
import type { TeamMember, TeamSection } from "@/lib/supabase/types";

export const metadata: Metadata = buildTeamMetadata();
export const revalidate = 3600;

// Section keys used to route DB rows into their layout section on this page.
// These MUST match the TEAM_SECTIONS values in src/lib/supabase/types.ts.
const SECTION_OWNER: TeamSection = "Owner";
const SECTION_CSPC: TeamSection = "Customer Service, Production & Coordination";
const SECTION_SALES: TeamSection = "Sales";
const SECTION_CREW: TeamSection = "Crew";

function MemberCard({
  member,
  featured = false,
}: {
  member: TeamMember;
  featured?: boolean;
}) {
  const hasPhoto = Boolean(member.photo_url);
  return (
    <figure className="group">
      <div className="relative aspect-square overflow-hidden rounded-md bg-navy-deep">
        {hasPhoto ? (
          <Image
            src={member.photo_url as string}
            alt={`${member.name}, ${member.role} at M.R. Renovations`}
            fill
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
            sizes={featured ? "(max-width: 768px) 60vw, 240px" : "(max-width: 640px) 50vw, 180px"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-[56%] w-[56%] text-paper opacity-[0.25]"
              viewBox="0 0 100 100"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M50 50c9.4 0 17-9 17-20S59.4 10 50 10 33 19 33 30s7.6 20 17 20zm0 6c-15 0-34 7.8-34 23v6h68v-6c0-15.2-19-23-34-23z" />
            </svg>
          </div>
        )}
      </div>
      <figcaption className="pt-3 text-center">
        <h3
          className={`font-display font-bold uppercase tracking-wider text-ink ${
            featured ? "text-base" : "text-xs"
          }`}
        >
          {member.name}
        </h3>
        <p
          className={`mt-1 font-body italic ${
            featured ? "text-sm text-navy" : "text-xs text-muted"
          }`}
        >
          {member.role}
        </p>
      </figcaption>
    </figure>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto mb-6 flex max-w-3xl items-center gap-4">
      <span className="h-px flex-1 bg-faint" />
      <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-navy">
        {children}
      </span>
      <span className="h-px flex-1 bg-faint" />
    </div>
  );
}

const WHY_MR = [
  {
    title: "40+ years, one family",
    body: "Founded in Maple Grove. Still answering the phone ourselves. Still standing behind every project.",
  },
  {
    title: "Lifetime Transferable Warranty",
    body: "Our workmanship is warrantied for the life of the home, and it transfers to the next owner. Vanishingly rare in residential construction.",
  },
  {
    title: "Guaranteed pricing, no gimmicks",
    body: "Line-itemized contracts, fixed-fee design, transparent allowances. The estimate is the price.",
  },
  {
    title: "One project manager, start to finish",
    body: "The same person from the first sketch to the final walkthrough. No handoffs, no excuses.",
  },
];

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const isEditMode = await detectEditMode(sp);
  const content = await loadPageContent("team", isEditMode);

  // All roster data now lives in public.team_members. getActiveTeamMembers
  // already filters to active=true and orders by display_order. We further
  // bucket rows by section, preserving that display_order within each bucket.
  const roster = await getActiveTeamMembers();
  const bySection = (s: TeamSection) => roster.filter((m) => m.section === s);
  const owner = bySection(SECTION_OWNER)[0] ?? null;
  const cspc = bySection(SECTION_CSPC);
  const sales = bySection(SECTION_SALES);
  const crew = bySection(SECTION_CREW);

  return (
    <PageShell>
      <JsonLd
        data={buildPageGraph([
          buildWebPageSchema("/team", "Meet the Team | M.R. Renovations"),
        ])}
      />

      {/* HERO */}
      <section className="relative bg-navy px-6 py-20 text-center md:py-24">
        <p className="font-display text-xs font-medium uppercase tracking-[0.22em] text-orange-on-dark">
          <EditableText
            content={content}
            blockKey="team.hero.eyebrow"
            fallback="Our People"
          />
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-paper md:text-5xl">
          <EditableText
            content={content}
            blockKey="team.hero.headline"
            fallback="Meet the Team"
          />
        </h1>
        <p className="mx-auto mt-5 max-w-2xl font-body text-lg leading-relaxed text-soft-navy">
          <EditableText
            content={content}
            blockKey="team.hero.subcopy"
            fallback="You get the full team at your disposal. One project manager, start to finish. The same person from the first sketch to the final walkthrough. No handoffs, no excuses."
            multiline
          />
        </p>
        <span className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 bg-orange" />
      </section>

      {/* INTRO BAND */}
      <section className="bg-soft-navy px-6 py-12 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">
          <EditableText
            content={content}
            blockKey="team.intro.headline"
            fallback="What Makes Our Team Special"
          />
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-body text-base leading-relaxed text-muted">
          <EditableText
            content={content}
            blockKey="team.intro.subcopy"
            fallback="Our strength lies in the diverse roles and experience of our team. From our owner to our skilled carpenters, each member brings a unique perspective to every project, with all aspects handled with precision and care."
            multiline
          />
        </p>
      </section>

      {/* OWNER */}
      {owner ? (
        <section className="bg-paper px-6 py-12">
          <div className="mx-auto w-[200px] max-w-[60vw]">
            <MemberCard member={owner} featured />
          </div>
        </section>
      ) : null}

      {/* CUSTOMER SERVICE, PRODUCTION & COORDINATION */}
      {cspc.length > 0 ? (
        <section className="bg-soft-navy px-6 py-12">
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
            {cspc.map((m) => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        </section>
      ) : null}

      {/* SALES */}
      {sales.length > 0 ? (
        <section className="bg-paper px-6 py-12">
          <div className="mx-auto grid max-w-md grid-cols-3 gap-x-5 gap-y-8">
            {sales.map((m) => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        </section>
      ) : null}

      {/* OUR CREW */}
      {crew.length > 0 ? (
        <section className="bg-soft-navy px-6 py-14">
          <SectionLabel>
            <EditableText
              content={content}
              blockKey="team.crew.label"
              fallback="Our Crew"
            />
          </SectionLabel>
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {crew.map((m) => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        </section>
      ) : null}

      {/* WHY M.R. */}
      <section className="bg-paper">
        <Container width="wide" className="py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-navy">
                <EditablePhoto
                  content={content}
                  slotKey="team.why.image"
                  fallback={{
                    src: "/images/about-team.jpg",
                    alt: "M.R. Renovations team reviewing project plans.",
                  }}
                  render={({ src, alt }) => (
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes="(min-width: 1024px) 480px, 100vw"
                      className="object-cover"
                    />
                  )}
                />
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
                <EditableText
                  content={content}
                  blockKey="team.why.eyebrow"
                  fallback="Why M.R."
                />
              </p>
              <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-ink leading-[1.1]">
                <EditableText
                  content={content}
                  blockKey="team.why.headline"
                  fallback="A family contractor with the process of a design firm."
                  multiline
                />
              </h2>
              <p className="mt-5 text-base sm:text-lg text-muted leading-relaxed">
                <EditableText
                  content={content}
                  blockKey="team.why.subcopy"
                  fallback="40+ years of remodeling experience, run with the calm, written, on-time discipline you would expect from a much bigger firm."
                  multiline
                />
              </p>

              <ul className="mt-8 space-y-5">
                {WHY_MR.map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <span className="mt-1.5 inline-block w-2 h-2 rounded-full bg-orange shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-display font-semibold text-ink">{item.title}</p>
                      <p className="mt-1 text-sm text-muted leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-navy-deep px-6 py-16 text-center">
        <p className="font-display text-xs font-medium uppercase tracking-[0.22em] text-orange-on-dark">
          <EditableText
            content={content}
            blockKey="team.join.eyebrow"
            fallback="Join Us"
          />
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold text-paper">
          <EditableText
            content={content}
            blockKey="team.join.headline"
            fallback="Build Something That Lasts"
          />
        </h2>
        <p className="mx-auto mt-4 max-w-md font-body leading-relaxed text-soft-navy">
          <EditableText
            content={content}
            blockKey="team.join.subcopy"
            fallback="If you take pride in your craft and want to work with a team that has been building homes in the northwest metro for 40 years, we want to hear from you."
            multiline
          />
        </p>
        <Link
          href="/careers"
          className="mt-7 inline-block rounded-md bg-orange px-8 py-3.5 font-display text-xs font-medium uppercase tracking-wider text-ink transition hover:brightness-105"
        >
          <EditableText
            content={content}
            blockKey="team.join.cta"
            fallback="Get in Touch"
          />
        </Link>
      </section>

      {/* CANDIDATE APPLICATION */}
      <section id="apply" className="bg-paper px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-display text-xs font-medium uppercase tracking-[0.22em] text-orange">
            <EditableText
              content={content}
              blockKey="team.apply.eyebrow"
              fallback="Apply Now"
            />
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink">
            <EditableText
              content={content}
              blockKey="team.apply.headline"
              fallback="Send Us Your Resume"
            />
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-muted">
            <EditableText
              content={content}
              blockKey="team.apply.subcopy"
              fallback="Tell us a little about yourself and the work you do. Attach a resume and we will reach out if there is a fit."
              multiline
            />
          </p>
        </div>
        <div className="mt-8">
          <CandidateForm />
        </div>
      </section>

      {content.isEditMode ? <EditModeOverlay currentPath="/team?edit=1" /> : null}
    </PageShell>
  );
}
