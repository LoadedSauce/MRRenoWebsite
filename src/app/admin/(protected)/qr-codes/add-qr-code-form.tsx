"use client";

import { useState } from "react";
import { addQrCode } from "../../actions";
import { QR_CHANNELS } from "@/lib/supabase/types";

/**
 * Creation form. The slug is only settable here -- once a code is printed the
 * slug is on paper and can never change, so the edit form omits it entirely.
 */
export function AddQrCodeForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState("");

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-paper hover:opacity-90 transition-opacity"
      >
        Add QR code
      </button>
    );
  }

  return (
    <div className="bg-paper rounded-xl border border-faint p-6">
      <h2 className="font-display font-semibold text-base text-ink mb-1">
        Add QR code
      </h2>
      <p className="text-xs text-muted mb-4">
        Create the row first, then generate the printed image pointing at the
        URL shown after you save.
      </p>

      <form
        action={async (fd) => {
          const result = await addQrCode(fd);
          if (result.ok) {
            setOpen(false);
            setError(null);
            setSlug("");
          } else {
            setError(result.error ?? "Something went wrong.");
          }
        }}
        className="space-y-4"
      >
        {error ? (
          <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Slug <span className="text-orange">*</span>
            </label>
            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              placeholder="mgmag"
              pattern="[a-z0-9][a-z0-9\-]{1,30}"
              className="w-full px-3 py-2 border border-faint rounded-md text-sm font-mono"
            />
            <p className="mt-1 text-xs text-muted">
              Permanent. Keep it short - every character adds modules to the
              printed code, and a denser code is harder to scan.
              {slug ? (
                <>
                  {" "}
                  Prints as{" "}
                  <span className="font-mono text-ink">/r/{slug}</span>.
                </>
              ) : null}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Label <span className="text-orange">*</span>
            </label>
            <input
              name="label"
              required
              placeholder="Maple Grove Magazine - 1/3 page"
              className="w-full px-3 py-2 border border-faint rounded-md text-sm"
            />
            <p className="mt-1 text-xs text-muted">
              How this placement is named in Reports.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Channel
            </label>
            <select
              name="channel"
              defaultValue="print"
              className="w-full px-3 py-2 border border-faint rounded-md text-sm"
            >
              {QR_CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Destination
            </label>
            <input
              name="destination_path"
              defaultValue="/"
              placeholder="/magazine"
              className="w-full px-3 py-2 border border-faint rounded-md text-sm font-mono"
            />
            <p className="mt-1 text-xs text-muted">
              A path on this site. Editable later without reprinting.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Source channel
            </label>
            <input
              name="source_channel"
              placeholder="Maple Grove Magazine"
              className="w-full px-3 py-2 border border-faint rounded-md text-sm"
            />
            <p className="mt-1 text-xs text-muted">
              Written onto every lead from this code, and what the Reports
              &ldquo;Leads by source&rdquo; breakdown shows.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Roofr tag
            </label>
            <input
              name="roofr_tag"
              placeholder="MGMAG"
              className="w-full px-3 py-2 border border-faint rounded-md text-sm font-mono uppercase"
            />
            <p className="mt-1 text-xs text-muted">
              Appended to the Roofr job name, e.g. Jane Doe- Kitchen (MGMAG).
            </p>
          </div>
        </div>

        <fieldset className="border border-faint rounded-md p-4">
          <legend className="px-1 text-xs font-semibold text-muted uppercase tracking-wider">
            UTMs
          </legend>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink mb-1">
                Source <span className="text-orange">*</span>
              </label>
              <input
                name="utm_source"
                required
                placeholder="mgmag"
                className="w-full px-2 py-1.5 border border-faint rounded text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1">
                Medium
              </label>
              <input
                name="utm_medium"
                defaultValue="print"
                className="w-full px-2 py-1.5 border border-faint rounded text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1">
                Campaign
              </label>
              <input
                name="utm_campaign"
                placeholder="mgmag_2026"
                className="w-full px-2 py-1.5 border border-faint rounded text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1">
                Content
              </label>
              <input
                name="utm_content"
                placeholder="third_page"
                className="w-full px-2 py-1.5 border border-faint rounded text-sm font-mono"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-faint rounded-md p-4">
          <legend className="px-1 text-xs font-semibold text-muted uppercase tracking-wider">
            Cost and run dates
          </legend>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink mb-1">
                Cost (USD)
              </label>
              <input
                name="cost_dollars"
                inputMode="decimal"
                placeholder="450"
                className="w-full px-2 py-1.5 border border-faint rounded text-sm"
              />
              <p className="mt-1 text-xs text-muted">Drives cost per lead.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1">
                Circulation
              </label>
              <input
                name="quantity"
                inputMode="numeric"
                placeholder="12000"
                className="w-full px-2 py-1.5 border border-faint rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1">
                Run starts
              </label>
              <input
                type="date"
                name="run_starts_on"
                className="w-full px-2 py-1.5 border border-faint rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1">
                Run ends
              </label>
              <input
                type="date"
                name="run_ends_on"
                className="w-full px-2 py-1.5 border border-faint rounded text-sm"
              />
            </div>
          </div>
        </fieldset>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Notes</label>
          <textarea
            name="notes"
            rows={2}
            placeholder="Set cost once the invoice is in."
            className="w-full px-3 py-2 border border-faint rounded-md text-sm resize-y"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-paper hover:opacity-90 transition-opacity"
          >
            Save code
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setError(null);
            }}
            className="rounded-md border border-faint px-4 py-2 text-sm font-semibold text-muted hover:bg-soft-navy transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
