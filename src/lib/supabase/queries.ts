import { supabase } from "./client";
import type { TeamMember, PortfolioItem, Testimonial, JobListing } from "./types";

// -- TESTIMONIALS --

/**
 * Fetch one active testimonial for a Tier 3 page.
 * Priority: service+city match -> service-only match -> any active testimonial.
 */
export async function getTestimonialForArea(
  service: string,
  city: string
): Promise<Testimonial | null> {
  const { data: exact } = await supabase
    .from("testimonials")
    .select()
    .eq("active", true)
    .eq("service", service)
    .ilike("city", city)
    .order("display_order")
    .limit(1)
    .maybeSingle();
  if (exact) return exact;

  const { data: serviceMatch } = await supabase
    .from("testimonials")
    .select()
    .eq("active", true)
    .eq("service", service)
    .order("display_order")
    .limit(1)
    .maybeSingle();
  if (serviceMatch) return serviceMatch;

  const { data: fallback } = await supabase
    .from("testimonials")
    .select()
    .eq("active", true)
    .order("display_order")
    .limit(1)
    .maybeSingle();
  return fallback ?? null;
}

/**
 * Fetch one active testimonial for a Tier 2 hub page.
 * Priority: service match -> any active testimonial.
 */
export async function getTestimonialForService(
  service: string
): Promise<Testimonial | null> {
  const { data } = await supabase
    .from("testimonials")
    .select()
    .eq("active", true)
    .eq("service", service)
    .order("display_order")
    .limit(1)
    .maybeSingle();
  if (data) return data;

  const { data: fallback } = await supabase
    .from("testimonials")
    .select()
    .eq("active", true)
    .order("display_order")
    .limit(1)
    .maybeSingle();
  return fallback ?? null;
}

// -- PORTFOLIO --

/**
 * Fetch the hero photo for a service, if the admin has set one.
 * Returns null when no active item is flagged as hero for this service --
 * caller should fall back to the first gallery image or a placeholder.
 */
export async function getServiceHeroPhoto(
  service: string
): Promise<PortfolioItem | null> {
  const { data } = await supabase
    .from("portfolio_items")
    .select()
    .eq("active", true)
    .eq("service", service)
    .eq("is_service_hero", true)
    .limit(1)
    .maybeSingle();
  return data ?? null;
}

/**
 * Fetch active portfolio items for a service slug, ordered so that any items
 * flagged via the admin's per-service Featured strip come first (ascending by
 * service_featured_order), followed by the rest of the service's active
 * items ordered by display_order.
 *
 * Returns empty array when none exist. Caller falls back to
 * service-data.ts galleryImages.
 */
export async function getPortfolioItemsByService(
  service: string
): Promise<PortfolioItem[]> {
  // Postgrest's nullsFirst controls where NULLs sort. We want NON-null
  // service_featured_order values FIRST (ascending), then all the NULLs
  // (ordered by display_order). Two ordered queries + concat is the
  // simplest way to get a deterministic result without SQL-level sort
  // options that PostgREST wraps loosely.
  const { data: featured } = await supabase
    .from("portfolio_items")
    .select()
    .eq("active", true)
    .eq("service", service)
    .not("service_featured_order", "is", null)
    .order("service_featured_order", { ascending: true });

  const { data: rest } = await supabase
    .from("portfolio_items")
    .select()
    .eq("active", true)
    .eq("service", service)
    .is("service_featured_order", null)
    .order("display_order", { ascending: true });

  return [...(featured ?? []), ...(rest ?? [])];
}

/**
 * Fetch the items that should appear on the homepage's featured strip.
 *
 * Primary: items with featured=true and active=true, ordered by display_order.
 * Fallback: if no featured items exist yet, return the N most recently added
 * active items so the site never renders an empty strip.
 */
export async function getRecentPortfolioItems(limit = 3): Promise<PortfolioItem[]> {
  const { data: featured } = await supabase
    .from("portfolio_items")
    .select()
    .eq("active", true)
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .limit(limit);

  if (featured && featured.length > 0) return featured;

  const { data: recent } = await supabase
    .from("portfolio_items")
    .select()
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return recent ?? [];
}

