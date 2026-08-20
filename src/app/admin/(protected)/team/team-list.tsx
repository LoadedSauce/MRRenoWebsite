"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  TEAM_SECTIONS,
  type TeamMember,
  type TeamSection,
} from "@/lib/supabase/types";
import {
  toggleTeamMember,
  deleteTeamMember,
  updateTeamMember,
  reorderTeamMembers,
} from "../../actions";

// ---------------------------------------------------------------------------
// TeamBoard
// Top-level component that renders all 4 sections and wraps them in a single
// DndContext so members can be dragged between sections. Optimistic UI: local
// state updates immediately on drop; the server action is fire-and-forget.
// ---------------------------------------------------------------------------
type Board = Record<TeamSection, TeamMember[]>;

function groupBySection(rows: TeamMember[]): Board {
  const board: Board = {
    "Owner": [],
    "Customer Service, Production & Coordination": [],
    "Sales": [],
    "Crew": [],
  };
  for (const m of rows) {
    const key = (TEAM_SECTIONS as readonly string[]).includes(m.section)
      ? (m.section as TeamSection)
      : "Crew";
    board[key].push(m);
  }
  // Preserve incoming display_order within each section
  for (const s of TEAM_SECTIONS) {
    board[s].sort((a, b) => a.display_order - b.display_order);
  }
  return board;
}

function findSectionOf(board: Board, memberId: string): TeamSection | null {
  for (const s of TEAM_SECTIONS) {
    if (board[s].some((m) => m.id === memberId)) return s;
  }
  return null;
}

