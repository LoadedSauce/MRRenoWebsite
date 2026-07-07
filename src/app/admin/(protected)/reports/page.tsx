import Link from "next/link";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  weeklyLeadCounts,
  countBy,
  countSince,
  type LeadRow,
  type GuideRequestRow,
  type Bucket,
} from "@/lib/admin/reports";

// Ticket D (Phase A): read-only business-KPI dashboard sourced from Supabase.
// Distinct from GA4/Clarity (on-site behavior) -- these are lead/business
// outcomes. Auto-protected by the /admin/:path* middleware guard.

export const dynamic = "force-dynamic";

const LEAD_SELECT =
  "id,created_at,form_type,project_type,source_channel,source_campaign,utm_source,utm_medium,utm_campaign,status,city,state,zip";

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl bg-paper border border-faint p-5">
      <p className="text-xs font-semibold text-muted uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-2 font-display font-bold text-3xl text-ink tracking-tight">
        {value}
      </p>
      {sub ? <p className="mt-1 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function BreakdownTable({
  title,
  keyHeader,
  buckets,
  total,
}: {
  title: string;
  keyHeader: string;
  buckets: Bucket[];
  total: number;
}) {
  return (
    <div className="rounded-xl bg-paper border border-faint overflow-hidden">
      <div className="px-5 py-3 border-b border-faint bg-soft-navy">
        <h3 className="font-display font-semibold text-sm text-ink">{title}</h3>
      </div>
      {buckets.length === 0 ? (
        <p className="px-5 py-4 text-sm text-muted">No data yet.</p>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-faint">
              <th className="px-5 py-2 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                {keyHeader}
              </th>
              <th className="px-5 py-2 text-right text-xs font-semibold text-muted uppercase tracking-wider">
                Leads
              </th>
              <th className="px-5 py-2 text-right text-xs font-semibold text-muted uppercase tracking-wider">
                Share
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-faint">
            {buckets.map((b) => (
              <tr key={b.key} className="hover:bg-soft-navy/40">
                <td className="px-5 py-2.5 text-sm text-ink">{b.key}</td>
                <td className="px-5 py-2.5 text-sm text-ink text-right tabular-nums">
                  {b.count}
                </td>
                <td className="px-5 py-2.5 text-xs text-muted text-right tabular-nums">
                  {total > 0 ? `${Math.round((b.count / total) * 100)}%` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function ExportButton({ dataset, label }: { dataset: string; label: string }) {
  return (
    <a
      href={`/admin/reports/export?dataset=${dataset}`}
      className="inline-flex items-center gap-1.5 rounded-md border border-faint bg-paper px-3 py-1.5 text-xs font-semibold text-navy hover:bg-soft-navy transition-colors"
    >
      <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          d="M10 3v9m0 0 3-3m-3 3-3-3M4 15h12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </a>
  );
}

export default async function AdminReportsPage() {
  const supabase = createServiceRoleClient();

  const [leadsRes, guidesRes] = await Promise.all([
    supabase
      .from("leads")
      .select(LEAD_SELECT)
      .order("created_at", { ascending: false }),
    supabase
      .from("guide_requests")
      .select("id,created_at,guide_slug,utm_source")
      .order("created_at", { ascending: false }),
  ]);

  const leads: LeadRow[] = (leadsRes.data as LeadRow[] | null) ?? [];
  const guides: GuideRequestRow[] =
    (guidesRes.data as GuideRequestRow[] | null) ?? [];

  const weekly = weeklyLeadCounts(leads, 12);
  const maxWeek = Math.max(1, ...weekly.map((w) => w.count));
  const byService = countBy(leads, (l) => l.project_type);
  const bySource = countBy(leads, (l) => l.source_channel || l.utm_source);
  const byZip = countBy(leads, (l) => l.zip);
  const byGuide = countBy(guides, (g) => g.guide_slug);

  const leadsThisWeek = countSince(leads, 7);
  const leadsPrev7 = countSince(leads, 14) - leadsThisWeek;

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink tracking-tight">
            Reports
          </h1>
          <p className="text-sm text-muted mt-1">
            Business KPIs from website leads and guide requests. On-site
            behavior (bounce, engagement, page flow) lives in GA4/Clarity, not
            here.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <ExportButton dataset="leads" label="Export leads CSV" />
          <ExportButton dataset="guide-requests" label="Export guides CSV" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total leads" value={leads.length} />
        <StatCard
          label="Leads this week"
          value={leadsThisWeek}
          sub={`${leadsPrev7} in the prior 7 days`}
        />
        <StatCard label="Guide requests" value={guides.length} />
        <div className="rounded-xl border border-dashed border-faint bg-soft-navy/40 p-5">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">
            Avg lead response time
          </p>
          <p className="mt-2 font-display font-bold text-lg text-muted">
            Pending
          </p>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            Awaiting the Roofr&nbsp;&rarr;&nbsp;Supabase stage sync (Zap 4).
            Needs a stage-change timestamp before time-to-first-contact can be
            measured.
          </p>
        </div>
      </div>

      {/* Weekly trend */}
      <div className="rounded-xl bg-paper border border-faint overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-faint bg-soft-navy">
          <h3 className="font-display font-semibold text-sm text-ink">
            Leads per week
            <span className="font-normal text-muted"> &middot; last 12 weeks</span>
          </h3>
        </div>
        <div className="p-5 space-y-1.5">
          {weekly.map((w) => (
            <div key={w.weekStart} className="flex items-center gap-3">
              <span className="w-12 shrink-0 text-xs text-muted tabular-nums">
                {w.label}
              </span>
              <div className="flex-1 h-5 bg-soft-navy rounded-sm overflow-hidden">
                <div
                  className="h-full bg-orange rounded-sm"
                  style={{ width: `${(w.count / maxWeek) * 100}%` }}
                />
              </div>
              <span className="w-6 shrink-0 text-xs text-ink text-right tabular-nums">
                {w.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BreakdownTable
          title="Leads by service type"
          keyHeader="Service"
          buckets={byService}
          total={leads.length}
        />
        <BreakdownTable
          title="Leads by source"
          keyHeader="Source"
          buckets={bySource}
          total={leads.length}
        />
        <BreakdownTable
          title="Leads by ZIP"
          keyHeader="ZIP"
          buckets={byZip}
          total={leads.length}
        />
        <BreakdownTable
          title="Guide requests by guide"
          keyHeader="Guide"
          buckets={byGuide}
          total={guides.length}
        />
      </div>
    </div>
  );
}
