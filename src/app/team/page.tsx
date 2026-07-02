import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import { JsonLd, buildPageGraph, buildWebPageSchema } from "@/lib/seo/schema";
import { buildTeamMetadata } from "@/lib/seo/routes";
import { CandidateForm } from "@/components/candidate-form";

export const metadata: Metadata = buildTeamMetadata();

type Card =
  | { kind: "member"; name: string; role: string; slug: string }
  | { kind: "hiring"; role: string };

// Owner, alone at the top
const OWNER: Extract<Card, { kind: "member" }> = {
  kind: "member",
  name: "Mike Randolph",
  role: "Owner / CEO",
  slug: "mike-randolph",
};

// Office / management row
const ROW_TWO: Card[] = [
  { kind: "member", name: "Miya Walker",     role: "Customer Service Manager", slug: "miya-walker"     },
  { kind: "member", name: "Aidan Gould",     role: "Project Assistant",        slug: "aidan-gould"     },
  { kind: "member", name: "Audra Karschnia", role: "Project Assistant",        slug: "audra-karschnia" },
  { kind: "member", name: "Nate Hatfield",   role: "Production Manager",       slug: "nate-hatfield"   },
];

// Sales row: Chris plus two open sales spaces
const ROW_THREE: Card[] = [
  { kind: "member", name: "Chris Hunter", role: "Sales Consultant", slug: "chris-hunter" },
  { kind: "hiring", role: "Sales Consultant" },
  { kind: "hiring", role: "Sales Consultant" },
];

// The crew, with the open trade roles interspersed
const CREW: Card[] = [
  { kind: "member", name: "Craig Jones",    role: "Lead Tile / Stone Installer", slug: "craig-jones"    },
  { kind: "member", name: "Eric Engwer",    role: "Lead Painter",                slug: "eric-engwer"    },
  { kind: "hiring", role: "Lead Carpenter" },
  { kind: "hiring", role: "Lead Carpenter" },
  { kind: "hiring", role: "Lead Carpenter" },
  { kind: "member", name: "Reggie Carter",  role: "Carpenter",                   slug: "reggie-carter"  },
  { kind: "hiring", role: "Carpenter" },
  { kind: "hiring", role: "Carpenter" },
  { kind: "member", name: "Mario Coletta",  role: "Tile Installer",              slug: "mario-coletta"  },
  { kind: "member", name: "Daniel Farrell", role: "Painter",                     slug: "daniel-farrell" },
  { kind: "hiring", role: "Apprentice Carpenter" },
  { kind: "hiring", role: "Apprentice Carpenter" },
];

