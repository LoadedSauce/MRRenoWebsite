"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  publishAllDrafts,
  revertTextBlockDraft,
  revertPhotoSlotDraft,
  publishOneTextBlock,
  publishOnePhotoSlot,
} from "@/app/admin/page-content-actions";

interface Drafts {
  textBlocks: Array<{ block_key: string; live: string; draft: string; updated_at: string }>;
  photoSlots: Array<{
    slot_key: string;
    live: { photo_url: string; alt: string | null } | null;
    draft: { photo_url: string; alt: string | null } | null;
    updated_at: string;
  }>;
}

interface Props {
  drafts: Drafts;
  currentPath: string;
}

/**
 * The persistent edit-mode bar. Bottom-fixed, admin-only. Shows total
 * pending drafts, expands to a tray listing every pending draft, and
 * provides Publish (all), publish/revert per row, and Exit edit mode.
 */
export function EditModeOverlayClient({ drafts, currentPath }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const total = drafts.textBlocks.length + drafts.photoSlots.length;

  const exitHref = (() => {
    // Strip ?edit=1 (and only that) from currentPath.
    const [path, query] = currentPath.split("?");
    if (!query) return path;
    const filtered = query
      .split("&")
      .filter((kv) => kv !== "edit=1" && !kv.startsWith("edit=1&"))
      .join("&");
    return filtered ? `${path}?${filtered}` : path;
  })();

  function publishAll() {
    setMsg(null);
    startTransition(async () => {
      const res = await publishAllDrafts();
      if (res.ok) {
        setMsg(`Published ${res.textPublished} text + ${res.photoPublished} photos.`);
      } else {
        setMsg(`Publish failed: ${res.error}`);
      }
    });
  }

  function revertText(key: string) {
    startTransition(async () => {
      await revertTextBlockDraft(key);
    });
  }

  function revertPhoto(key: string) {
    startTransition(async () => {
      await revertPhotoSlotDraft(key);
    });
  }

  function publishText(key: string) {
    startTransition(async () => {
      await publishOneTextBlock(key);
    });
  }

  function publishPhoto(key: string) {
    startTransition(async () => {
      await publishOnePhotoSlot(key);
    });
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[150] font-sans">
      {expanded ? (
        <div className="bg-paper border-t-2 border-amber-500 max-h-[60vh] overflow-y-auto">
          <div className="max-w-6xl mx-auto p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-lg text-ink">Pending edits</h2>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="text-xs text-muted hover:text-ink"
              >
                Collapse
              </button>
            </div>

            {total === 0 ? (
              <p className="text-sm text-muted">No pending edits. All content is live.</p>
            ) : (
              <>
                {drafts.textBlocks.length > 0 ? (
                  <section className="mb-4">
                    <h3 className="font-display font-semibold text-sm text-ink mb-2">
                      Text ({drafts.textBlocks.length})
                    </h3>
                    <ul className="space-y-2">
                      {drafts.textBlocks.map((row) => (
                        <li
                          key={row.block_key}
                          className="border border-faint rounded p-3 bg-cream/40"
                        >
                          <p className="text-[11px] font-mono text-muted mb-1">{row.block_key}</p>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <p className="text-[10px] font-semibold text-muted uppercase mb-0.5">Live</p>
                              <p className="text-ink whitespace-pre-wrap">{row.live || <em>(empty)</em>}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold text-amber-700 uppercase mb-0.5">Draft</p>
                              <p className="text-ink whitespace-pre-wrap">{row.draft || <em>(empty)</em>}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => publishText(row.block_key)}
                              disabled={pending}
                              className="text-[11px] px-2 py-1 rounded bg-navy text-paper font-semibold disabled:opacity-50"
                            >
                              Publish this
                            </button>
                            <button
                              type="button"
                              onClick={() => revertText(row.block_key)}
                              disabled={pending}
                              className="text-[11px] px-2 py-1 rounded bg-red-600 text-paper font-semibold disabled:opacity-50"
                            >
                              Revert
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {drafts.photoSlots.length > 0 ? (
                  <section>
                    <h3 className="font-display font-semibold text-sm text-ink mb-2">
                      Photos ({drafts.photoSlots.length})
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {drafts.photoSlots.map((row) => (
                        <li
                          key={row.slot_key}
                          className="border border-faint rounded p-3 bg-cream/40"
                        >
                          <p className="text-[11px] font-mono text-muted mb-2">{row.slot_key}</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-[10px] font-semibold text-muted uppercase mb-0.5">Live</p>
                              {row.live ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={row.live.photo_url}
                                  alt=""
                                  className="w-full aspect-square object-cover rounded"
                                />
                              ) : (
                                <div className="w-full aspect-square rounded bg-soft-navy/40 flex items-center justify-center text-xs text-muted">
                                  (fallback)
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold text-amber-700 uppercase mb-0.5">Draft</p>
                              {row.draft ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={row.draft.photo_url}
                                  alt=""
                                  className="w-full aspect-square object-cover rounded"
                                />
                              ) : (
                                <div className="w-full aspect-square rounded bg-soft-navy/40 flex items-center justify-center text-xs text-muted">
                                  (clear)
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => publishPhoto(row.slot_key)}
                              disabled={pending}
                              className="text-[11px] px-2 py-1 rounded bg-navy text-paper font-semibold disabled:opacity-50"
                            >
                              Publish this
                            </button>
                            <button
                              type="button"
                              onClick={() => revertPhoto(row.slot_key)}
                              disabled={pending}
                              className="text-[11px] px-2 py-1 rounded bg-red-600 text-paper font-semibold disabled:opacity-50"
                            >
                              Revert
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </>
            )}
          </div>
        </div>
      ) : null}

      <div className="bg-navy text-paper border-t-2 border-amber-500 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" />
            <span className="font-display font-semibold text-sm">Edit mode</span>
          </span>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-xs px-3 py-1.5 rounded bg-paper/10 hover:bg-paper/20 border border-paper/30"
          >
            {total} pending {total === 1 ? "edit" : "edits"}
            <span className="ml-1" aria-hidden="true">{expanded ? "▲" : "▼"}</span>
          </button>
          {msg ? <span className="text-xs text-amber-200">{msg}</span> : null}
          <button
            type="button"
            onClick={publishAll}
            disabled={pending || total === 0}
            className="ml-auto text-sm px-4 py-2 rounded bg-orange text-ink font-display font-semibold disabled:opacity-50"
          >
            {pending ? "Working..." : "Approve edits and publish"}
          </button>
          <Link
            href={exitHref}
            className="text-xs px-3 py-1.5 rounded bg-paper/10 hover:bg-paper/20 border border-paper/30"
          >
            Exit edit mode
          </Link>
        </div>
      </div>
    </div>
  );
}
