import { createServiceRoleClient } from "@/lib/supabase/server";
import { JobList } from "./job-list";
import { AddJobListingForm } from "./add-job-listing-form";

export default async function AdminJobsPage() {
  const supabase = createServiceRoleClient();
  const { data: jobs } = await supabase
    .from("job_listings")
    .select()
    .order("display_order", { ascending: true });

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display font-bold text-2xl text-ink tracking-tight">Now Hiring</h1>
      <p className="mt-1 text-sm text-muted">
        Active listings appear on the site automatically. Toggle off to hide without deleting.
      </p>
      <div className="mt-8">
        <AddJobListingForm />
      </div>
      <div className="mt-8">
        <JobList jobs={jobs ?? []} />
      </div>
    </div>
  );
}
