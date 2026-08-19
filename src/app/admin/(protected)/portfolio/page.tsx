import { createServiceRoleClient } from "@/lib/supabase/server";
import { PortfolioGrid } from "./portfolio-grid";
import { AddPortfolioItemForm } from "./add-portfolio-item-form";
import {
  MAX_FEATURED_PORTFOLIO_ITEMS,
  type PortfolioItem,
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

      <div className="mt-8">
        <AddPortfolioItemForm />
      </div>
      <div className="mt-10">
        <PortfolioGrid items={rows} />
      </div>
    </div>
  );
}
