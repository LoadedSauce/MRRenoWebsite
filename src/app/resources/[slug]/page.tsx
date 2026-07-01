import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import { GuideRequestForm } from "@/components/guide-request-form";
import {
  JsonLd,
  buildPageGraph,
  buildArticleSchema,
  buildBreadcrumbListSchema,
} from "@/lib/seo/schema";
import { buildResourceMetadata } from "@/lib/seo/routes";
import { getPublishedResources, getResource } from "@/lib/resources";

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

export default async function ResourcePostPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = getResource(slug);

  if (!resource || !resource.published) notFound();

  // Gated posts show the first section as a teaser then gate behind the form;
  // ungated posts render the full body straight through.
  const sections = resource.gated ? resource.body.slice(0, 1) : resource.body;

  return (
    <PageShell>
      <JsonLd
        data={buildPageGraph([
          buildArticleSchema({
            slug: resource.slug,
            title: resource.title,
            description: resource.dek,
            datePublished: resource.datePublished,
            dateModified: resource.dateModified,
          }),
          buildBreadcrumbListSchema([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            { name: resource.title, path: `/resources/${resource.slug}` },
          ]),
        ])}
      />

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

            <p className="mt-6 font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange">
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
            <div className="space-y-8">
              {sections.map((section, i) => (
                <div key={i}>
                  {section.heading ? (
                    <h2 className="font-display font-bold text-2xl text-ink leading-snug">
                      {section.heading}
                    </h2>
                  ) : null}
                  <div className={section.heading ? "mt-3 space-y-4" : "space-y-4"}>
                    {section.paragraphs.map((p, j) => (
                      <p key={j} className="text-base text-muted leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
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
                  className="inline-flex items-center justify-center rounded-md bg-orange px-6 py-3 font-display font-semibold text-sm text-paper hover:opacity-90 transition-opacity"
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
