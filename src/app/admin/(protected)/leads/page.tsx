import { createServiceRoleClient } from "@/lib/supabase/server";
import { ROOFR_SYNC_GRACE_MINUTES, type Lead } from "@/lib/supabase/types";
import { LeadList } from "./lead-list";

export const dynamic = "force-dynamic";

/**
 * Lead inbox — the safety net behind the Roofr handoff.
 *
 * Every submission is written to public.leads BEFORE the INT-001 webhook
 * fires, so this table is already the source of truth and the backup. What was
 * missing was any way to look at it: if the Zap failed, the lead sat here
 * unseen and the enquiry was effectively lost.
 *
 * So the screen leads with the number that matters -- leads that have not
 * reached Roofr -- rather than with a pretty table.
 *
 * Read-only apart from status and a manual "entered in Roofr" flag. There is
 * deliberately no delete: losing a lead is the failure mode this page exists
 * to prevent.
 */

/** Most recent N. The full history is one click away as CSV. */
const LEAD_LIMIT = 200;

function StatCard({
  label,
  value,
  sub,
  tone = "normal",
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: "normal" | "alert";
}) {
  const alert = tone === "alert";
  return (
    <div
      className={`rounded-xl border p-5 ${
        alert ? "border-red-300 bg-red-50" : "border-faint bg-paper"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-wider ${
          alert ? "text-red-800" : "text-muted"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-2 font-display text-3xl font-bold tracking-tight tabular-nums ${
          alert ? "text-red-900" : "text-ink"
        }`}
      >
        {value}
      </p>
      {sub ? (
        <p className={`mt-1 text-xs ${alert ? "text-red-800" : "text-muted"}`}>
          {sub}
        </p>
      ) : null}
    </div>
  );
}

export default async function AdminLeadsPage() {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("leads")
    .select()
    .order("created_at", { ascending: false })
    .limit(LEAD_LIMIT);

  const leads = (data as Lead[] | null) ?? [];

  // Photos live in a PRIVATE bucket and the column holds storage paths, not
  // URLs, so they need signing before the browser can load them. One batched
  // call for the whole page rather than one per lead.
  const photoPaths = leads
    .flatMap((l) => l.photo_urls ?? [])
    .filter((p) => p && !p.startsWith("http"));

  let signedPhotos: Record<string, string> = {};
  if (photoPaths.length > 0) {
    const { data: signed } = await supabase.storage
      .from("lead-photos")
      .createSignedUrls(photoPaths, 60 * 60);
    for (const row of signed ?? []) {
      if (row.signedUrl && row.path) signedPhotos[row.path] = row.signedUrl;
    }
  }

  const now = Date.now();
  const graceMs = ROOFR_SYNC_GRACE_MINUTES * 60 * 1000;
  const sinceWeek = now - 7 * 24 * 60 * 60 * 1000;

  const unsynced = leads.filter((l) => !l.synced_to_roofr);
  const stuck = unsynced.filter(
    (l) => now - new Date(l.created_at).getTime() > graceMs
  );
  const thisWeek = leads.filter(
    (l) => new Date(l.created_at).getTime() >= sinceWeek
  );

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink tracking-tight">
            Leads
          </h1>
          <p className="mt-1 text-sm text-muted max-w-2xl">
            Every enquiry from the website lands here first, then the Zap pushes
            it to Roofr. If the Zap ever fails, this is where the lead still
            lives &mdash; nothing is lost, it just needs entering by hand.
          </p>
        </div>
        <a
          href="/admin/reports/export?dataset=leads"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-faint bg-paper px-3 py-1.5 text-xs font-semibold text-navy hover:bg-soft-navy transition-colors"
        >
          Export all leads CSV
        </a>
      </div>

      {error ? (
        <p className="mt-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load leads: {error.message}
        </p>
      ) : null}

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total leads" value={leads.length} sub={leads.length >= LEAD_LIMIT ? `Showing latest ${LEAD_LIMIT}` : undefined} />
        <StatCard label="Last 7 days" value={thisWeek.length} />
        <StatCard
          label="Awaiting Roofr"
          value={unsynced.length}
          sub={`Under ${ROOFR_SYNC_GRACE_MINUTES} min is normal`}
        />
        <StatCard
          label="Not in Roofr"
          value={stuck.length}
          sub={
            stuck.length > 0
              ? "Enter these by hand, then mark them"
              : "Nothing stuck"
          }
          tone={stuck.length > 0 ? "alert" : "normal"}
        />
      </div>

      {stuck.length > 0 ? (
        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-5">
          <p className="font-display font-semibold text-sm text-red-900">
            {stuck.length} {stuck.length === 1 ? "lead has" : "leads have"} not
            reached Roofr
          </p>
          <p className="mt-1 text-sm text-red-800 leading-relaxed">
            These came in more than {ROOFR_SYNC_GRACE_MINUTES} minutes ago and
            the Zap has not confirmed them. They are safe here, but nobody in
            Roofr can see them. Open each one, add it to Roofr by hand, then hit
            &ldquo;Mark entered in Roofr&rdquo; so it stops showing up.
          </p>
        </div>
      ) : null}

      <div className="mt-8">
        <LeadList
          leads={leads}
          signedPhotos={signedPhotos}
          graceMinutes={ROOFR_SYNC_GRACE_MINUTES}
        />
      </div>
    </div>
  );
}