function MemberCard({
  member,
  featured = false,
}: {
  member: Extract<Card, { kind: "member" }>;
  featured?: boolean;
}) {
  return (
    <figure className="group">
      <div className="relative aspect-square overflow-hidden rounded-md bg-navy-deep">
        <Image
          src={`/images/team/${member.slug}.jpg`}
          alt={`${member.name}, ${member.role} at M.R. Renovations`}
          fill
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          sizes={featured ? "(max-width: 768px) 60vw, 240px" : "(max-width: 640px) 50vw, 180px"}
        />
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

function HiringCard({ role }: { role: string }) {
  return (
    <figure>
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-md border border-dashed border-faint bg-soft-navy">
        <svg
          className="mt-[6%] h-[56%] w-[56%] text-ink opacity-[0.22]"
          viewBox="0 0 100 100"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M50 50c9.4 0 17-9 17-20S59.4 10 50 10 33 19 33 30s7.6 20 17 20zm0 6c-15 0-34 7.8-34 23v6h68v-6c0-15.2-19-23-34-23z" />
        </svg>
        <span className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-orange px-2 py-[3px] font-display text-[8px] font-bold uppercase tracking-widest text-paper">
          Now Hiring
        </span>
      </div>
      <figcaption className="pt-3 text-center">
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-orange">
          Hiring
        </h3>
        <p className="mt-1 font-body text-xs italic text-muted">{role}</p>
      </figcaption>
    </figure>
  );
}

function renderCard(card: Card, key: string | number) {
  return card.kind === "member" ? (
    <MemberCard key={key} member={card} />
  ) : (
    <HiringCard key={key} role={card.role} />
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
];

export default function TeamPage() {
  return (
    <PageShell>
      <JsonLd
        data={buildPageGraph([
          buildWebPageSchema("/team", "Meet the Team | M.R. Renovations"),
        ])}
      />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-navy px-6 py-20 text-center md:py-24">
        <p className="font-display text-xs font-medium uppercase tracking-[0.22em] text-orange">
          Our People
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-paper md:text-5xl">
          Meet the Team
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-body text-lg leading-relaxed text-soft-navy">
          Get to know the dedicated professionals behind M.R. Renovations. Our
          team&apos;s diverse expertise and commitment to quality ensure
          exceptional results for every project.
        </p>
        <span className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 bg-orange" />
      </section>

      {/* ── INTRO BAND ───────────────────────────────────────── */}
      <section className="bg-soft-navy px-6 py-12 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">
          What Makes Our Team Special
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-body text-base leading-relaxed text-muted">
          Our strength lies in the diverse roles and experience of our team.
          From our owner to our skilled carpenters, each member brings a unique
          perspective to every project, with all aspects handled with precision
          and care.
        </p>
      </section>

      {/* ── OWNER ────────────────────────────────────────────── */}
      <section className="bg-paper px-6 py-12">
        <div className="mx-auto w-[200px] max-w-[60vw]">
          <MemberCard member={OWNER} featured />
        </div>
      </section>

      {/* ── OFFICE / MANAGEMENT ──────────────────────────────── */}
      <section className="bg-soft-navy px-6 py-12">
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
          {ROW_TWO.map((c, i) => renderCard(c, i))}
        </div>
      </section>

      {/* ── SALES: Chris + open sales spaces ─────────────────── */}
      <section className="bg-paper px-6 py-12">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-x-5 gap-y-8">
          {ROW_THREE.map((c, i) => renderCard(c, i))}
        </div>
      </section>

      {/* ── OUR CREW (with interspersed open roles) ──────────── */}
      <section className="bg-soft-navy px-6 py-14">
        <SectionLabel>Our Crew</SectionLabel>
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {CREW.map((c, i) => renderCard(c, i))}
        </div>
      </section>

      {/* ── WHY M.R. (moved from home page About) ────────────── */}
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
              <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-ink leading-[1.1]">
                A family contractor with the <span className="accent">process of a design firm.</span>
              </h2>
              <p className="mt-5 text-base sm:text-lg text-muted leading-relaxed">
                43+ years of remodeling experience, run with the calm, written, on-time discipline you&rsquo;d expect from a much bigger firm.
              </p>

              <ul className="mt-8 space-y-5">
                {WHY_MR.map((item) => (
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

      {/* ── CLOSING CTA ──────────────────────────────────────── */}
      <section className="bg-navy-deep px-6 py-16 text-center">
        <p className="font-display text-xs font-medium uppercase tracking-[0.22em] text-orange">
          Join Us
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold text-paper">
          Build Something That Lasts
        </h2>
        <p className="mx-auto mt-4 max-w-md font-body leading-relaxed text-soft-navy">
          If you take pride in your craft and want to work with a team that has
          been building homes in the northwest metro for 40 years, we want to
          hear from you.
        </p>
        <Link
          href="/careers"
          className="mt-7 inline-block rounded-md bg-orange px-8 py-3.5 font-display text-xs font-medium uppercase tracking-wider text-paper transition-opacity hover:opacity-90"
        >
          Get in Touch
        </Link>
      </section>

      {/* ── CANDIDATE APPLICATION (Ticket D) ─────────────────── */}
      <section id="apply" className="bg-paper px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-display text-xs font-medium uppercase tracking-[0.22em] text-orange">
            Apply Now
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink">
            Send Us Your Resume
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-muted">
            Tell us a little about yourself and the work you do. Attach a resume
            and we will reach out if there is a fit.
          </p>
        </div>
        <div className="mt-8">
          <CandidateForm />
        </div>
      </section>
    </PageShell>
  );
}
