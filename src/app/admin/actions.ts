"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  MAX_FEATURED_PORTFOLIO_ITEMS,
  MAX_FEATURED_PORTFOLIO_ITEMS_PER_SERVICE,
  TEAM_SECTIONS,
  type TeamSection,
} from "@/lib/supabase/types";

// -- TEAM MEMBERS --

function parseSection(raw: FormDataEntryValue | null): TeamSection {
  const value = (raw as string) || "Crew";
  return (TEAM_SECTIONS as readonly string[]).includes(value)
    ? (value as TeamSection)
    : "Crew";
}

export async function addTeamMember(formData: FormData) {
  const supabase = createServiceRoleClient();
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const photo_url = (formData.get("photo_url") as string) || null;
  const section = parseSection(formData.get("section"));
  await supabase
    .from("team_members")
    .insert({ name, role, photo_url, section, active: true });
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

export async function updateTeamMember(id: string, formData: FormData) {
  const supabase = createServiceRoleClient();
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const photo_url = (formData.get("photo_url") as string) || null;
  const section = parseSection(formData.get("section"));
  await supabase
    .from("team_members")
    .update({ name, role, photo_url, section })
    .eq("id", id);
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

export async function toggleTeamMember(id: string, active: boolean) {
  const supabase = createServiceRoleClient();
  await supabase.from("team_members").update({ active }).eq("id", id);
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

export async function deleteTeamMember(id: string) {
  const supabase = createServiceRoleClient();
  await supabase.from("team_members").delete().eq("id", id);
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

export async function updateTeamMemberOrder(id: string, display_order: number) {
  const supabase = createServiceRoleClient();
  await supabase.from("team_members").update({ display_order }).eq("id", id);
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

/**
 * Move a member into a specific section. Used by the section dropdown on
 * each team row. Trigger of section change is a full-row update in the UI
 * for now, but this action lets us wire "move" without touching name/role.
 */
export async function updateTeamMemberSection(id: string, section: TeamSection) {
  const supabase = createServiceRoleClient();
  const safe: TeamSection = (TEAM_SECTIONS as readonly string[]).includes(section)
    ? section
    : "Crew";
  await supabase.from("team_members").update({ section: safe }).eq("id", id);
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

/**
 * Bulk update of team member positions after a drag-and-drop operation.
 *
 * Each row in `updates` sets a member's section AND display_order in one call.
 * Used by the admin team list DnD context: when the user drops a card into a
 * different section (or reorders within one), the client computes the full
 * post-drop layout and sends the deltas here.
 *
 * The client is expected to renumber display_order densely (0, 1, 2, ...) per
 * section so we do not accumulate gaps over time.
 */
export async function reorderTeamMembers(
  updates: { id: string; section: TeamSection; display_order: number }[]
) {
  if (!updates.length) return;
  const supabase = createServiceRoleClient();
  const safeUpdates = updates
    .filter((u) => (TEAM_SECTIONS as readonly string[]).includes(u.section))
    .map((u) => ({
      id: u.id,
      section: u.section,
      display_order: u.display_order,
    }));

  await Promise.all(
    safeUpdates.map((u) =>
      supabase
        .from("team_members")
        .update({ section: u.section, display_order: u.display_order })
        .eq("id", u.id)
    )
  );

  revalidatePath("/admin/team");
  revalidatePath("/team");
}

// -- JOB LISTINGS --

export async function addJobListing(formData: FormData) {
  const supabase = createServiceRoleClient();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  await supabase.from("job_listings").insert({ title, description, active: true });
  revalidatePath("/admin/jobs");
  revalidatePath("/careers");
}

export async function updateJobListing(id: string, formData: FormData) {
  const supabase = createServiceRoleClient();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  await supabase.from("job_listings").update({ title, description }).eq("id", id);
  revalidatePath("/admin/jobs");
  revalidatePath("/careers");
}

export async function toggleJobListing(id: string, active: boolean) {
  const supabase = createServiceRoleClient();
  await supabase.from("job_listings").update({ active }).eq("id", id);
  revalidatePath("/admin/jobs");
  revalidatePath("/careers");
}

export async function deleteJobListing(id: string) {
  const supabase = createServiceRoleClient();
  await supabase.from("job_listings").delete().eq("id", id);
  revalidatePath("/admin/jobs");
  revalidatePath("/careers");
}

// -- PORTFOLIO ITEMS --

/**
 * Every public surface that shows service-tagged portfolio_items rows.
 * The /services/<slug> hub uses them for the featured strip, hero photo,
 * and gallery. The /resources/<slug> cost-guide pages render a
 * portfolioGallery block that pulls the same rows, so both must be
 * revalidated together whenever a service-tagged item changes.
 */
function revalidateServiceSurfacesForSlug(service: string | null | undefined) {
  if (!service) return;
  revalidatePath(`/services/${service}`);
  revalidatePath(`/resources/${service}`);
}

export async function addPortfolioItem(formData: FormData) {
  const supabase = createServiceRoleClient();
  const photo_url = formData.get("photo_url") as string;
  const caption = (formData.get("caption") as string) || null;
  const service = (formData.get("service") as string) || null;
  const city = (formData.get("city") as string) || null;
  await supabase
    .from("portfolio_items")
    .insert({ photo_url, caption, service, city, active: true });
  revalidatePath("/admin/portfolio");
  revalidatePath("/");
  revalidateServiceSurfacesForSlug(service);
}

export async function updatePortfolioItem(id: string, formData: FormData) {
  const supabase = createServiceRoleClient();
  const caption = (formData.get("caption") as string) || null;
  const service = (formData.get("service") as string) || null;
  const city = (formData.get("city") as string) || null;
  // Grab the current service tag BEFORE the update so we also invalidate
  // the item's previous service surface if the admin retagged it.
  const { data: before } = await supabase
    .from("portfolio_items")
    .select("service")
    .eq("id", id)
    .maybeSingle();

  await supabase
    .from("portfolio_items")
    .update({ caption, service, city })
    .eq("id", id);
  revalidatePath("/admin/portfolio");
  revalidatePath("/");
  revalidateServiceSurfacesForSlug(before?.service ?? null);
  if (service && service !== before?.service) {
    revalidateServiceSurfacesForSlug(service);
  }
}

export async function togglePortfolioItem(id: string, active: boolean) {
  const supabase = createServiceRoleClient();
  const patch: {
    active: boolean;
    featured?: boolean;
    service_featured_order?: number | null;
    is_service_hero?: boolean;
  } = { active };
  // If we're hiding an item, drop all featured/hero flags so it never leaks
  // to the homepage, a service page strip, or a service page hero.
  if (!active) {
    patch.featured = false;
    patch.service_featured_order = null;
    patch.is_service_hero = false;
  }
  const { data: before } = await supabase
    .from("portfolio_items")
    .select("service")
    .eq("id", id)
    .maybeSingle();
  await supabase.from("portfolio_items").update(patch).eq("id", id);
  revalidatePath("/admin/portfolio");
  revalidatePath("/");
  revalidateServiceSurfacesForSlug(before?.service ?? null);
}

export async function deletePortfolioItem(id: string) {
  const supabase = createServiceRoleClient();
  // Grab service BEFORE delete so we know which surfaces to invalidate.
  const { data: before } = await supabase
    .from("portfolio_items")
    .select("service")
    .eq("id", id)
    .maybeSingle();
  await supabase.from("portfolio_items").delete().eq("id", id);
  revalidatePath("/admin/portfolio");
  revalidatePath("/");
  revalidateServiceSurfacesForSlug(before?.service ?? null);
}

/**
 * Set featured=true/false on a portfolio item.
 *
 * When enabling, enforces MAX_FEATURED_PORTFOLIO_ITEMS. If already at the cap,
 * returns { ok: false, reason: "cap" } and the UI shows an inline message.
 * Only active items may be featured. Un-featuring an item also drops it from
 * the service page featured strip, since the homepage strip is the more
 * prominent surface -- keeping both in sync avoids ghosts.
 */
export async function setPortfolioItemFeatured(
  id: string,
  featured: boolean
): Promise<{ ok: true } | { ok: false; reason: "cap" | "not_active" | "not_found" }> {
  const supabase = createServiceRoleClient();

  if (featured) {
    // Verify the target item is active before promoting it
    const { data: target } = await supabase
      .from("portfolio_items")
      .select("id, active, featured")
      .eq("id", id)
      .maybeSingle();

    if (!target) return { ok: false, reason: "not_found" };
    if (!target.active) return { ok: false, reason: "not_active" };
    if (target.featured) {
      revalidatePath("/admin/portfolio");
      return { ok: true };
    }

    // Count currently featured items (excluding this one, which is not featured yet)
    const { count } = await supabase
      .from("portfolio_items")
      .select("id", { count: "exact", head: true })
      .eq("featured", true)
      .eq("active", true);

    if ((count ?? 0) >= MAX_FEATURED_PORTFOLIO_ITEMS) {
      return { ok: false, reason: "cap" };
    }
  }

  await supabase.from("portfolio_items").update({ featured }).eq("id", id);
  revalidatePath("/admin/portfolio");
  revalidatePath("/");
  return { ok: true };
}

/**
 * Set service_featured_order on a portfolio item to enable/disable its
 * appearance in a service page's featured strip.
 *
 * When `featured` is true:
 *   - The item must be active and tagged with a service.
 *   - The item's `service` slug determines which page it will appear on.
 *   - We assign the next-available integer for that service so it lands at
 *     the end of the strip; admin can drag/reorder later if they want.
 *   - Enforces MAX_FEATURED_PORTFOLIO_ITEMS_PER_SERVICE across items that
 *     share this item's `service` slug.
 *
 * When `featured` is false: sets service_featured_order back to null.
 *
 * All revalidations target both the admin panel and the affected public
 * service pages (both /services/<slug> hub and /services/<slug>/<area>).
 */
export async function setPortfolioItemServiceFeatured(
  id: string,
  featured: boolean
): Promise<
  | { ok: true }
  | {
      ok: false;
      reason: "cap" | "not_active" | "no_service" | "not_found";
    }
> {
  const supabase = createServiceRoleClient();

  const { data: target } = await supabase
    .from("portfolio_items")
    .select("id, active, service, service_featured_order")
    .eq("id", id)
    .maybeSingle();

  if (!target) return { ok: false, reason: "not_found" };

  if (featured) {
    if (!target.active) return { ok: false, reason: "not_active" };
    if (!target.service) return { ok: false, reason: "no_service" };

    // Already featured? Idempotent.
    if (target.service_featured_order !== null) {
      revalidatePath("/admin/portfolio");
      revalidateServiceSurfacesForSlug(target.service);
      return { ok: true };
    }

    // Enforce per-service cap.
    const { count: featuredCount } = await supabase
      .from("portfolio_items")
      .select("id", { count: "exact", head: true })
      .eq("service", target.service)
      .eq("active", true)
      .not("service_featured_order", "is", null);

    if ((featuredCount ?? 0) >= MAX_FEATURED_PORTFOLIO_ITEMS_PER_SERVICE) {
      return { ok: false, reason: "cap" };
    }

    // Assign next-available order. We compute max(service_featured_order)
    // for that service and add 1. Falls back to 0 when the service has no
    // featured items yet.
    const { data: rows } = await supabase
      .from("portfolio_items")
      .select("service_featured_order")
      .eq("service", target.service)
      .not("service_featured_order", "is", null);

    const maxOrder = (rows ?? []).reduce<number>((acc, r) => {
      const v = r.service_featured_order;
      return typeof v === "number" && v > acc ? v : acc;
    }, -1);

    await supabase
      .from("portfolio_items")
      .update({ service_featured_order: maxOrder + 1 })
      .eq("id", id);
  } else {
    await supabase
      .from("portfolio_items")
      .update({ service_featured_order: null })
      .eq("id", id);
  }

  revalidatePath("/admin/portfolio");
  revalidateServiceSurfacesForSlug(target.service);
  return { ok: true };
}

/**
 * Set is_service_hero on a portfolio item. Only one item per service may be
 * flagged; setting a new hero automatically clears the previous hero for
 * that service. The item must be active and tagged with a service.
 *
 * Returns:
 *   - { ok: true } when the flag was written (or was already correct)
 *   - { ok: false, reason: "not_active" } if trying to promote an inactive item
 *   - { ok: false, reason: "no_service" } if the item has no service tag
 *   - { ok: false, reason: "not_found" } if the id does not exist
 */
export async function setPortfolioItemServiceHero(
  id: string,
  isHero: boolean
): Promise<
  | { ok: true }
  | {
      ok: false;
      reason: "not_active" | "no_service" | "not_found";
    }
> {
  const supabase = createServiceRoleClient();

  const { data: target } = await supabase
    .from("portfolio_items")
    .select("id, active, service, is_service_hero")
    .eq("id", id)
    .maybeSingle();

  if (!target) return { ok: false, reason: "not_found" };

  if (isHero) {
    if (!target.active) return { ok: false, reason: "not_active" };
    if (!target.service) return { ok: false, reason: "no_service" };

    // Idempotent: already the hero for this service.
    if (target.is_service_hero) {
      revalidatePath("/admin/portfolio");
      revalidateServiceSurfacesForSlug(target.service);
      return { ok: true };
    }

    // Clear any existing hero for this service before setting the new one.
    // The partial unique index would reject two heroes at once, so we must
    // clear first. Both writes happen server-side back-to-back; there's no
    // multi-writer contention on this endpoint in practice.
    await supabase
      .from("portfolio_items")
      .update({ is_service_hero: false })
      .eq("service", target.service)
      .eq("is_service_hero", true);

    await supabase
      .from("portfolio_items")
      .update({ is_service_hero: true })
      .eq("id", id);
  } else {
    await supabase
      .from("portfolio_items")
      .update({ is_service_hero: false })
      .eq("id", id);
  }

  revalidatePath("/admin/portfolio");
  revalidateServiceSurfacesForSlug(target.service);
  return { ok: true };
}

// -- TESTIMONIALS --

export async function addTestimonial(formData: FormData) {
  const supabase = createServiceRoleClient();
  const quote = formData.get("quote") as string;
  const author_name = formData.get("author_name") as string;
  const city = (formData.get("city") as string) || null;
  const service = (formData.get("service") as string) || null;
  await supabase
    .from("testimonials")
    .insert({ quote, author_name, city, service, active: true });
  revalidatePath("/admin/testimonials");
}

export async function updateTestimonial(id: string, formData: FormData) {
  const supabase = createServiceRoleClient();
  const quote = formData.get("quote") as string;
  const author_name = formData.get("author_name") as string;
  const city = (formData.get("city") as string) || null;
  const service = (formData.get("service") as string) || null;
  await supabase
    .from("testimonials")
    .update({ quote, author_name, city, service })
    .eq("id", id);
  revalidatePath("/admin/testimonials");
}

export async function toggleTestimonial(id: string, active: boolean) {
  const supabase = createServiceRoleClient();
  await supabase.from("testimonials").update({ active }).eq("id", id);
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  const supabase = createServiceRoleClient();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidatePath("/admin/testimonials");
}
