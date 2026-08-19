"use client";

import { useState, useTransition } from "react";
import type { JobListing } from "@/lib/supabase/types";
import { toggleJobListing, deleteJobListing, updateJobListing } from "../../actions";

type FilterMode = "active" | "all";

export function JobList({ jobs }: { jobs: JobListing[] }) {
  const [mode, setMode] = useState<FilterMode>("active");

  if (jobs.length === 0) {
    return <p className="text-sm text-muted py-4">No listings yet. Add one above.</p>;
  }

  const visible = mode === "active" ? jobs.filter((j) => j.active) : jobs;
  const hiddenTemplateCount =
    mode === "active" ? jobs.filter((j) => !j.active).length : 0;

  return (
    <div>
      {/* Filter switch */}
      <div className="flex items-center justify-between bg-paper rounded-lg border border-faint p-3 mb-4">
        <div className="text-sm text-ink">
          <span className="font-medium">Showing:</span>{" "}
          <span className="text-muted">
            {mode === "active" ? "Active listings only" : "Active + saved templates"}
          </span>
        </div>
        <div
          role="group"
          aria-label="Filter listings"
          className="inline-flex rounded-md border border-faint overflow-hidden text-xs"
        >
          <button
            type="button"
            onClick={() => setMode("active")}
            aria-pressed={mode === "active"}
            className={`px-3 py-1.5 ${
              mode === "active"
                ? "bg-orange text-paper"
                : "bg-paper text-muted hover:text-ink"
            }`}
          >
            Active only
          </button>
          <button
            type="button"
            onClick={() => setMode("all")}
            aria-pressed={mode === "all"}
            className={`px-3 py-1.5 ${
              mode === "all"
                ? "bg-orange text-paper"
                : "bg-paper text-muted hover:text-ink"
            }`}
          >
            Show templates
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-muted py-4">
          No active listings. Switch to <span className="font-medium">Show templates</span> to see saved templates and turn one back on.
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((job) => (
            <JobRow key={job.id} job={job} />
          ))}
        </div>
      )}

      {mode === "active" && hiddenTemplateCount > 0 && (
        <p className="text-xs text-muted mt-3">
          {hiddenTemplateCount} saved{" "}
          {hiddenTemplateCount === 1 ? "template" : "templates"} hidden. Switch to{" "}
          <button
            type="button"
            onClick={() => setMode("all")}
            className="text-navy underline"
          >
            Show templates
          </button>{" "}
          to view.
        </p>
      )}
    </div>
  );
}

function JobRow({ job }: { job: JobListing }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    if (!window.confirm(`Delete "${job.title}"?`)) return;
    await deleteJobListing(job.id);
  }

  return (
    <div
      className={`bg-paper rounded-lg border p-4 ${
        job.active ? "border-faint" : "border-dashed border-muted/40"
      }`}
    >
      {editing ? (
        <form
          action={async (fd) => {
            await updateJobListing(job.id, fd);
            setEditing(false);
          }}
          className="flex flex-col gap-3"
        >
          <input
            name="title"
            defaultValue={job.title}
            required
            className="px-2 py-1 border border-faint rounded text-sm w-full"
          />
          <textarea
            name="description"
            defaultValue={job.description}
            required
            rows={3}
            className="px-2 py-1 border border-faint rounded text-sm w-full resize-y"
          />
          <div className="flex gap-2">
            <button type="submit" className="text-xs bg-orange text-paper px-3 py-1 rounded">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-xs text-muted px-3 py-1 rounded border border-faint"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`font-display font-semibold text-sm ${job.active ? "text-ink" : "text-muted"}`}>
                {job.title}
              </p>
              {!job.active && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-soft-navy text-muted">
                  Template
                </span>
              )}
            </div>
            <p className="text-xs text-muted mt-1 line-clamp-2">{job.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={job.active}
              disabled={isPending}
              onClick={() =>
                startTransition(() => {
                  toggleJobListing(job.id, !job.active);
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-1 ${
                job.active ? "bg-orange" : "bg-soft-navy"
              }`}
              title={job.active ? "Active. Click to save as template." : "Template. Click to activate."}
            >
              <span className="sr-only">
                {job.active ? "Deactivate listing" : "Activate listing"}
              </span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-paper transition-transform ${
                  job.active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <button onClick={() => setEditing(true)} className="text-xs text-navy underline">
              Edit
            </button>
            <button onClick={handleDelete} className="text-xs text-red-600 underline">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
