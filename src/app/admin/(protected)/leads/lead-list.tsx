"use client";

import { useMemo, useState } from "react";
import { LEAD_STATUSES, type Lead } from "@/lib/supabase/types";
import { updateLeadStatus, markLeadSyncedToRoofr } from "../../actions";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-navy text-paper",
  contacted: "bg-orange text-paper",
  qualified: "bg-green-700 text-paper",
  dead: "bg-soft-navy text-muted",
};

function fullName(l: Lead) {
  const n = [l.first_name, l.last_name].filter(Boolean).join(" ").trim();
  return n.length > 0 ? n : "(no name given)";
}

function address(l: Lead) {
  const line = [l.street_address, l.city, l.state].filter(Boolean).join(", ");
  return [line, l.zip].filter(Boolean).join(" ").trim();
}

function when(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function minutesAgo(iso: string) {
  return (Date.now() - new Date(iso).getTime()) / 60000;
}

function Copy({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* clipboard unavailable; the value is on screen anyway */
        }
      }}
      className="text-[11px] font-semibold text-navy hover:text-orange transition-colors"
      aria-label={`Copy ${label}`}
    >
      {done ? "Copied" : "Copy"}
    </button>
  );
}

type Filter = "all" | "stuck" | "new";

export function LeadList({
  leads,
  signedPhotos,
  graceMinutes,
}: {
  leads: Lead[];
  signedPhotos: Record<string, string>;
  graceMinutes: number;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    let list = leads;
    if (filter === "stuck") {
      list = list.filter(
        (l) => !l.synced_to_roofr && minutesAgo(l.created_at) > graceMinutes
      );
    } else if (filter === "new") {
      list = list.filter((l) => l.status === "new");
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((l) =>
        [
          fullName(l),
          l.email,
          l.phone,
          l.city,
          l.zip,
          l.project_type,
          l.source_channel,
        ]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      );
    }
    return list;
  }, [leads, filter, query, graceMinutes]);

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-faint bg-paper p-8 text-center">
        <p className="font-display font-semibold text-sm text-ink">
          No leads yet
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted leading-relaxed">
          Every enquiry from the consultation and contact forms will appear here
          the moment it is submitted, whether or not Zapier is working.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(
          [
            ["all", `All (${leads.length})`],
            ["new", "New only"],
            ["stuck", "Not in Roofr"],
          ] as [Filter, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === key
                ? "bg-navy text-paper"
                : "border border-faint bg-paper text-muted hover:bg-soft-navy"
            }`}
          >
            {label}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, phone, city, ZIP"
          className="ml-auto w-full sm:w-72 rounded-md border border-faint px-3 py-1.5 text-sm"
        />
      </div>

      {shown.length === 0 ? (
        <p className="py-6 text-sm text-muted">No leads match that filter.</p>
      ) : (
        <div className="space-y-3">
          {shown.map((l) => (
            <LeadRow
              key={l.id}
              lead={l}
              signedPhotos={signedPhotos}
              graceMinutes={graceMinutes}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LeadRow({
  lead: l,
  signedPhotos,
  graceMinutes,
}: {
  lead: Lead;
  signedPhotos: Record<string, string>;
  graceMinutes: number;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const stuck = !l.synced_to_roofr && minutesAgo(l.created_at) > graceMinutes;
  const pending = !l.synced_to_roofr && !stuck;
  const photos = (l.photo_urls ?? []).map((p) =>
    p.startsWith("http") ? p : signedPhotos[p]
  ).filter(Boolean) as string[];

  return (
    <div
      className={`rounded-lg border bg-paper p-4 ${
        stuck ? "border-red-300" : "border-faint"
      }`}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-display font-semibold text-sm text-ink">
              {fullName(l)}
            </p>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                STATUS_STYLES[l.status] ?? "bg-soft-navy text-muted"
              }`}
            >
              {l.status}
            </span>
            <span className="rounded-full bg-soft-navy px-2 py-0.5 text-[10px] font-medium text-muted">
              {l.form_type}
            </span>
            {stuck ? (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-800">
                Not in Roofr
              </span>
            ) : pending ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                Syncing
              </span>
            ) : (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-900">
                In Roofr
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span>{when(l.created_at)}</span>
            {l.phone ? (
              <span className="flex items-center gap-1.5">
                <a href={`tel:${l.phone}`} className="text-navy hover:text-orange">
                  {l.phone}
                </a>
                <Copy value={l.phone} label="phone" />
              </span>
            ) : null}
            {l.email ? (
              <span className="flex items-center gap-1.5">
                <a href={`mailto:${l.email}`} className="text-navy hover:text-orange">
                  {l.email}
                </a>
                <Copy value={l.email} label="email" />
              </span>
            ) : null}
            {l.project_type ? <span>&middot; {l.project_type}</span> : null}
          </div>

          {address(l) ? (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
              {address(l)} <Copy value={address(l)} label="address" />
            </p>
          ) : null}

          <p className="mt-1 text-[11px] text-muted">
            {l.source_channel ?? "Website"}
            {l.qr_code_slug ? ` · QR /r/${l.qr_code_slug}` : ""}
            {l.utm_campaign ? ` · ${l.utm_campaign}` : ""}
            {photos.length > 0
              ? ` · ${photos.length} photo${photos.length === 1 ? "" : "s"}`
              : ""}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <select
            value={l.status}
            disabled={busy}
            onChange={async (e) => {
              setBusy(true);
              await updateLeadStatus(l.id, e.target.value);
              setBusy(false);
            }}
            className="rounded border border-faint px-2 py-1 text-xs"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={() => setOpen((v) => !v)}
            className="text-xs font-semibold text-navy hover:text-orange transition-colors"
          >
            {open ? "Hide details" : "Details"}
          </button>

          {!l.synced_to_roofr ? (
            <button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await markLeadSyncedToRoofr(l.id, true);
                setBusy(false);
              }}
              className="rounded-md bg-orange px-2.5 py-1 text-[11px] font-semibold text-paper hover:opacity-90 disabled:opacity-50"
            >
              Mark entered in Roofr
            </button>
          ) : (
            <button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await markLeadSyncedToRoofr(l.id, false);
                setBusy(false);
              }}
              className="text-[11px] font-semibold text-muted hover:text-orange"
            >
              Undo
            </button>
          )}
        </div>
      </div>

      {open ? (
        <div className="mt-4 border-t border-faint pt-4">
          {l.project_details ? (
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                What they said
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-ink leading-relaxed">
                {l.project_details}
              </p>
            </div>
          ) : null}

          {photos.length > 0 ? (
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Photos
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {photos.map((src, i) => (
                  <a
                    key={src}
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-24 w-24 overflow-hidden rounded border border-faint"
                  >
                    {/* Signed URLs from a private bucket and short-lived, so a
                        plain img rather than next/image, which would try to
                        cache and optimise them. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Lead photo ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-3">
            <Detail label="Preferred contact" value={l.preferred_contact} />
            <Detail label="Source channel" value={l.source_channel} />
            <Detail label="Campaign" value={l.source_campaign ?? l.utm_campaign} />
            <Detail label="utm_source" value={l.utm_source} />
            <Detail label="utm_medium" value={l.utm_medium} />
            <Detail label="QR code" value={l.qr_code_slug ? `/r/${l.qr_code_slug}` : null} />
            <Detail label="Google click id" value={l.gclid} />
            <Detail label="Meta click id" value={l.fbclid} />
            <Detail
              label="Roofr"
              value={
                l.synced_to_roofr
                  ? `Synced ${l.roofr_synced_at ? when(l.roofr_synced_at) : ""}`
                  : "Not synced"
              }
            />
          </dl>

          {l.landing_url ? (
            <p className="mt-3 break-all text-[11px] text-muted">
              Landed on:{" "}
              <span className="font-mono text-ink">{l.landing_url}</span>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </dt>
      <dd className="mt-0.5 text-ink break-words">{value || "—"}</dd>
    </div>
  );
}
