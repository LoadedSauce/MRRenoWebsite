// GET /admin/reports/export?dataset=leads|guide-requests
//
// Streams the underlying raw dataset as a CSV download. Admin-only: the
// /admin/:path* middleware guard authenticates the request before it reaches
// this handler (same access model as the rest of /admin). Aggregated views on
// the dashboard are derived from these same rows, so exporting the raw tables
// lets an admin reproduce or extend any breakdown offline.

import { createServiceRoleClient } from "@/lib/supabase/server";
import { toCsv } from "@/lib/admin/reports";

export const dynamic = "force-dynamic";

const LEAD_COLUMNS = [
  "created_at",
  "form_type",
  "first_name",
  "last_name",
  "email",
  "phone",
  "project_type",
  "project_details",
  "preferred_contact",
  "street_address",
  "city",
  "state",
  "zip",
  "source_channel",
  "source_campaign",
  "landing_url",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "status",
  "synced_to_roofr",
  "roofr_synced_at",
] as const;

const GUIDE_COLUMNS = [
  "created_at",
  "name",
  "email",
  "guide_slug",
  "source_channel",
  "landing_url",
  "utm_source",
  "utm_medium",
  "utm_campaign",
] as const;

const DATASETS = {
  leads: { table: "leads", columns: LEAD_COLUMNS },
  "guide-requests": { table: "guide_requests", columns: GUIDE_COLUMNS },
} as const;

type DatasetKey = keyof typeof DATASETS;

export async function GET(request: Request) {
  const dataset = (new URL(request.url).searchParams.get("dataset") ??
    "leads") as DatasetKey;
  const config = DATASETS[dataset];
  if (!config) {
    return new Response("Unknown dataset", { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from(config.table)
    .select(config.columns.join(","))
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(`Export failed: ${error.message}`, { status: 500 });
  }

  const cols = config.columns as readonly string[];
  const rows = ((data ?? []) as unknown as Record<string, unknown>[]).map((r) =>
    cols.map((c) => {
      const v = r[c];
      return v === null || v === undefined ? "" : (v as string | number);
    })
  );

  const csv = toCsv([...cols], rows);
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mr-${dataset}-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