// -- TEAM --

export async function getActiveTeamMembers(): Promise<TeamMember[]> {
  const { data } = await supabase
    .from("team_members")
    .select()
    .eq("active", true)
    .order("display_order");
  return data ?? [];
}

// -- JOBS --

export async function getActiveJobListings(): Promise<JobListing[]> {
  const { data } = await supabase
    .from("job_listings")
    .select()
    .eq("active", true)
    .order("display_order");
  return data ?? [];
}


/**
 * List every active portfolio item, ordered by service then display_order.
 * Powers the master photo picker in the edit-mode overlay.
 */
export async function getAllActivePortfolioItems(): Promise<PortfolioItem[]> {
  const { data } = await supabase
    .from("portfolio_items")
    .select()
    .eq("active", true)
    .order("service", { ascending: true, nullsFirst: false })
    .order("display_order", { ascending: true });
  return data ?? [];
}

// -- PAGE CONTENT (blocks + slots) ---------------------------------------
//
// These queries power the inline edit-mode framework. Public pages call the
// non-`Admin` variants which read only the live columns; the admin edit
// overlay calls the `Admin` variants which merge draft values so the admin
// sees their pending edits in-place.

/**
 * Fetch every text block on a page. Returns a map of block_key -> live
 * `content`. Missing keys are not errors -- callers use their own fallback.
 * Cheap: single query, single round trip.
 */
export async function getPageTextBlocks(
  pageKey: string
): Promise<Record<string, string>> {
  const { data } = await supabase
    .from("page_text_blocks")
    .select("block_key, content")
    .like("block_key", `${pageKey}.%`);
  const out: Record<string, string> = {};
  for (const row of data ?? []) {
    if (row.content !== "") out[row.block_key] = row.content;
  }
  return out;
}

/**
 * Admin variant: returns { live, draft } per key so the edit overlay can
 * render the draft value inline and flag the pending state. Requires the
 * caller to be authenticated as admin (server-side check).
 */
export async function getPageTextBlocksAdmin(
  pageKey: string
): Promise<Record<string, { live: string; draft: string | null }>> {
  const { data } = await supabase
    .from("page_text_blocks")
    .select("block_key, content, draft_content")
    .like("block_key", `${pageKey}.%`);
  const out: Record<string, { live: string; draft: string | null }> = {};
  for (const row of data ?? []) {
    out[row.block_key] = {
      live: row.content ?? "",
      draft: row.draft_content ?? null,
    };
  }
  return out;
}

/**
 * Fetch every photo slot on a page as a joined query -- returns the resolved
 * photo_url + caption from the referenced portfolio_items row. Empty slots
 * are omitted from the map (callers fall back to hardcoded defaults).
 */
export async function getPagePhotoSlots(
  pageKey: string
): Promise<Record<string, { photo_url: string; alt: string | null }>> {
  const { data } = await supabase
    .from("page_photo_slots")
    .select(
      "slot_key, portfolio_item_id, portfolio:portfolio_items!page_photo_slots_portfolio_item_id_fkey(photo_url, caption)"
    )
    .like("slot_key", `${pageKey}.%`)
    .not("portfolio_item_id", "is", null);

  const out: Record<string, { photo_url: string; alt: string | null }> = {};
  for (const row of (data ?? []) as unknown as Array<{
    slot_key: string;
    portfolio_item_id: string | null;
    portfolio: { photo_url: string; caption: string | null } | null;
  }>) {
    if (row.portfolio?.photo_url) {
      out[row.slot_key] = {
        photo_url: row.portfolio.photo_url,
        alt: row.portfolio.caption,
      };
    }
  }
  return out;
}

/**
 * Admin variant: for each slot returns both the live-referenced photo and
 * (if a draft exists) the draft-referenced photo. Admin overlay uses this
 * to show the pending image and mark the slot as dirty.
 */
