import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import { GuideRequestForm } from "@/components/guide-request-form";
import { FaqAccordion } from "@/components/primitives/FaqAccordion";
import {
  JsonLd,
  buildPageGraph,
  buildArticleSchema,
  buildBreadcrumbListSchema,
  buildFaqPageSchema,
} from "@/lib/seo/schema";
import { buildResourceMetadata } from "@/lib/seo/routes";
import { getPublishedResources, getResource } from "@/lib/resources";
import type { ResourceBlock } from "@/lib/resources";

export const revalidate = 3600;

export function generateStaticParams() {
  return getPublishedResources().map((r) => ({ slug: r.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource || !resource.published) return {};
  return buildResourceMetadata(resource);
}

function Block({ block }: { block: ResourceBlock }) {
  switch (block.type) {
    case "prose":
      return (
        <div>
          {block.heading ? (
            <h2 className="font-display font-bold text-2xl text-ink leading-snug">
              {block.heading}
            </h2>
          ) : null}
          <div className={block.heading ? "mt-3 space-y-4" : "space-y-4"}>
            {block.paragraphs.map((p, j) => (
              <p key={j} className="text-base text-muted leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      );

    case "costTiers":
      return (
        <div>
          {block.heading ? (
            <h2 className="font-display font-bold text-2xl text-ink leading-snug">
              {block.heading}
            </h2>
          ) : null}
          <ul className="mt-4 space-y-4">
            {block.tiers.map((tier, j) => (
              <li
                key={j}
                className="rounded-lg border border-cream-deep bg-cream p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="font-display font-bold text-lg text-ink">
                    {tier.label}
                  </span>
                  <span className="font-display font-semibold text-base text-navy">
                    {tier.range}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {tier.description}
                </p>
              </li>
            ))}
          </ul>
          {block.note ? (
            <p className="mt-4 text-sm text-muted leading-relaxed italic">
              {block.note}
            </p>
          ) : null}
        </div>
      );

    case "breakdown":
      return (
        <div>
          {block.heading ? (
            <h2 className="font-display font-bold text-2xl text-ink leading-snug">
              {block.heading}
            </h2>
          ) : null}
          <dl className="mt-4 divide-y divide-faint border-y border-faint">
            {block.items.map((item, j) => (
              <div
                key={j}
                className="flex items-baseline justify-between gap-4 py-3"
              >
                <dt className="text-base text-ink">{item.label}</dt>
                <dd className="font-display font-semibold text-base text-navy tabular-nums">
                  {item.share}
                </dd>
              </div>
            ))}
          </dl>
          {block.note ? (
            <p className="mt-3 text-sm text-muted leading-relaxed italic">
              {block.note}
            </p>
          ) : null}
        </div>
      );

    case "gallery":
      return (
        <div>
          {block.heading ? (
            <h2 className="font-display font-bold text-2xl text-ink leading-snug">
              {block.heading}
            </h2>
          ) : null}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {block.images.map((img, j) => (
              <figure
                key={j}
                className="relative aspect-[4/3] overflow-hidden rounded-lg bg-cream border border-cream-deep"
              >
                {/* Plain <img> so a not-yet-uploaded placeholder path degrades
                    to the alt text inside a fixed-ratio box instead of breaking
                    the build or the layout. Swap for real assets later. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </figure>
            ))}
          </div>
        </div>
      );

    case "cta":
      return (
        <div className="rounded-lg bg-navy p-6 sm:p-8">
          <p className="font-display font-bold text-xl text-paper">
            {block.heading}
          </p>
          {block.body ? (
            <p className="mt-2 text-sm text-soft-navy leading-relaxed">
              {block.body}
            </p>
          ) : null}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
            <Link
              href={block.href}
              className="inline-flex items-center justify-center rounded-md bg-orange px-6 py-3 font-display font-semibold text-sm text-ink hover:brightness-105 transition"
            >
              {block.label}
            </Link>
            {block.phone ? (
              <a
                href={`tel:${block.phone.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center justify-center font-display font-semibold text-sm text-paper hover:text-orange transition-colors"
              >
                {block.phone}
              </a>
            ) : null}
          </div>
        </div>
      );

    case "faq":
      return (
        <div>
          {block.heading ? (
            <h2 className="font-display font-bold text-2xl text-ink leading-snug">
              {block.heading}
            </h2>
          ) : null}
          <div className="mt-2">
            <FaqAccordion
              items={block.items.map((f) => ({
                question: f.question,
                answer: f.answer,
              }))}
            />
          </div>
        </div>
      );

    default: {
      // Exhaustiveness guard: a new block type must be handled above.
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

export default async function ResourcePostPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = getResource(slug);

  if (!resource || !resource.published) notFound();

  // Gated posts show the first block as a teaser then gate behind the form;
  // ungated posts render the full body straight through.
  const blocks = resource.gated ? resource.body.slice(0, 1) : resource.body;

  // FAQPage JSON-LD is emitted only for FAQ content that is actually visible on
  // the page (so gated teasers never advertise hidden answers). Same array feeds
  // the accordion and the schema, so the answer text matches exactly.
  const faqItems = blocks
    .filter((b): b is Extract<ResourceBlock, { type: "faq" }> => b.type === "faq")
    .flatMap((b) => b.items);

  const graphNodes = [
    buildArticleSchema({
      slug: resource.slug,
      title: resource.title,
      description: resource.metaDescription ?? resource.dek,
      datePublished: resource.datePublished,
      dateModified: resource.dateModified,
    }),
    buildBreadcrumbListSchema([
      { name: "Home", path: "/" },
      { name: "Resources", path: "/resources" },
      { name: resource.title, path: `/resources/${resource.slug}` },
    ]),
  ];
  if (faqItems.length > 0) {
    graphNodes.push(buildFaqPageSchema(faqItems));
  }

  return (
    <PageShell>
      <JsonLd data={buildPageGraph(graphNodes)} />

      <article>
        {/* ── HERO ───────────────────────────────────────────── */}
        <section className="bg-navy">
          <Container width="narrow" className="py-12 lg:py-16">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-xs text-soft-navy">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="hover:text-paper transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/resources" className="hover:text-paper transition-colors">
                    Resources
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-paper">{resource.title}</li>
              </ol>
            </nav>

            <p className="mt-6 font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange-on-dark">
              {resource.category}
            </p>
            <h1 className="mt-3 font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-paper leading-[1.1]">
              {resource.title}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-soft-navy leading-relaxed">
              {resource.dek}
            </p>
          </Container>
        </section>

        {/* ── BODY ───────────────────────────────────────────── */}
        <section className="bg-paper">
          <Container width="narrow" className="py-12 lg:py-16">
            <div className="space-y-10">
              {blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>

            {/* Gated: email capture. Ungated: nothing extra here. */}
            {resource.gated ? (
              <div className="mt-10 max-w-md">
                <GuideRequestForm guideSlug={resource.slug} />
              </div>
            ) : null}

            {/* ── CTA block ────────────────────────────────────── */}
            <div className="mt-12 rounded-lg bg-cream border border-cream-deep p-6 sm:p-8">
              <p className="font-display font-bold text-xl text-ink">
                Ready to talk through your project?
              </p>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                See how M.R. Renovations approaches the work, then request a free,
                no-gimmick estimate.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <Link
                  href={resource.cta.href}
                  className="inline-flex items-center justify-center rounded-md bg-navy px-6 py-3 font-display font-semibold text-sm text-paper hover:opacity-90 transition-opacity"
                >
                  {resource.cta.label}
                </Link>
                <Link
                  href="/consultation"
                  className="inline-flex items-center justify-center rounded-md bg-orange px-6 py-3 font-display font-semibold text-sm text-ink hover:brightness-105 transition"
                >
                  Get a free estimate
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </article>
    </PageShell>
  );
}
