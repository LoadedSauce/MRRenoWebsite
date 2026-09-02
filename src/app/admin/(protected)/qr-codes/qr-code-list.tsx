"use client";

import { useState } from "react";
import type { QrCode } from "@/lib/supabase/types";
import { QR_CHANNELS } from "@/lib/supabase/types";
import { updateQrCode, toggleQrCode, deleteQrCode } from "../../actions";

type Stats = Record<string, { scans: number; leads: number } | undefined>;

export function QrCodeList({
  codes,
  stats,
}: {
  codes: QrCode[];
  stats: Stats;
}) {
  if (codes.length === 0) {
    return (
      <p className="text-sm text-muted py-4">
        No QR codes yet. Add one above, then generate the printed image for the
        URL it gives you.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {codes.map((c) => (
        <QrCodeRow key={c.id} code={c} stat={stats[c.slug]} />
      ))}
    </div>
  );
}

function dollars(cents: number | null): string {
  if (cents === null || cents === undefined) return "";
  return (cents / 100).toFixed(2).replace(/\.00$/, "");
}

function QrCodeRow({
  code: c,
  stat,
}: {
  code: QrCode;
  stat: { scans: number; leads: number } | undefined;
}) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const scanUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/r/${c.slug}`
      : `/r/${c.slug}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(scanUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable; the URL is visible on screen anyway */
    }
  }

  async function handleDelete() {
    const scans = stat?.scans ?? 0;
    const warning =
      scans > 0
        ? `Delete "${c.label}"? This also deletes its ${scans} logged scan${
            scans === 1 ? "" : "s"
          }, permanently. If the printed piece is still out in the world, turn it Off instead so scanners still reach the site.`
        : `Delete "${c.label}"?`;
    if (!window.confirm(warning)) return;
    await deleteQrCode(c.id);
  }

  if (editing) {
    return (
      <div className="bg-paper rounded-lg border border-navy p-4">
        <form
          action={async (fd) => {
            const result = await updateQrCode(c.id, fd);
            if (result.ok) {
              setEditing(false);
              setError(null);
            } else {
              setError(result.error ?? "Something went wrong.");
            }
          }}
          className="space-y-3"
        >
          {error ? (
            <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          ) : null}

          <p className="text-xs text-muted">
            Slug{" "}
            <span className="font-mono text-ink">{c.slug}</span> cannot change -
            it is printed on the piece.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-medium text-ink mb-1">Label</span>
              <input
                name="label"
                defaultValue={c.label}
                required
                className="w-full px-2 py-1.5 border border-faint rounded text-sm"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-ink mb-1">Channel</span>
              <select
                name="channel"
                defaultValue={c.channel}
                className="w-full px-2 py-1.5 border border-faint rounded text-sm"
              >
                {QR_CHANNELS.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
                {QR_CHANNELS.includes(c.channel as (typeof QR_CHANNELS)[number]) ? null : (
                  <option value={c.channel}>{c.channel}</option>
                )}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-ink mb-1">
                Destination
              </span>
              <input
                name="destination_path"
                defaultValue={c.destination_path}
                className="w-full px-2 py-1.5 border border-faint rounded text-sm font-mono"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-ink mb-1">
                Source channel
              </span>
              <input
                name="source_channel"
                defaultValue={c.source_channel ?? ""}
                className="w-full px-2 py-1.5 border border-faint rounded text-sm"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-ink mb-1">
                Roofr tag
              </span>
              <input
                name="roofr_tag"
                defaultValue={c.roofr_tag ?? ""}
                className="w-full px-2 py-1.5 border border-faint rounded text-sm font-mono"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-ink mb-1">
                Cost (USD)
              </span>
              <input
                name="cost_dollars"
                defaultValue={dollars(c.cost_cents)}
                inputMode="decimal"
                className="w-full px-2 py-1.5 border border-faint rounded text-sm"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <label className="block">
              <span className="block text-xs font-medium text-ink mb-1">
                utm_source
              </span>
              <input
                name="utm_source"
                defaultValue={c.utm_source}
                required
                className="w-full px-2 py-1.5 border border-faint rounded text-sm font-mono"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-ink mb-1">
                utm_medium
              </span>
              <input
                name="utm_medium"
                defaultValue={c.utm_medium}
                className="w-full px-2 py-1.5 border border-faint rounded text-sm font-mono"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-ink mb-1">
                utm_campaign
              </span>
              <input
                name="utm_campaign"
                defaultValue={c.utm_campaign ?? ""}
                className="w-full px-2 py-1.5 border border-faint rounded text-sm font-mono"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-ink mb-1">
                utm_content
              </span>
              <input
                name="utm_content"
                defaultValue={c.utm_content ?? ""}
                className="w-full px-2 py-1.5 border border-faint rounded text-sm font-mono"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <label className="block">
              <span className="block text-xs font-medium text-ink mb-1">
                Circulation
              </span>
              <input
                name="quantity"
                defaultValue={c.quantity ?? ""}
                inputMode="numeric"
                className="w-full px-2 py-1.5 border border-faint rounded text-sm"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-ink mb-1">
                Run starts
              </span>
              <input
                type="date"
                name="run_starts_on"
                defaultValue={c.run_starts_on ?? ""}
                className="w-full px-2 py-1.5 border border-faint rounded text-sm"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-ink mb-1">
                Run ends
              </span>
              <input
                type="date"
                name="run_ends_on"
                defaultValue={c.run_ends_on ?? ""}
                className="w-full px-2 py-1.5 border border-faint rounded text-sm"
              />
            </label>
          </div>

          <label className="block">
            <span className="block text-xs font-medium text-ink mb-1">Notes</span>
            <textarea
              name="notes"
              defaultValue={c.notes ?? ""}
              rows={2}
              className="w-full px-2 py-1.5 border border-faint rounded text-sm resize-y"
            />
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-orange px-3 py-1.5 text-sm font-semibold text-paper hover:opacity-90 transition-opacity"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setError(null);
              }}
              className="rounded-md border border-faint px-3 py-1.5 text-sm font-semibold text-muted hover:bg-soft-navy transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-paper rounded-lg border border-faint p-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-display font-semibold text-sm text-ink">{c.label}</p>
            <span className="rounded-full bg-soft-navy px-2 py-0.5 text-[11px] font-medium text-muted">
              {c.channel}
            </span>
            {c.is_active ? null : (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-800">
                Off
              </span>
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <code className="font-mono text-xs text-navy bg-soft-navy px-1.5 py-0.5 rounded">
              /r/{c.slug}
            </code>
            <button
              onClick={handleCopy}
              className="text-xs font-semibold text-navy hover:text-orange transition-colors"
            >
              {copied ? "Copied" : "Copy URL"}
            </button>
            <span className="text-xs text-muted">
              &rarr; <span className="font-mono">{c.destination_path}</span>
            </span>
          </div>

          <p className="mt-1.5 text-xs text-muted">
            {c.source_channel ? `${c.source_channel} · ` : ""}
            {c.utm_source}/{c.utm_medium}
            {c.utm_campaign ? `/${c.utm_campaign}` : ""}
            {c.roofr_tag ? ` · Roofr tag ${c.roofr_tag}` : ""}
            {c.cost_cents !== null ? ` · $${dollars(c.cost_cents)}` : ""}
          </p>

          {c.notes ? (
            <p className="mt-1.5 text-xs text-muted italic">{c.notes}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <p className="text-xs text-muted uppercase tracking-wider font-semibold">
              Scans
            </p>
            <p className="font-display font-bold text-lg text-ink tabular-nums">
              {stat?.scans ?? 0}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted uppercase tracking-wider font-semibold">
              Leads
            </p>
            <p className="font-display font-bold text-lg text-ink tabular-nums">
              {stat?.leads ?? 0}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => setEditing(true)}
              className="text-xs font-semibold text-navy hover:text-orange transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => toggleQrCode(c.id, !c.is_active)}
              className="text-xs font-semibold text-navy hover:text-orange transition-colors"
            >
              {c.is_active ? "Turn off" : "Turn on"}
            </button>
            <button
              onClick={handleDelete}
              className="text-xs font-semibold text-red-700 hover:text-red-900 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
