import { createServiceRoleClient } from "@/lib/supabase/server";
import { PortfolioGrid } from "./portfolio-grid";
import { AddPortfolioItemForm } from "./add-portfolio-item-form";

export default async function AdminPortfolioPage() {
  const supabase = createServiceRoleClient();
  const { data: items } = await supabase
    .from("portfolio_items")
    .select()
    .order("display_order", { ascending: true });

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-display font-bold text-2xl text-ink tracking-tight">
        Project Photos
      </h1>
      <p className="mt-1 text-sm text-muted">
        Upload project photos. Tag each one to a service and city so it appears in the right gallery. Toggle off to hide without deleting.
      </p>
      <div className="mt-8">
        <AddPortfolioItemForm />
      </div>
      <div className="mt-10">
        <PortfolioGrid items={items ?? []} />
      </div>
    </div>
  );
}
