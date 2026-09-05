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

/**
 * Matches public.page_text_blocks schema (migration 0013 + 0014).
 * `content` is what visitors see. `draft_content` is a pending admin edit;
 * public code never reads it. Publish action promotes draft to live.
 */
export interface PageTextBlock {
  block_key: string;
  content: string;
  draft_content: string | null;
  updated_at: string;
  draft_updated_at: string | null;
}

/**
 * Matches public.page_photo_slots schema (migration 0013 + 0014).
 * Points at a row in portfolio_items. Slot is empty when portfolio_item_id is
 * null (fallback to hardcoded default). Draft column is admin-only.
 */
export interface PagePhotoSlot {
  slot_key: string;
  portfolio_item_id: string | null;
  draft_portfolio_item_id: string | null;
  updated_at: string;
  draft_updated_at: string | null;
}

/**
 * Resolved photo slot: the referenced portfolio item's photo_url + caption.
 * Draft flag indicates the value comes from a pending admin edit (only ever
 * true when the caller is admin — public reads never see drafts).
 */
export interface ResolvedPhotoSlot {
  slot_key: string;
  photo_url: string | null;
  alt: string | null;
  portfolio_item_id: string | null;
  is_draft: boolean;
}

// ── INT-004: QR code tracking ───────────────────────────────────────────────

/** Channels a printed code can live on. Matches qr_codes.channel. */
export const QR_CHANNELS = [
  "print",
  "signage",
  "vehicle",
  "event",
  "mail",
] as const;

export type QrChannel = (typeof QR_CHANNELS)[number];

/** Matches public.qr_codes schema */
export interface QrCode {
  id: string;
  created_at: string;
  /** Path segment in /r/<slug>. Immutable in practice once printed. */
  slug: string;
  label: string;
  channel: string;
  destination_path: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string | null;
  utm_content: string | null;
  /** Appended to the Roofr job name, e.g. "Jane Doe- Kitchen (MGMAG)". */
  roofr_tag: string | null;
  /** Human channel name written onto leads, e.g. "Maple Grove Magazine". */
  source_channel: string | null;
  cost_cents: number | null;
  quantity: number | null;
  run_starts_on: string | null;
  run_ends_on: string | null;
  notes: string | null;
  is_active: boolean;
}

/**
 * Matches the public.qr_performance view. Read-only, service-role only.
 * `scans` excludes bots and same-device repeats; `total_hits` does not.
 */
export interface QrPerformanceRow {
  slug: string;
  label: string;
  channel: string;
  utm_campaign: string | null;
  is_active: boolean;
  run_starts_on: string | null;
  run_ends_on: string | null;
  cost_dollars: number | null;
  scans: number;
  total_hits: number;
  bot_hits: number;
  first_scan_at: string | null;
  last_scan_at: string | null;
  leads: number;
  consultations: number;
  reached_roofr: number;
  cost_per_scan: number | null;
  cost_per_lead: number | null;
  scan_to_lead_pct: number | null;
}

/**
 * Slug rule mirrors the qr_codes_slug_format CHECK constraint. Validated in
 * the admin action so a bad slug is a friendly error, not a 500 from Postgres.
 */
export const QR_SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,30}$/;
