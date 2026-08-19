"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import {
  TEAM_SECTIONS,
  type TeamMember,
  type TeamSection,
} from "@/lib/supabase/types";
import {
  toggleTeamMember,
  deleteTeamMember,
  updateTeamMember,
  updateTeamMemberOrder,
  updateTeamMemberSection,
} from "../../actions";

export function TeamList({
  members,
  section,
}: {
  members: TeamMember[];
  section: TeamSection;
}) {
  if (members.length === 0) {
    return (
      <p className="text-sm text-muted py-2">
        No members in this section yet. Add one above and pick{" "}
        <span className="font-medium text-ink">{section}</span> from the section dropdown.
      </p>
    );
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
  const [, startTransition] = useTransition();

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
            <select
              name="section"
              defaultValue={member.section}
              className="px-2 py-1 border border-faint rounded text-sm w-full bg-paper"
            >
              {TEAM_SECTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              type="hidden"
              name="photo_url"
              defaultValue={member.photo_url ?? ""}
            />
            <PhotoPickerButton
              uploading={uploading}
              currentUrl={member.photo_url ?? null}
              label={member.photo_url ? "Replace photo" : "Upload photo"}
              onFile={async (file, formEl) => {
                const url = await handlePhotoUpload(file);
                (
                  formEl.elements.namedItem("photo_url") as HTMLInputElement
                ).value = url;
              }}
            />
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

      {/* Section quick-move (visible when not editing) */}
      {!editing && (
        <div className="hidden sm:block shrink-0">
          <label className="sr-only" htmlFor={`section-${member.id}`}>
            Section
          </label>
          <select
            id={`section-${member.id}`}
            value={member.section}
            onChange={(e) =>
              startTransition(() => {
                updateTeamMemberSection(member.id, e.target.value as TeamSection);
              })
            }
            className="text-xs px-2 py-1 border border-faint rounded bg-paper text-ink max-w-[10rem] truncate"
            aria-label={`Move ${member.name} to a different section`}
            title="Move to another section"
          >
            {TEAM_SECTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

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

      {/* Reorder within section */}
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

// ---------------------------------------------------------------------------
// PhotoPickerButton
// A big, obvious button that opens the native file picker. Replaces the tiny
// native <input type="file"> control which is easy to miss. Shows filename
// after selection so the admin knows the upload started.
// ---------------------------------------------------------------------------
function PhotoPickerButton({
  uploading,
  currentUrl,
  label,
  onFile,
}: {
  uploading: boolean;
  currentUrl: string | null;
  label: string;
  onFile: (file: File, formEl: HTMLFormElement) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-2 bg-navy hover:bg-navy-deep disabled:opacity-60 text-paper font-display font-semibold text-xs px-4 py-2 rounded-md transition-colors"
      >
        <span aria-hidden="true" className="font-bold">+</span>
        {uploading ? "Uploading..." : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setFilename(file.name);
          const form = e.target.form;
          if (!form) return;
          await onFile(file, form);
        }}
      />
      {filename && !uploading && (
        <span className="text-xs text-muted truncate max-w-[16rem]">
          {filename}
        </span>
      )}
      {!filename && currentUrl && !uploading && (
        <span className="text-xs text-muted">Photo on file</span>
      )}
    </div>
  );
}
