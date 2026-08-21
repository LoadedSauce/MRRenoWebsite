import { createServiceRoleClient } from "@/lib/supabase/server";
import { PortfolioGrid } from "./portfolio-grid";
import { AddPortfolioItemForm } from "./add-portfolio-item-form";
import {
  MAX_FEATURED_PORTFOLIO_ITEMS,
  MAX_FEATURED_PORTFOLIO_ITEMS_PER_SERVICE,
  SERVICE_LABELS,
  SERVICE_SLUGS,
  type PortfolioItem,
  type ServiceSlug,
} from "@/lib/supabase/types";

export default async function AdminPortfolioPage() {
  const supabase = createServiceRoleClient();
  const { data: items } = await supabase
    .from("portfolio_items")
    .select()
    .order("display_order", { ascending: true });

  const rows = (items ?? []) as PortfolioItem[];
  const featured = rows.filter((i) => i.featured && i.active);
  const featuredCount = featured.length;

  // Per-service featured groupings. Only counts active items with a
  // non-null service_featured_order that match one of the six known
  // service slugs; anything else is ignored (safety net for stale data).
  const serviceFeatured: Record<ServiceSlug, PortfolioItem[]> = {
    kitchens: [],
    bathrooms: [],
    basements: [],
    additions: [],
    "whole-home": [],
    exterior: [],
  };
  for (const item of rows) {
    if (
      !item.active ||
      item.service_featured_order === null ||
      item.service === null
    ) {
      continue;
    }
    const slug = item.service as ServiceSlug;
    if (SERVICE_SLUGS.includes(slug)) {
      serviceFeatured[slug].push(item);
    }
  }
  // Sort each service's featured items by their explicit order.
  for (const slug of SERVICE_SLUGS) {
    serviceFeatured[slug].sort(
      (a, b) =>
        (a.service_featured_order ?? 0) - (b.service_featured_order ?? 0)
    );
  }

  // Per-service hero photo lookup. At most one active hero per service
  // (enforced by DB partial unique index and by the admin server action).
  const serviceHero: Partial<Record<ServiceSlug, PortfolioItem>> = {};
  for (const item of rows) {
    if (
      !item.active ||
      !item.is_service_hero ||
      item.service === null
    ) {
      continue;
    }
    const slug = item.service as ServiceSlug;
    if (SERVICE_SLUGS.includes(slug) && !serviceHero[slug]) {
      serviceHero[slug] = item;
    }
  }

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-display font-bold text-2xl text-ink tracking-tight">
        Project Photos
      </h1>
      <p className="mt-1 text-sm text-muted">
        Upload project photos. Tag each one to a service and city so it appears in the right gallery. Star up to {MAX_FEATURED_PORTFOLIO_ITEMS} to feature them on the homepage. Toggle off to hide without deleting.
      </p>

      {/* Featured strip: preview of what's on the homepage */}
      <div className="mt-8 bg-paper rounded-xl border border-faint p-5">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-display font-semibold text-base text-ink">
            Featured on homepage
          </h2>
          <span
            className={`text-xs font-medium ${
              featuredCount === MAX_FEATURED_PORTFOLIO_ITEMS
                ? "text-green-700"
                : "text-muted"
            }`}
          >
            {featuredCount} of {MAX_FEATURED_PORTFOLIO_ITEMS} spots used
          </span>
        </div>
        {featuredCount === 0 ? (
          <p className="text-xs text-muted">
            No photos featured yet. Star up to {MAX_FEATURED_PORTFOLIO_ITEMS} photos below to fill this strip. Until then, the homepage falls back to the most recently added photos.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {featured.slice(0, MAX_FEATURED_PORTFOLIO_ITEMS).map((item) => (
              <div
                key={item.id}
                className="relative aspect-square rounded-md overflow-hidden bg-soft-navy border border-faint"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.photo_url}
                  alt={item.caption ?? "Featured photo"}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1.5 left-1.5 text-[10px] font-display font-semibold px-1.5 py-0.5 rounded bg-orange text-paper">
                  Featured
                </span>
              </div>
            ))}
            {Array.from({ length: MAX_FEATURED_PORTFOLIO_ITEMS - featuredCount }).map(
              (_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square rounded-md border border-dashed border-faint bg-soft-navy/30 flex items-center justify-center text-xs text-muted"
                >
                  Empty
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Per-service hero photos: one hero per service page (Tier 2 and Tier 3). */}
      <div className="mt-8 bg-paper rounded-xl border border-faint p-5">
        <div className="mb-3">
          <h2 className="font-display font-semibold text-base text-ink">
            Service page hero photos
          </h2>
          <p className="mt-1 text-xs text-muted">
            One hero photo per service page. Click the home icon (amber) on any photo below to set it as its service's hero. Basements and Exterior need heroes; the others can be customized here too.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {SERVICE_SLUGS.map((slug) => {
            const hero = serviceHero[slug];
            return (
              <div key={slug}>
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-display font-semibold text-sm text-ink">
                    {SERVICE_LABELS[slug]}
                  </h3>
                  <span
                    className={`text-[10px] font-medium ${
                      hero ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {hero ? "Set" : "No hero"}
                  </span>
                </div>
                {hero ? (
                  <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-soft-navy border border-faint">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hero.photo_url}
                      alt={hero.caption ?? `${SERVICE_LABELS[slug]} hero photo`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 text-[10px] font-display font-semibold px-1.5 py-0.5 rounded bg-amber-500 text-paper">
                      Hero
                    </span>
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-md border border-dashed border-red-300 bg-red-50/40 flex items-center justify-center text-xs text-red-600 text-center px-3">
                    Set a hero from a photo below (home icon)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-service featured strips: preview of each service page. */}
      <div className="mt-8 bg-paper rounded-xl border border-faint p-5">
        <div className="mb-3">
          <h2 className="font-display font-semibold text-base text-ink">
            Featured on service pages
          </h2>
          <p className="mt-1 text-xs text-muted">
            Each service page shows its featured photos first, then the rest of that service's active photos. Star up to {MAX_FEATURED_PORTFOLIO_ITEMS_PER_SERVICE} per service using the service star on each photo below.
          </p>
        </div>
        <div className="space-y-5">
          {SERVICE_SLUGS.map((slug) => {
            const items = serviceFeatured[slug];
            const count = items.length;
            const atCap = count === MAX_FEATURED_PORTFOLIO_ITEMS_PER_SERVICE;
            return (
              <div key={slug}>
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-display font-semibold text-sm text-ink">
                    {SERVICE_LABELS[slug]}
                  </h3>
                  <span
                    className={`text-xs font-medium ${
                      atCap ? "text-green-700" : "text-muted"
                    }`}
                  >
                    {count} of {MAX_FEATURED_PORTFOLIO_ITEMS_PER_SERVICE} spots used
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="relative aspect-square rounded-md overflow-hidden bg-soft-navy border border-faint"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.photo_url}
                        alt={item.caption ?? `${SERVICE_LABELS[slug]} featured photo`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 text-[10px] font-display font-semibold px-1.5 py-0.5 rounded bg-navy text-paper">
                        Service
                      </span>
                    </div>
                  ))}
                  {Array.from({
                    length: MAX_FEATURED_PORTFOLIO_ITEMS_PER_SERVICE - count,
                  }).map((_, i) => (
                    <div
                      key={`empty-${slug}-${i}`}
                      className="aspect-square rounded-md border border-dashed border-faint bg-soft-navy/30 flex items-center justify-center text-xs text-muted"
                    >
                      Empty
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <AddPortfolioItemForm />
      </div>
      <div className="mt-10">
        <PortfolioGrid items={rows} />
      </div>
    </div>
  );
}
