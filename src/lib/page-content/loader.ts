// Server-side page content loader.
//
// One call per page render:  const content = await loadPageContent("home");
// then pass `content` into every EditableText / EditablePhoto call.
//
// Behavior differs by mode:
//   - Public mode (default): reads only live values. Draft rows are ignored.
//   - Edit mode (?edit=1 with admin cookie): reads live AND draft. Draft
//     values are surfaced so the admin sees their pending edits in-place.
//
// The `isEditMode` flag is computed by the page from cookies() + searchParams.
// This keeps the loader synchronous with the caller's auth context.

import {
  getPageTextBlocks,
  getPageTextBlocksAdmin,
  getPagePhotoSlots,
  getPagePhotoSlotsAdmin,
} from "@/lib/supabase/queries";

export interface PageContent {
  pageKey: string;
  isEditMode: boolean;
  /**
   * Text lookup. In edit mode: draft ?? live ?? fallback (caller's default).
   * In public mode: live ?? fallback.
   */
  text: (blockKey: string, fallback: string) => string;
  /**
   * Photo lookup. In edit mode: draft ?? live ?? fallback (caller's default).
   * In public mode: live ?? fallback. Returns null when neither exists,
   * caller supplies its own fallback in that case.
   */
  photo: (
    slotKey: string,
    fallback: { src: string; alt: string }
  ) => { src: string; alt: string };
  /**
   * Predicate: true when a block/slot has a pending draft that differs from
   * the live value. Used by the edit-mode chrome to mark dirty fields.
   */
  isDirty: (key: string) => boolean;
  /**
   * Raw admin lookup: for the pending-changes tray. Only populated in edit
   * mode. Public mode returns empty maps.
   */
  admin: {
    textBlocks: Record<string, { live: string; draft: string | null }>;
    photoSlots: Record<
      string,
      {
        live: { photo_url: string; alt: string | null; id: string } | null;
        draft: { photo_url: string; alt: string | null; id: string } | null;
      }
    >;
  };
}

export async function loadPageContent(
  pageKey: string,
  isEditMode: boolean
): Promise<PageContent> {
  if (isEditMode) {
    const [textBlocks, photoSlots] = await Promise.all([
      getPageTextBlocksAdmin(pageKey),
      getPagePhotoSlotsAdmin(pageKey),
    ]);

    const dirtyKeys = new Set<string>();
    for (const [k, v] of Object.entries(textBlocks)) {
      if (v.draft !== null) dirtyKeys.add(k);
    }
    for (const [k, v] of Object.entries(photoSlots)) {
      if (v.draft !== null) dirtyKeys.add(k);
    }

    return {
      pageKey,
      isEditMode: true,
      text: (blockKey, fallback) => {
        const row = textBlocks[blockKey];
        if (!row) return fallback;
        // Draft takes precedence in edit mode; empty-string draft still wins
        // (admin might intentionally blank a field).
        if (row.draft !== null) return row.draft;
        return row.live || fallback;
      },
      photo: (slotKey, fallback) => {
        const row = photoSlots[slotKey];
        if (!row) return fallback;
        const pick = row.draft ?? row.live;
        if (!pick) return fallback;
        return {
          src: pick.photo_url,
          alt: pick.alt ?? fallback.alt,
        };
      },
      isDirty: (key) => dirtyKeys.has(key),
      admin: { textBlocks, photoSlots },
    };
  }

  // Public mode
  const [textBlocks, photoSlots] = await Promise.all([
    getPageTextBlocks(pageKey),
    getPagePhotoSlots(pageKey),
  ]);
  return {
    pageKey,
    isEditMode: false,
    text: (blockKey, fallback) => textBlocks[blockKey] ?? fallback,
    photo: (slotKey, fallback) => {
      const row = photoSlots[slotKey];
      if (!row) return fallback;
      return { src: row.photo_url, alt: row.alt ?? fallback.alt };
    },
    isDirty: () => false,
    admin: { textBlocks: {}, photoSlots: {} },
  };
}

/**
 * Compute edit-mode from headers/cookies. Called by page-level server
 * components. Two signals must both be present:
 *   1. `?edit=1` search param on the URL.
 *   2. Authenticated admin session (Supabase Auth cookie).
 * Absent either signal, public mode is returned. This is the single choke
 * point that decides whether draft values render.
 */
export async function detectEditMode(searchParams: URLSearchParams | Record<string, string | string[] | undefined>): Promise<boolean> {
  // Signal 1: search param
  const rawEdit =
    searchParams instanceof URLSearchParams
      ? searchParams.get("edit")
      : (searchParams.edit as string | undefined);
  if (rawEdit !== "1") return false;

  // Signal 2: admin session cookie. Import at call time so this module
  // stays usable from other server contexts without pulling next/headers.
  const { cookies } = await import("next/headers");
  const { createServerClient } = await import("@supabase/ssr");
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          /* readonly */
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
}
