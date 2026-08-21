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
