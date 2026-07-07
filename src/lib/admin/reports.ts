// src/lib/admin/reports.ts
//
// Pure aggregation + CSV helpers for the admin KPI dashboard (Ticket D, Phase A).
// Sourced from the `leads` and `guide_requests` tables. All aggregation runs in
// JS over the fetched rows -- lead volume is low enough that fetching and
// bucketing in-process is simpler than SQL group-bys, and keeps this layer
// dependency-free and unit-testable.
//
// NOT in Phase A: lead response time (time-to-first-contact) has no source
// data yet -- the `leads` table carries no Roofr pipeline-stage or
// stage-change timestamp, only capture-time fields + sync-tracking columns.
// That metric unblocks when the Roofr -> Supabase stage sync (Zap 4) is live.

export interface LeadRow {
  id: string;
  created_at: string;
  form_type: string | null;
  project_type: string | null;
  source_channel: string | null;
  source_campaign: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}

export interface GuideRequestRow {
  id: string;
  created_at: string;
  guide_slug: string | null;
  utm_source: string | null;
}

export interface Bucket {
  key: string;
  count: number;
}

export interface WeekBucket {
  /** Human label, e.g. "Jul 7". */
  label: string;
  /** ISO date of the week start (Monday), for stable sorting/keys. */
  weekStart: string;
  count: number;
}

// ----- date helpers -------------------------------------------------------

/** Monday 00:00 (local) of the week containing `d`. */
export function startOfWeek(d: Date): Date {
  const out = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = out.getDay(); // 0=Sun..6=Sat
  const diff = (day + 6) % 7; // days since Monday
  out.setDate(out.getDate() - diff);
  return out;
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function shortLabel(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ----- aggregations -------------------------------------------------------

/**
 * Lead counts bucketed into the trailing `weeks` calendar weeks (Mon-start),
 * oldest first, including empty weeks so the trend line has no gaps.
 */
export function weeklyLeadCounts(
  rows: { created_at: string }[],
  weeks = 12,
  now = new Date()
): WeekBucket[] {
  const thisWeek = startOfWeek(now);
  const buckets: WeekBucket[] = [];
  const index = new Map<string, number>();

  for (let i = weeks - 1; i >= 0; i--) {
    const ws = new Date(thisWeek);
    ws.setDate(ws.getDate() - i * 7);
    const key = isoDate(ws);
    index.set(key, buckets.length);
    buckets.push({ label: shortLabel(ws), weekStart: key, count: 0 });
  }

  for (const r of rows) {
    if (!r.created_at) continue;
    const key = isoDate(startOfWeek(new Date(r.created_at)));
    const at = index.get(key);
    if (at !== undefined) buckets[at].count += 1;
  }
  return buckets;
}

/**
 * Count rows grouped by a derived key, sorted by count desc then key asc.
 * Null/empty keys collapse to `emptyLabel`.
 */
export function countBy<T>(
  rows: T[],
  keyFn: (row: T) => string | null | undefined,
  emptyLabel = "(unspecified)"
): Bucket[] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const raw = keyFn(r);
    const key = raw && raw.trim() !== "" ? raw.trim() : emptyLabel;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

/** Count of rows whose created_at falls within the trailing `days`. */
export function countSince(
  rows: { created_at: string }[],
  days: number,
  now = new Date()
): number {
  const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
  return rows.filter((r) => {
    const t = new Date(r.created_at).getTime();
    return !Number.isNaN(t) && t >= cutoff;
  }).length;
}

// ----- CSV ----------------------------------------------------------------

/** RFC-4180-style CSV cell escaping. */
function csvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(
  headers: string[],
  rows: (string | number | null | undefined)[][]
): string {
  const lines = [headers.map(csvCell).join(",")];
  for (const row of rows) lines.push(row.map(csvCell).join(","));
  return lines.join("\r\n");
}
