/** Matches public.team_members schema */
export interface TeamMember {
  id: string;
  created_at: string;
  name: string;
  role: string;
  photo_url: string | null;
  display_order: number;
  active: boolean;
}

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
}

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
