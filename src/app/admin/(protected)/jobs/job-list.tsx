"use client";

import { useState } from "react";
import type { JobListing } from "@/lib/supabase/types";
import { toggleJobListing, deleteJobListing, updateJobListing } from "../../actions";

export function JobList({ jobs }: { jobs: JobListing[] }) {
  if (jobs.length === 0) {
    return <p className="text-sm text-muted py-4">No listings yet. Add one above.</p>;
  }
  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <JobRow key={job.id} job={job} />
      ))}
    </div>
  );
}

function JobRow({ job }: { job: JobListing }) {
  const [editing, setEditing] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete "${job.title}"?`)) return;
    await deleteJobListing(job.id);
  }

  return (
    <div className="bg-paper rounded-lg border border-faint p-4">
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
            <p className="font-display font-semibold text-sm text-ink">{job.title}</p>
            <p className="text-xs text-muted mt-1 line-clamp-2">{job.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleJobListing(job.id, !job.active)}
              className={`text-xs px-2 py-1 rounded ${
                job.active ? "bg-green-100 text-green-700" : "bg-soft-navy text-muted"
              }`}
            >
              {job.active ? "Active" : "Hidden"}
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
