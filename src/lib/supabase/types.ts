/** Matches public.team_members schema */
export interface TeamMember {
  id: string;
  created_at: string;
  name: string;
  role: string;
  photo_url: string | null;
  display_order: number;
  active: boolean;
  section: TeamSection;
}

export const TEAM_SECTIONS = [
  "Owner",
  "Customer Service, Production & Coordination",
  "Sales",
  "Crew",
] as const;

export type TeamSection = (typeof TEAM_SECTIONS)[number];

/** Matches public.portfolio_items schema */
export interface PortfolioItem {
  id: string;
  created_at: string;
  photo_url: string;
  caption: string | null;
  service: string | null;
  city: string | null;
  display_order: number;
  active: boolean;
  featured: boolean;
  /**
   * When set, item is featured on its service page in ascending order of
   * this value. When null, it is not on the service page featured strip
   * (but still appears in the rest of the service gallery if active).
   */
  service_featured_order: number | null;
  /**
   * When true, this item's photo is used as the hero image on its service's
   * Tier 2 hub page and Tier 3 area pages. At most one item per service may
   * be flagged (enforced by admin action + partial unique index).
   */
  is_service_hero: boolean;
}

/** Maximum number of items that can be featured on the homepage at once. */
export const MAX_FEATURED_PORTFOLIO_ITEMS = 3;

/** Maximum number of items that can be featured on any one service page. */
export const MAX_FEATURED_PORTFOLIO_ITEMS_PER_SERVICE = 3;

/**
 * Canonical list of service slugs used across the app. Admin panels, portfolio
 * item tagging, service page routing, and structured data all key off these.
 */
export const SERVICE_SLUGS = [
  "kitchens",
  "bathrooms",
  "basements",
  "additions",
  "whole-home",
  "exterior",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

/** Display labels for the service slugs, in the same order. */
export const SERVICE_LABELS: Record<ServiceSlug, string> = {
  kitchens: "Kitchens",
  bathrooms: "Bathrooms",
  basements: "Basements",
  additions: "Additions",
  "whole-home": "Whole Home",
  exterior: "Exterior",
};

/** Matches public.testimonials schema */
export interface Testimonial {
  id: string;
  created_at: string;
  quote: string;
  author_name: string;
  city: string | null;
  service: string | null;
  active: boolean;
  display_order: number;
}

/** Matches public.job_listings schema */
export interface JobListing {
  id: string;
  created_at: string;
  title: string;
  description: string;
  active: boolean;
  display_order: number;
}

/** Matches public.candidates schema (migration 0008) */
export interface Candidate {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  role_interest: string | null;
  experience_summary: string | null;
  resume_storage_path: string | null;
  status: string | null;
}
