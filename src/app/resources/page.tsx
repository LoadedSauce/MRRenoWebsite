import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Container } from "@/components/container";
import {
  JsonLd,
  buildPageGraph,
  buildWebPageSchema,
  buildBreadcrumbListSchema,
} from "@/lib/seo/schema";
import { buildResourcesMetadata } from "@/lib/seo/routes";
import { getPublishedResources } from "@/lib/resources";
import { loadPageContent, detectEditMode } from "@/lib/page-content/loader";
import { EditableText } from "@/components/editable/EditableText";
import { EditModeOverlay } from "@/components/editable/EditModeOverlay";

export const revalidate = 3600;
export const metadata: Metadata = buildResourcesMetadata();

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const isEditMode = await detectEditMode(sp);
  const content = await loadPageContent("resources", isEditMode);
  const resources = getPublishedResources();

  return (
    <PageShell>
      <JsonLd
        data={buildPageGraph([
          buildWebPageSchema(
            "/resources",
            "Remodeling Resources & Cost Guides | M.R. Renovations"
          ),
          buildBreadcrumbListSchema([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
          ]),
        ])}
      />

      {/* HERO */}
      <section className="bg-navy">
        <Container width="wide" className="py-16 lg:py-20 text-center">
          <p className="font-display font-semibold tracking-[0.14em] uppercase text-xs text-orange-on-dark">
            <EditableText
              content={content}
              blockKey="resources.hero.eyebrow"
              fallback="Resources"
            />
          </p>
          <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl tracking-tight text-paper leading-[1.05]">
            <EditableText
              content={content}
              blockKey="resources.hero.headline"
              fallback="Guides for planning your project"
            />
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-soft-navy leading-relaxed">
            <EditableText
              content={content}
              blockKey="resources.hero.subcopy"
              fallback="Plain-language planning guides and cost breakdowns from a family contractor with 40+ years in the northwest Twin Cities metro."
              multiline
            />
          </p>
        </Container>
      </section>

      {/* LISTING */}
      <section className="bg-paper">
        <Container width="wide" className="py-16 lg:py-20">
          {resources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((r) => (
                <article
                  key={r.slug}
                  className="flex flex-col rounded-lg border border-faint bg-paper p-6"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold tracking-[0.12em] uppercase text-[10px] text-orange">
                      {r.category}
                    </span>
                    {r.gated ? (
                      <span className="inline-flex items-center rounded-sm bg-soft-navy px-2 py-[2px] font-display text-[9px] font-bold uppercase tracking-widest text-navy">
                        Free Guide
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-3 font-display font-bold text-xl text-ink leading-snug">
                    <Link href={`/resources/${r.slug}`} className="hover:text-navy transition-colors">
                      {r.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-muted leading-relaxed flex-1">
                    {r.dek}
                  </p>
                  <p className="mt-4">
                    <Link
                      href={`/resources/${r.slug}`}
                      className="font-display font-semibold text-sm text-orange hover:opacity-90 transition-opacity"
                    >
                      <EditableText
                        content={content}
                        blockKey="resources.card.cta"
                        fallback="Read more"
                      />
                    </Link>
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-base text-muted">
              <EditableText
                content={content}
                blockKey="resources.empty.body"
                fallback="More guides coming soon."
              />
            </p>
          )}
        </Container>
      </section>

      {content.isEditMode ? <EditModeOverlay currentPath="/resources?edit=1" /> : null}
    </PageShell>
  );
}
