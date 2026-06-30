"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { addTeamMember } from "../../actions";

export function AddTeamMemberForm() {
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handlePhotoUpload(file: File) {
    const ext = file.name.split(".").pop();
    const path = `team/new-${Date.now()}.${ext}`;
    setUploading(true);
    await supabase.storage.from("media").upload(path, file);
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    setPhotoUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="bg-paper rounded-xl border border-faint p-6">
      <h2 className="font-display font-semibold text-base text-ink mb-4">Add team member</h2>
      <form action={addTeamMember} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Name</label>
          <input
            name="name"
            required
            placeholder="Jane Smith"
            className="w-full px-3 py-2 border border-faint rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Role</label>
          <input
            name="role"
            required
            placeholder="Project Manager"
            className="w-full px-3 py-2 border border-faint rounded-md text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-ink mb-1">
            Photo (optional -- max 2MB, web-ready)
          </label>
          <input
            type="file"
            accept="image/*"
            className="text-sm text-muted"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handlePhotoUpload(f);
            }}
          />
          {uploading && <p className="text-xs text-muted mt-1">Uploading...</p>}
          <input type="hidden" name="photo_url" value={photoUrl} />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="bg-orange hover:opacity-90 text-paper font-display font-semibold text-sm px-5 py-2.5 rounded-md transition-colors"
          >
            Add member
          </button>
        </div>
      </form>
    </div>
  );
}
