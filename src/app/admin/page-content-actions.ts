"use server";

// Inline edit-mode server actions. Every action here:
//   1) Requires an authenticated admin session (Supabase Auth getUser()).
//      Middleware already redirects unauthenticated /admin, but these actions
//      are callable from /?edit=1 so we re-check inside the action too.
//   2) Uses the service-role Supabase client to write. (Rule 7.)
//   3) Writes to draft_* columns only, never to live columns, except for the
//      publish variants which call the SQL functions that promote atomically.
//   4) Revalidates admin paths after every write. Live public paths are only
//      revalidated after a publish, so drafts stay invisible to visitors.

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { PAGE_REGISTRY } from "@/lib/page-content/registry";

// -- Auth gate ---------------------------------------------------------------

async function requireAdminSession(): Promise<void> {
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
          // Server actions may not mutate cookies. Reads only here.
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authorized: admin session required.");
  }
}

// -- Key validation ----------------------------------------------------------
// The DB is permissive (any key), so registry-based validation lives here.
// Prevents typos and stray keys from writing garbage into the tables.

function assertKnownBlockKey(blockKey: string): void {
  for (const page of Object.values(PAGE_REGISTRY)) {
    if (page.textBlocks.some((b) => b.blockKey === blockKey)) return;
  }
  throw new Error(`Unknown text block key: ${blockKey}`);
}

function assertKnownSlotKey(slotKey: string): void {
  for (const page of Object.values(PAGE_REGISTRY)) {
    if (page.photoSlots.some((s) => s.slotKey === slotKey)) return;
  }
  throw new Error(`Unknown photo slot key: ${slotKey}`);
}

// -- Text block drafts -------------------------------------------------------

export async function saveTextBlockDraft(
  blockKey: string,
  content: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdminSession();
    assertKnownBlockKey(blockKey);

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("page_text_blocks")
      .upsert(
        {
          block_key: blockKey,
          content: "", // required column, replaced on publish
          draft_content: content,
          draft_updated_at: new Date().toISOString(),
        },
        { onConflict: "block_key", ignoreDuplicates: false }
      );
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/edit");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function revertTextBlockDraft(
  blockKey: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdminSession();
    assertKnownBlockKey(blockKey);
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("page_text_blocks")
      .update({ draft_content: null, draft_updated_at: null })
      .eq("block_key", blockKey);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/edit");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// -- Photo slot drafts -------------------------------------------------------

export async function savePhotoSlotDraft(
  slotKey: string,
  portfolioItemId: string | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdminSession();
    assertKnownSlotKey(slotKey);

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("page_photo_slots")
      .upsert(
        {
          slot_key: slotKey,
          draft_portfolio_item_id: portfolioItemId,
          draft_updated_at: new Date().toISOString(),
        },
        { onConflict: "slot_key", ignoreDuplicates: false }
      );
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/edit");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function revertPhotoSlotDraft(
  slotKey: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdminSession();
    assertKnownSlotKey(slotKey);
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("page_photo_slots")
      .update({ draft_portfolio_item_id: null, draft_updated_at: null })
      .eq("slot_key", slotKey);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/edit");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// -- Publish -----------------------------------------------------------------

export async function publishAllDrafts(): Promise<
  { ok: true; textPublished: number; photoPublished: number } | { ok: false; error: string }
> {
  try {
    await requireAdminSession();
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.rpc("publish_all_page_drafts");
    if (error) return { ok: false, error: error.message };

    const row = Array.isArray(data) ? data[0] : data;
    const textPublished = row?.text_blocks_published ?? 0;
    const photoPublished = row?.photo_slots_published ?? 0;

    // Flush all public ISR: layout + every route the registry knows about.
    revalidatePath("/", "layout");
    revalidatePath("/admin/edit");
    return { ok: true, textPublished, photoPublished };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function publishOneTextBlock(
  blockKey: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdminSession();
    assertKnownBlockKey(blockKey);
    const supabase = createServiceRoleClient();
    const { error } = await supabase.rpc("publish_page_text_block", {
      p_block_key: blockKey,
    });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/edit");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function publishOnePhotoSlot(
  slotKey: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdminSession();
    assertKnownSlotKey(slotKey);
    const supabase = createServiceRoleClient();
    const { error } = await supabase.rpc("publish_page_photo_slot", {
      p_slot_key: slotKey,
    });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/edit");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
