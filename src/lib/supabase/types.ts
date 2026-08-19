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
}

/** Maximum number of items that can be featured on the homepage at once. */
export const MAX_FEATURED_PORTFOLIO_ITEMS = 3;

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
