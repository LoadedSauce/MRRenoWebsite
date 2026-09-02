import type { QrPerformanceRow } from "@/lib/supabase/types";

/**
 * INT-004 print/campaign ROI block.
 *
 * Reads public.qr_performance, which is the join of the code registry, the
 * scan log, and the leads those scans produced. Two numbers matter most and
 * are deliberately the widest columns: scan-to-lead percentage (is the
 * creative working?) and cost per lead (is the placement worth renewing?).
 *
 * "Scans" excludes bots and same-device repeats. "Hits" does not -- the gap
 * between them is shown so a suspiciously large number is visible rather than
 * quietly inflating the rate.
 */

function money(v: number | null): string {
  if (v === null || v === undefined) return "-";
  return `$${v.toFixed(2).replace(/\.00$/, "")}`;
}

function pct(v: number | null): string {
  if (v === null || v === undefined) return "-";
  return `${v}%`;
}

function shortDate(iso: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function QrPerformance({ rows }: { rows: QrPerformanceRow[] }) {
  const totalScans = rows.reduce((a, r) => a + (r.scans ?? 0), 0);
  const totalLeads = rows.reduce((a, r) => a + (r.leads ?? 0), 0);
  const totalSpend = rows.reduce((a, r) => a + (r.cost_dollars ?? 0), 0);
  const totalBots = rows.reduce((a, r) => a + (r.bot_hits ?? 0), 0);

  const blendedCpl = totalLeads > 0 ? totalSpend / totalLeads : null;
  const blendedRate =
    totalScans > 0 ? Math.round((totalLeads / totalScans) * 1000) / 10 : null;

  return (
    <div className="rounded-xl bg-paper border border-faint overflow-hidden">
      <div className="px-5 py-3 border-b border-faint bg-soft-navy flex items-baseline justify-between gap-3 flex-wrap">
        <h3 className="font-display font-semibold text-sm text-ink">
          QR and print campaigns
          <span className="font-normal text-muted"> &middot; all time</span>
        </h3>
        <p className="text-xs text-muted">
          Scans exclude bots and same-device repeats
          {totalBots > 0 ? ` (${totalBots} bot hits filtered)` : ""}.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="px-5 py-4 text-sm text-muted">
          No QR codes yet. Add one in QR Codes to start measuring print spend.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-faint border-b border-faint">
            <Tile label="Scans" value={totalScans} />
            <Tile label="Leads" value={totalLeads} />
            <Tile
              label="Scan to lead"
              value={blendedRate === null ? "-" : `${blendedRate}%`}
            />
            <Tile
              label="Blended cost per lead"
              value={blendedCpl === null ? "-" : money(blendedCpl)}
              sub={totalSpend > 0 ? `${money(totalSpend)} tracked spend` : "No cost recorded yet"}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-faint">
                  <Th>Placement</Th>
                  <Th align="right">Scans</Th>
                  <Th align="right">Hits</Th>
                  <Th align="right">Leads</Th>
                  <Th align="right">Consults</Th>
                  <Th align="right">To Roofr</Th>
                  <Th align="right">Scan &rarr; lead</Th>
                  <Th align="right">Cost / scan</Th>
                  <Th align="right">Cost / lead</Th>
                  <Th align="right">Last scan</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-faint">
                {rows.map((r) => (
                  <tr key={r.slug} className="hover:bg-soft-navy/40">
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-ink">{r.label}</span>
                        {r.is_active ? null : (
                          <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-800">
                            Off
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-muted">
                        /r/{r.slug} &middot; {r.channel}
                      </span>
                    </td>
                    <Td>{r.scans}</Td>
                    <Td muted>{r.total_hits}</Td>
                    <Td>{r.leads}</Td>
                    <Td muted>{r.consultations}</Td>
                    <Td muted>{r.reached_roofr}</Td>
                    <Td strong>{pct(r.scan_to_lead_pct)}</Td>
                    <Td muted>{money(r.cost_per_scan)}</Td>
                    <Td strong>{money(r.cost_per_lead)}</Td>
                    <Td muted>{shortDate(r.last_scan_at)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Tile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="p-5">
      <p className="text-xs font-semibold text-muted uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-1.5 font-display font-bold text-2xl text-ink tracking-tight tabular-nums">
        {value}
      </p>
      {sub ? <p className="mt-1 text-xs text-muted">{sub}</p> : null}
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-2 ${
        align === "right" ? "text-right" : "text-left"
      } text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  muted,
  strong,
}: {
  children: React.ReactNode;
  muted?: boolean;
  strong?: boolean;
}) {
  const tone = muted ? "text-muted" : "text-ink";
  const weight = strong ? "font-semibold" : "";
  return (
    <td
      className={`px-5 py-2.5 text-sm text-right tabular-nums whitespace-nowrap ${tone} ${weight}`}
    >
      {children}
    </td>
  );
}
