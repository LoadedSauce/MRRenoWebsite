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
 * Fetch active portfolio items for a service slug.
 * Returns empty array when none exist. Caller falls back to service-data.ts galleryImages.
 */
export async function getPortfolioItemsByService(
  service: string
): Promise<PortfolioItem[]> {
  const { data } = await supabase
    .from("portfolio_items")
    .select()
    .eq("active", true)
    .eq("service", service)
    .order("display_order");
  return data ?? [];
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