export async function getPagePhotoSlotsAdmin(pageKey: string): Promise<
  Record<
    string,
    {
      live: { photo_url: string; alt: string | null; id: string } | null;
      draft: { photo_url: string; alt: string | null; id: string } | null;
    }
  >
> {
  const { data } = await supabase
    .from("page_photo_slots")
    .select(
      "slot_key, portfolio_item_id, draft_portfolio_item_id, live:portfolio_items!page_photo_slots_portfolio_item_id_fkey(id, photo_url, caption), draft:portfolio_items!page_photo_slots_draft_portfolio_item_id_fkey(id, photo_url, caption)"
    )
    .like("slot_key", `${pageKey}.%`);

  const out: Record<
    string,
    {
      live: { photo_url: string; alt: string | null; id: string } | null;
      draft: { photo_url: string; alt: string | null; id: string } | null;
    }
  > = {};
  for (const row of (data ?? []) as unknown as Array<{
    slot_key: string;
    live: { id: string; photo_url: string; caption: string | null } | null;
    draft: { id: string; photo_url: string; caption: string | null } | null;
  }>) {
    out[row.slot_key] = {
      live: row.live
        ? { photo_url: row.live.photo_url, alt: row.live.caption, id: row.live.id }
        : null,
      draft: row.draft
        ? { photo_url: row.draft.photo_url, alt: row.draft.caption, id: row.draft.id }
        : null,
    };
  }
  return out;
}

/**
 * Count of pending drafts across the whole site. Used by the admin overlay
 * pending-changes badge.
 */
export async function getPendingDraftsCount(): Promise<{
  text: number;
  photo: number;
}> {
  const [textResult, photoResult] = await Promise.all([
    supabase
      .from("page_text_blocks")
      .select("block_key", { count: "exact", head: true })
      .not("draft_content", "is", null),
    supabase
      .from("page_photo_slots")
      .select("slot_key", { count: "exact", head: true })
      .not("draft_updated_at", "is", null),
  ]);
  return { text: textResult.count ?? 0, photo: photoResult.count ?? 0 };
}

/**
 * List every pending draft with a preview payload for the admin tray.
 */
export async function getPendingDrafts(): Promise<{
  textBlocks: Array<{ block_key: string; live: string; draft: string; updated_at: string }>;
  photoSlots: Array<{
    slot_key: string;
    live: { photo_url: string; alt: string | null } | null;
    draft: { photo_url: string; alt: string | null } | null;
    updated_at: string;
  }>;
}> {
  const [{ data: textRows }, { data: slotRows }] = await Promise.all([
    supabase
      .from("page_text_blocks")
      .select("block_key, content, draft_content, draft_updated_at")
      .not("draft_content", "is", null)
      .order("draft_updated_at", { ascending: false }),
    supabase
      .from("page_photo_slots")
      .select(
        "slot_key, draft_updated_at, live:portfolio_items!page_photo_slots_portfolio_item_id_fkey(photo_url, caption), draft:portfolio_items!page_photo_slots_draft_portfolio_item_id_fkey(photo_url, caption)"
      )
      .not("draft_updated_at", "is", null)
      .order("draft_updated_at", { ascending: false }),
  ]);

  const textBlocks = (textRows ?? []).map((r) => ({
    block_key: r.block_key,
    live: r.content ?? "",
    draft: r.draft_content ?? "",
    updated_at: r.draft_updated_at ?? "",
  }));

  const photoSlots = ((slotRows ?? []) as unknown as Array<{
    slot_key: string;
    draft_updated_at: string | null;
    live: { photo_url: string; caption: string | null } | null;
    draft: { photo_url: string; caption: string | null } | null;
  }>).map((r) => ({
    slot_key: r.slot_key,
    live: r.live ? { photo_url: r.live.photo_url, alt: r.live.caption } : null,
    draft: r.draft ? { photo_url: r.draft.photo_url, alt: r.draft.caption } : null,
    updated_at: r.draft_updated_at ?? "",
  }));

  return { textBlocks, photoSlots };
}
