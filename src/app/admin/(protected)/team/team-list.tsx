"use client";

import { useState } from "react";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import type { TeamMember } from "@/lib/supabase/types";
import {
  toggleTeamMember,
  deleteTeamMember,
  updateTeamMember,
  updateTeamMemberOrder,
} from "../../actions";

export function TeamList({ members }: { members: TeamMember[] }) {
  if (members.length === 0) {
    return <p className="text-sm text-muted py-4">No team members yet. Add one above.</p>;
  }
  return (
    <div className="space-y-3">
      {members.map((member) => (
        <TeamMemberRow key={member.id} member={member} />
      ))}
    </div>
  );
}

function TeamMemberRow({ member }: { member: TeamMember }) {
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handlePhotoUpload(file: File): Promise<string> {
    const ext = file.name.split(".").pop();
    const path = `team/${member.id}-${Date.now()}.${ext}`;
    setUploading(true);
    await supabase.storage.from("media").upload(path, file, { upsert: true });
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    setUploading(false);
    return data.publicUrl;
  }

  async function handleDelete() {
    if (!window.confirm(`Remove ${member.name}?`)) return;
    await deleteTeamMember(member.id);
  }

  return (
    <div className="flex items-center gap-4 bg-paper rounded-lg border border-faint p-4">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full overflow-hidden bg-soft-navy shrink-0 flex items-center justify-center">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.name}
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-lg text-muted font-display font-bold">
            {member.name[0]}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <form
            action={async (fd) => {
              await updateTeamMember(member.id, fd);
              setEditing(false);
            }}
            className="flex flex-col gap-2"
          >
            <input
              name="name"
              defaultValue={member.name}
              required
              className="px-2 py-1 border border-faint rounded text-sm w-full"
            />
            <input
              name="role"
              defaultValue={member.role}
              required
              className="px-2 py-1 border border-faint rounded text-sm w-full"
            />
            <input type="hidden" name="photo_url" defaultValue={member.photo_url ?? ""} />
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted">
                Swap photo
                <input
                  type="file"
                  accept="image/*"
                  className="ml-1 text-xs"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await handlePhotoUpload(file);
                    (
                      e.target.form!.elements.namedItem("photo_url") as HTMLInputElement
                    ).value = url;
                  }}
                />
              </label>
              {uploading && <span className="text-xs text-muted">Uploading...</span>}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="text-xs bg-orange text-paper px-3 py-1 rounded"
              >
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
          <>
            <p className="font-display font-semibold text-sm text-ink">{member.name}</p>
            <p className="text-xs text-muted">{member.role}</p>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => toggleTeamMember(member.id, !member.active)}
          className={`text-xs px-2 py-1 rounded ${
            member.active
              ? "bg-green-100 text-green-700"
              : "bg-soft-navy text-muted"
          }`}
        >
          {member.active ? "Live" : "Hidden"}
        </button>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-navy underline"
          >
            Edit
          </button>
        )}
        <button onClick={handleDelete} className="text-xs text-red-600 underline">
          Delete
        </button>
      </div>

      {/* Reorder */}
      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => updateTeamMemberOrder(member.id, member.display_order - 1)}
          className="text-muted hover:text-ink leading-none text-xs"
          aria-label="Move up"
        >
          &#9650;
        </button>
        <button
          onClick={() => updateTeamMemberOrder(member.id, member.display_order + 1)}
          className="text-muted hover:text-ink leading-none text-xs"
          aria-label="Move down"
        >
          &#9660;
        </button>
      </div>
    </div>
  );
}
