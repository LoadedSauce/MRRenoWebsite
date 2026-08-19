import { createServiceRoleClient } from "@/lib/supabase/server";
import { JobList } from "./job-list";
import { AddJobListingForm } from "./add-job-listing-form";
import type { JobListing } from "@/lib/supabase/types";

export default async function AdminJobsPage() {
  const supabase = createServiceRoleClient();
  const { data: jobs } = await supabase
    .from("job_listings")
    .select()
    .order("display_order", { ascending: true });

  const rows = (jobs ?? []) as JobListing[];
  const activeCount = rows.filter((j) => j.active).length;
  const templateCount = rows.length - activeCount;

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display font-bold text-2xl text-ink tracking-tight">Now Hiring</h1>
      <p className="mt-1 text-sm text-muted">
        Active listings appear on the site automatically. Turn a listing off to save it as a template. Flip it back on any time to relist without retyping.
      </p>
      <p className="mt-1 text-xs text-muted">
        {activeCount} active {activeCount === 1 ? "listing" : "listings"} / {templateCount} saved {templateCount === 1 ? "template" : "templates"}
      </p>
      <div className="mt-8">
        <AddJobListingForm />
      </div>
      <div className="mt-8">
        <JobList jobs={rows} />
      </div>
    </div>
  );
}
