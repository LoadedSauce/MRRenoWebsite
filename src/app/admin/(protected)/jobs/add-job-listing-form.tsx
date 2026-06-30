"use client";

import { addJobListing } from "../../actions";

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
