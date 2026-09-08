"use client";

import { addJobListing } from "../../actions";
import { JOB_SECTIONS } from "@/lib/supabase/types";

export function AddJobListingForm() {
  return (
    <div className="bg-paper rounded-xl border border-faint p-6">
      <h2 className="font-display font-semibold text-base text-ink mb-4">Add listing</h2>
      <form action={addJobListing} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Title</label>
          <input
            name="title"
            required
            placeholder="Lead Carpenter"
            className="w-full px-3 py-2 border border-faint rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Full-time position in Maple Grove. Experience with finish carpentry required..."
            className="w-full px-3 py-2 border border-faint rounded-md text-sm resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Show under
          </label>
          <select
            name="section"
            defaultValue="Crew"
            className="w-full px-3 py-2 border border-faint rounded-md text-sm"
          >
            {JOB_SECTIONS.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted">
            Which section of the Team page this opening&rsquo;s hiring card
            appears in.
          </p>
        </div>
        <button
          type="submit"
          className="bg-orange hover:opacity-90 text-paper font-display font-semibold text-sm px-5 py-2.5 rounded-md transition-colors"
        >
          Add listing
        </button>
      </form>
    </div>
  );
}
