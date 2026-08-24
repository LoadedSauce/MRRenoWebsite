"use client";

import { useState, useTransition, type ReactNode } from "react";
import {
  savePhotoSlotDraft,
  revertPhotoSlotDraft,
} from "@/app/admin/page-content-actions";

interface PoolItem {
  id: string;
  photo_url: string;
  caption: string | null;
  service: string | null;
}

interface Props {
  slotKey: string;
  isDirty: boolean;
  currentId: string | null;
  pool: PoolItem[];
  children: ReactNode;
}

/**
 * Client-side edit chrome for a photo slot. In edit mode:
 *   - Renders children (the page's normal <Image>) with a hover overlay
 *     showing a "Change photo" button.
 *   - Change opens a modal listing the master pool (all active portfolio
 *     items). Click a card to write it as draft_portfolio_item_id.
 *   - Dirty state gets a persistent amber ring + revert control.
 */
export function EditablePhotoClient({
  slotKey,
  isDirty,
  currentId,
  pool,
  children,
}: Props) {
  const [picking, setPicking] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function pick(id: string) {
    setError(null);
    startTransition(async () => {
      const res = await savePhotoSlotDraft(slotKey, id);
      if (res.ok) setPicking(false);
      else setError(res.error);
    });
  }

  function revert() {
    setError(null);
    startTransition(async () => {
      const res = await revertPhotoSlotDraft(slotKey);
      if (res.ok) setPicking(false);
      else setError(res.error);
    });
  }

  const services = Array.from(
    new Set(pool.map((p) => p.service).filter((s): s is string => !!s))
  ).sort();
  const filtered = filter === "all" ? pool : pool.filter((p) => p.service === filter);

  return (
    <>
      <span
        className={`relative inline-block group ${
          isDirty ? "outline outline-2 outline-amber-500 outline-offset-2 rounded" : ""
        }`}
      >
        {children}
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-navy/60 pointer-events-none">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPicking(true);
            }}
            className="pointer-events-auto text-[11px] font-display font-semibold px-3 py-2 rounded bg-paper text-navy"
          >
            Change photo
          </button>
        </span>
        {isDirty ? (
          <span
            aria-hidden="true"
            className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-amber-500 border border-paper"
          />
        ) : null}
      </span>

      {picking ? (
        <div
          className="fixed inset-0 z-[200] bg-navy/70 flex items-center justify-center p-4"
          onClick={() => setPicking(false)}
        >
          <div
            className="bg-paper rounded-xl max-w-5xl w-full max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-faint">
              <div>
                <h2 className="font-display font-bold text-lg text-ink">Pick a photo</h2>
                <p className="text-xs text-muted mt-0.5">
                  Slot: <code className="font-mono">{slotKey}</code>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPicking(false)}
                className="text-sm text-muted hover:text-ink"
              >
                Close
              </button>
            </div>

            <div className="p-3 border-b border-faint flex flex-wrap gap-2 items-center">
              <span className="text-xs font-semibold text-ink">Filter:</span>
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`text-xs px-2 py-1 rounded ${
                  filter === "all" ? "bg-navy text-paper" : "bg-cream text-ink hover:bg-cream-deep"
                }`}
              >
                All ({pool.length})
              </button>
              {services.map((svc) => (
                <button
                  key={svc}
                  type="button"
                  onClick={() => setFilter(svc)}
                  className={`text-xs px-2 py-1 rounded ${
                    filter === svc ? "bg-navy text-paper" : "bg-cream text-ink hover:bg-cream-deep"
                  }`}
                >
                  {svc}
                </button>
              ))}
              {isDirty ? (
                <button
                  type="button"
                  onClick={revert}
                  disabled={pending}
                  className="ml-auto text-xs px-3 py-1 rounded bg-red-600 text-paper disabled:opacity-50"
                >
                  Revert draft
                </button>
              ) : null}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => pick(p.id)}
                    disabled={pending}
                    className={`relative aspect-square rounded-md overflow-hidden bg-soft-navy border-2 transition disabled:opacity-50 ${
                      p.id === currentId
                        ? "border-amber-500"
                        : "border-transparent hover:border-navy"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.photo_url}
                      alt={p.caption ?? "Portfolio photo"}
                      className="w-full h-full object-cover"
                    />
                    {p.id === currentId ? (
                      <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-paper font-display font-semibold">
                        Selected
                      </span>
                    ) : null}
                    {p.service ? (
                      <span className="absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-navy/85 text-paper font-display">
                        {p.service}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
              {filtered.length === 0 ? (
                <p className="text-sm text-muted text-center py-8">No photos in this filter.</p>
              ) : null}
            </div>

            {error ? (
              <div className="p-3 border-t border-faint bg-red-50 text-red-700 text-sm">{error}</div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
