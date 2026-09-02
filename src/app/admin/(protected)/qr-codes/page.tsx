import { createServiceRoleClient } from "@/lib/supabase/server";
import type { QrCode, QrPerformanceRow } from "@/lib/supabase/types";
import { QrCodeList } from "./qr-code-list";
import { AddQrCodeForm } from "./add-qr-code-form";

export const dynamic = "force-dynamic";

/**
 * INT-004 QR registry.
 *
 * The reason this screen exists: a printed code cannot be changed once it is
 * in a magazine, so the code encodes /r/<slug> and everything it points at
 * lives here, editable forever. Retargeting a live print run is a text edit
 * on this page, not a reprint.
 */
export default async function AdminQrCodesPage() {
  const supabase = createServiceRoleClient();

  const [codesRes, perfRes] = await Promise.all([
    supabase.from("qr_codes").select().order("created_at", { ascending: false }),
    supabase.from("qr_performance").select("slug,scans,leads"),
  ]);

  const codes = (codesRes.data as QrCode[] | null) ?? [];
  const perf = (perfRes.data as Pick<QrPerformanceRow, "slug" | "scans" | "leads">[] | null) ?? [];

  const stats = Object.fromEntries(
    perf.map((p) => [p.slug, { scans: p.scans, leads: p.leads }])
  );

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-display font-bold text-2xl text-ink tracking-tight">
        QR codes
      </h1>
      <p className="mt-1 text-sm text-muted max-w-2xl">
        One row per printed code. The printed image points at{" "}
        <code className="font-mono text-xs bg-soft-navy px-1 py-0.5 rounded">
          /r/&lt;slug&gt;
        </code>
        , which logs the scan and forwards to the destination below. Because the
        destination lives here and not in the printed code, you can repoint a
        live campaign at any time without reprinting anything.
      </p>

      <div className="mt-8">
        <AddQrCodeForm />
      </div>

      <div className="mt-8">
        <QrCodeList codes={codes} stats={stats} />
      </div>
    </div>
  );
}