export function TeamBoard({ members }: { members: TeamMember[] }) {
  const [board, setBoard] = useState<Board>(() => groupBySection(members));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 }, // avoid firing on plain clicks
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeMember = useMemo(() => {
    if (!activeId) return null;
    for (const s of TEAM_SECTIONS) {
      const hit = board[s].find((m) => m.id === activeId);
      if (hit) return hit;
    }
    return null;
  }, [activeId, board]);

  function persist(next: Board) {
    // Build a dense-renumbered update list per section
    const updates: {
      id: string;
      section: TeamSection;
      display_order: number;
    }[] = [];
    for (const s of TEAM_SECTIONS) {
      next[s].forEach((m, i) => {
        if (m.section !== s || m.display_order !== i) {
          updates.push({ id: m.id, section: s, display_order: i });
        }
      });
    }
    if (updates.length === 0) return;
    startTransition(() => {
      reorderTeamMembers(updates);
    });
  }

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function handleDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;
    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);
    if (activeIdStr === overIdStr) return;

    setBoard((prev) => {
      const from = findSectionOf(prev, activeIdStr);
      // Resolve target section: either a section container id ("section:Owner")
      // or another member id (drop before/after a peer).
      let to: TeamSection | null = null;
      if (overIdStr.startsWith("section:")) {
        const raw = overIdStr.slice("section:".length);
        if ((TEAM_SECTIONS as readonly string[]).includes(raw)) {
          to = raw as TeamSection;
        }
      } else {
        to = findSectionOf(prev, overIdStr);
      }
      if (!from || !to || from === to) return prev;

      // Move the item from `from` to the end of `to` for now; final index is
      // computed on drop end. This gives immediate visual feedback across
      // sections while dragging.
      const moving = prev[from].find((m) => m.id === activeIdStr);
      if (!moving) return prev;
      const nextFrom = prev[from].filter((m) => m.id !== activeIdStr);
      const nextTo = [...prev[to], { ...moving, section: to }];
      return { ...prev, [from]: nextFrom, [to]: nextTo };
    });
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    setBoard((prev) => {
      const section = findSectionOf(prev, activeIdStr);
      if (!section) return prev;

      let next = prev;
      if (!overIdStr.startsWith("section:") && overIdStr !== activeIdStr) {
        // Reorder within the current section (which may already be the
        // destination section after handleDragOver moved it).
        const targetSection = findSectionOf(prev, overIdStr);
        if (targetSection && targetSection === section) {
          const oldIndex = prev[section].findIndex((m) => m.id === activeIdStr);
          const newIndex = prev[section].findIndex((m) => m.id === overIdStr);
          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            next = {
              ...prev,
              [section]: arrayMove(prev[section], oldIndex, newIndex),
            };
          }
        }
      }

      persist(next);
      return next;
    });
  }

  // Move a member up or down by one slot within its section (keyboard/arrow-
  // button fallback used by the up/down chevrons on each row).
  function bumpMember(id: string, delta: -1 | 1) {
    setBoard((prev) => {
      const section = findSectionOf(prev, id);
      if (!section) return prev;
      const idx = prev[section].findIndex((m) => m.id === id);
      const newIdx = idx + delta;
      if (idx === -1 || newIdx < 0 || newIdx >= prev[section].length) {
        return prev;
      }
      const next = {
        ...prev,
        [section]: arrayMove(prev[section], idx, newIdx),
      };
      persist(next);
      return next;
    });
  }

  // Move a member to another section via the dropdown fallback.
  function moveMember(id: string, target: TeamSection) {
    setBoard((prev) => {
      const from = findSectionOf(prev, id);
      if (!from || from === target) return prev;
      const moving = prev[from].find((m) => m.id === id);
      if (!moving) return prev;
      const next = {
        ...prev,
        [from]: prev[from].filter((m) => m.id !== id),
        [target]: [...prev[target], { ...moving, section: target }],
      };
      persist(next);
      return next;
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="space-y-10">
        {TEAM_SECTIONS.map((section) => (
          <SectionColumn
            key={section}
            section={section}
            members={board[section]}
            onBump={bumpMember}
            onMove={moveMember}
          />
        ))}
      </div>

      <DragOverlay>
        {activeMember ? (
          <div className="bg-paper rounded-lg border border-navy shadow-lg p-4 flex items-center gap-4 opacity-95">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-soft-navy shrink-0 flex items-center justify-center">
              {activeMember.photo_url ? (
                <Image
                  src={activeMember.photo_url}
                  alt={activeMember.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-lg text-muted font-display font-bold">
                  {activeMember.name[0]}
                </span>
              )}
            </div>
            <div>
              <p className="font-display font-semibold text-sm text-ink">
                {activeMember.name}
              </p>
              <p className="text-xs text-muted">{activeMember.role}</p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// ---------------------------------------------------------------------------
// SectionColumn
// Renders one section header + its droppable sortable list of members. Every
// section registers a container id "section:<name>" so users can drop into an
// empty section.
// ---------------------------------------------------------------------------
function SectionColumn({
  section,
  members,
  onBump,
  onMove,
}: {
  section: TeamSection;
  members: TeamMember[];
  onBump: (id: string, delta: -1 | 1) => void;
  onMove: (id: string, target: TeamSection) => void;
}) {
  const memberIds = members.map((m) => m.id);
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `section:${section}`,
    data: { type: "section", section },
  });

  return (
    <section>
      <div className="flex items-baseline justify-between border-b border-faint pb-2 mb-4">
        <h2 className="font-display font-semibold text-lg text-navy">
          {section}
        </h2>
        <span className="text-xs text-muted">
          {members.length} {members.length === 1 ? "member" : "members"}
        </span>
      </div>
      <SortableContext items={memberIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setDroppableRef}
          className={`space-y-3 min-h-[4rem] rounded-lg transition-colors ${
            isOver ? "bg-soft-orange/20 outline outline-2 outline-orange/40" : ""
          }`}
        >
          {members.length === 0 ? (
            <p className="text-sm text-muted py-4 px-2">
              No members in this section yet. Drag one here, or use the section
              dropdown on any card.
            </p>
          ) : (
            members.map((member) => (
              <SortableTeamRow
                key={member.id}
                member={member}
                onBump={onBump}
                onMove={onMove}
              />
            ))
          )}
        </div>
      </SortableContext>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SortableTeamRow
// A single team card that is draggable by the grip handle. Clicking anywhere
// on the card body is still safe: the handle is the only drag activator.
// ---------------------------------------------------------------------------
function SortableTeamRow({
  member,
  onBump,
  onMove,
}: {
  member: TeamMember;
  onBump: (id: string, delta: -1 | 1) => void;
  onMove: (id: string, target: TeamSection) => void;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TeamMemberRow
        member={member}
        dragHandleProps={{ ...attributes, ...listeners }}
        onBump={onBump}
        onMove={onMove}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// TeamMemberRow
// The actual card. Displays avatar, name/role, section dropdown, live/hide,
// edit, delete, and up/down arrows. Drag handle on the far left.
// ---------------------------------------------------------------------------
function TeamMemberRow({
  member,
  dragHandleProps,
  onBump,
  onMove,
}: {
  member: TeamMember;
  dragHandleProps: React.HTMLAttributes<HTMLButtonElement>;
  onBump: (id: string, delta: -1 | 1) => void;
  onMove: (id: string, target: TeamSection) => void;
}) {
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
    <div className="flex items-center gap-3 bg-paper rounded-lg border border-faint p-4">
      {/* Drag handle */}
      <button
        type="button"
        {...dragHandleProps}
        className="shrink-0 text-muted hover:text-ink cursor-grab active:cursor-grabbing touch-none px-1 py-2 rounded hover:bg-soft-navy"
        aria-label={`Drag to reorder ${member.name}`}
        title="Drag to reorder or move to another section"
      >
        {/* 6-dot grip icon */}
        <svg
          width="14"
          height="20"
          viewBox="0 0 14 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="3" cy="4" r="1.5" />
          <circle cx="3" cy="10" r="1.5" />
          <circle cx="3" cy="16" r="1.5" />
          <circle cx="11" cy="4" r="1.5" />
          <circle cx="11" cy="10" r="1.5" />
          <circle cx="11" cy="16" r="1.5" />
        </svg>
      </button>

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
            <p className="font-display font-semibold text-sm text-ink">
              {member.name}
            </p>
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
            onChange={(e) => onMove(member.id, e.target.value as TeamSection)}
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
          onClick={() => onBump(member.id, -1)}
          className="text-muted hover:text-ink leading-none text-xs"
          aria-label="Move up"
        >
          &#9650;
        </button>
        <button
          onClick={() => onBump(member.id, 1)}
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
