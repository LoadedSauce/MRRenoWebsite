/**
 * Per-area content data shape.
 *
 * Used to hydrate service x area landing pages (Tier 3) with locally
 * relevant copy. Implemented as a static TypeScript module â€” not a CMS,
 * database table, or remote API call.
 */

export interface RecentProjectExample {
  /**
   * Matches a service slug used in URL routing.
   * Expected values: "kitchens" | "bathrooms" | "basements" |
   *                  "additions" | "whole-home" | "exterior"
   */
  serviceSlug: string;
  /** Short project display title, e.g. "Rogers Kitchen Remodel" */
  title: string;
  /** One-sentence description of the scope and outcome */
  summary: string;
}

export interface FaqOverride {
  question: string;
  answer: string;
}

export interface ServiceAreaData {
  /** URL-safe slug, e.g. "rogers" */
  citySlug: string;
  /** Display name, e.g. "Rogers" */
  cityName: string;
  /** Two-letter state abbreviation */
  stateAbbr: string;
  /**
   * One sentence giving drive time from the M.R. Renovations office.
   * Example: "About 12 minutes from our Maple Grove office."
   */
  driveTimeText: string;
  /**
   * Notable neighborhoods or community areas in the city.
   * Used for local signal in hero blurbs and body copy.
   */
  neighborhoods: string[];
  /**
   * 1â€“3 recent projects completed in this city.
   * Displayed in the "Recent work nearby" section of the service x area page.
   */
  recentProjectExamples: RecentProjectExample[];
  /**
   * One or two sentences for the hero sub-copy, specific to this city.
   * Must mention the city by name and reference local knowledge.
   */
  heroBlurb: string;
  /**
   * City-specific FAQ items that supplement or override the default service FAQ.
   * If absent, the default service FAQ renders unchanged.
   */
  faqOverrides?: FaqOverride[];
}