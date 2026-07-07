"use client";

import { useMemo, useState } from "react";

// Ticket E — pixel reconciliation. Your Supabase lead count (ground truth,
// owned in-house) sits next to a manual-entry field for what the ad platform
// reported over the same window. Auto-pulling platform numbers via the
// Google/Meta APIs isn't worth building at this ad spend -- manual entry now.

export interface ReconLead {
  campaign: string | null;
  created_at: string;
  hasClickId: boolean;
}

const RANGES = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "All", days: 0 },
] as const;

function csvCell(v: string | number): string {
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function CampaignReconciliation({ leads }: { leads: ReconLead[] }) {
  const [days, setDays] = useState(30);
  const [platform, setPlatform] = useState<Record<string, string>>({});

  const { rows, untagged, clickIdCount, inRangeTotal } = useMemo(() => {
    const cutoff = days === 0 ? 0 : Date.now() - days * 86_400_000;
    const inRange = leads.filter((l) => {
      const t = new Date(l.created_at).getTime();
      return !Number.isNaN(t) && t >= cutoff;
    });
    const counts = new Map<string, number>();
    let untaggedCount = 0;
    let clicks = 0;
    for (const l of inRange) {
      if (l.hasClickId) clicks += 1;
      const c = l.campaign?.trim();
      if (!c) {
        untaggedCount += 1;
        continue;
      }
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    const grouped = [...counts.entries()]
      .map(([campaign, count]) => ({ campaign, count }))
      .sort((a, b) => b.count - a.count || a.campaign.localeCompare(b.campaign));
    return {
      rows: grouped,
      untagged: untaggedCount,
      clickIdCount: clicks,
      inRangeTotal: inRange.length,
    };
  }, [leads, days]);

  function gapFor(campaign: string, yours: number): number | null {
    const raw = platform[campaign];
    if (raw === undefined || raw.trim() === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n - yours : null;
  }

  function downloadCsv() {
    const header = ["campaign", "supabase_leads", "platform_reported", "gap"];
    const body = rows.map((r) => {
      const g = gapFor(r.campaign, r.count);
      return [
        r.campaign,
        r.count,
        platform[r.campaign]?.trim() ? Number(platform[r.campaign]) : "",
        g === null ? "" : g,
      ];
    });
    const csv = [header, ...body]
      .map((line) => line.map(csvCell).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `mr-campaign-reconciliation-${days || "all"}d.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-xl bg-paper border border-faint overflow-hidden">
      <div className="px-5 py-3 border-b border-faint bg-soft-navy flex items-center justify-between gap-3 flex-wrap">
        <h3 className="font-display font-semibold text-sm text-ink">
          Campaign reconciliation
          <span className="font-normal text-muted">
            {" "}
            &middot; your count vs platform-reported
          </span>
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-faint overflow-hidden">
            {RANGES.map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={() => setDays(r.days)}
                className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
                  days === r.days
                    ? "bg-navy text-paper"
                    : "bg-paper text-navy hover:bg-soft-navy"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={downloadCsv}
            disabled={rows.length === 0}
            className="rounded-md border border-faint bg-paper px-3 py-1 text-xs font-semibold text-navy hover:bg-soft-navy transition-colors disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="px-5 py-2.5 border-b border-faint text-xs text-muted flex flex-wrap gap-x-5 gap-y-1">
        <span>
          <strong className="text-ink tabular-nums">{inRangeTotal}</strong> leads
          in range
        </span>
        <span>
          <strong className="text-ink tabular-nums">{clickIdCount}</strong> with a
          click ID captured
        </span>
        <span>
          <strong className="text-ink tabular-nums">{untagged}</strong> untagged
          (direct / organic)
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="px-5 py-4 text-sm text-muted">
          No campaign-tagged leads in this range yet. Leads carrying a{" "}
          <code>utm_campaign</code> (and now <code>gclid</code>/<code>fbclid</code>)
          will appear here.
        </p>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-faint">
              <th className="px-5 py-2 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-5 py-2 text-right text-xs font-semibold text-muted uppercase tracking-wider">
                Your count
              </th>
              <th className="px-5 py-2 text-right text-xs font-semibold text-muted uppercase tracking-wider">
                Platform reported
              </th>
              <th className="px-5 py-2 text-right text-xs font-semibold text-muted uppercase tracking-wider">
                Gap
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-faint">
            {rows.map((r) => {
              const gap = gapFor(r.campaign, r.count);
              return (
                <tr key={r.campaign} className="hover:bg-soft-navy/40">
                  <td className="px-5 py-2.5 text-sm text-ink">{r.campaign}</td>
                  <td className="px-5 py-2.5 text-sm text-ink text-right tabular-nums">
                    {r.count}
                  </td>
                  <td className="px-5 py-2 text-right">
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={platform[r.campaign] ?? ""}
                      onChange={(e) =>
                        setPlatform((p) => ({
                          ...p,
                          [r.campaign]: e.target.value,
                        }))
                      }
                      placeholder="-"
                      className="w-20 rounded border border-faint px-2 py-1 text-sm text-ink text-right tabular-nums focus:outline-none focus:border-navy"
                    />
                  </td>
                  <td
                    className={`px-5 py-2.5 text-sm text-right tabular-nums ${
                      gap === null
                        ? "text-muted"
                        : gap === 0
                          ? "text-green-700"
                          : "text-orange-deep"
                    }`}
                  >
                    {gap === null ? "-" : gap > 0 ? `+${gap}` : gap}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
