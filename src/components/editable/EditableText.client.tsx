"use client";

import { useState, useTransition, type ReactNode } from "react";
import {
  saveTextBlockDraft,
  revertTextBlockDraft,
} from "@/app/admin/page-content-actions";

interface Props {
  blockKey: string;
  value: string;
  isDirty: boolean;
  multiline: boolean;
  children: ReactNode;
}

/**
 * Client-side edit chrome for a text block. In edit mode:
 *   - Shows the resolved value inline with a dashed amber outline on hover.
 *   - Click opens an inline editor (input or textarea).
 *   - Save writes to draft_content via server action.
 *   - Dirty state (has pending draft) gets a persistent amber ring + revert.
 */
export function EditableTextClient({
  blockKey,
  value,
  isDirty,
  multiline,
  children,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    startTransition(async () => {
      const res = await saveTextBlockDraft(blockKey, draft);
      if (res.ok) {
        setEditing(false);
      } else {
        setError(res.error);
      }
    });
  }

  function revert() {
    setError(null);
    startTransition(async () => {
      const res = await revertTextBlockDraft(blockKey);
      if (res.ok) {
        setEditing(false);
        setDraft(value);
      } else {
        setError(res.error);
      }
    });
  }

  if (editing) {
    return (
      <span className="inline-block relative align-baseline">
        {multiline ? (
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full min-w-[240px] min-h-[80px] p-2 border-2 border-amber-500 rounded bg-paper text-ink text-sm font-sans"
          />
        ) : (
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full min-w-[200px] p-2 border-2 border-amber-500 rounded bg-paper text-ink text-sm font-sans"
          />
        )}
        <span className="flex gap-1 mt-1">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="text-[11px] font-semibold px-2 py-1 rounded bg-navy text-paper disabled:opacity-50"
          >
            {pending ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setDraft(value);
              setError(null);
            }}
            className="text-[11px] font-semibold px-2 py-1 rounded bg-paper text-ink border border-faint"
          >
            Cancel
          </button>
          {isDirty ? (
            <button
              type="button"
              onClick={revert}
              disabled={pending}
              className="text-[11px] font-semibold px-2 py-1 rounded bg-red-600 text-paper disabled:opacity-50"
            >
              Revert
            </button>
          ) : null}
        </span>
        {error ? <span className="block mt-1 text-[11px] text-red-600">{error}</span> : null}
      </span>
    );
  }

  return (
    <span
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setEditing(true);
      }}
      className={`relative cursor-pointer ${
        isDirty
          ? "outline outline-2 outline-amber-500 outline-offset-1 rounded"
          : "hover:outline hover:outline-2 hover:outline-dashed hover:outline-amber-400 hover:outline-offset-1 hover:rounded"
      }`}
      title={`Click to edit: ${blockKey}${isDirty ? " (pending edit)" : ""}`}
    >
      {children}
      {isDirty ? (
        <span
          aria-hidden="true"
          className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-amber-500"
        />
      ) : null}
    </span>
  );
}
