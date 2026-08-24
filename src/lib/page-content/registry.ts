// Page content registry.
//
// The single source of truth for which slots and blocks are editable on each
// page. Every EditableText / EditablePhoto rendered by page code MUST use a
// key that appears here, so the admin overlay can enumerate them and so that
// runtime keys stay in sync with the schema-less DB tables (page_text_blocks,
// page_photo_slots) that back them.
//
// The DB does not know about pages; pages here are a code concept keyed by
// slot/block prefix. That means renames require both a code change AND a data
// migration (UPDATE ... SET block_key = new WHERE block_key = old), but never
// a schema change. This is the intended trade-off.
//
// Adding a new page: append to PAGE_REGISTRY. Adding a new slot/block on an
// existing page: extend that page's entry. No DB changes required in either
// case.

export interface PageRegistryEntry {
  key: string; // e.g. "home"
  label: string; // human-readable, shown in admin
  route: string; // public URL, so admin can jump into edit mode
  order: number; // display order in admin left rail
  photoSlots: Array<PhotoSlotDef>;
  textBlocks: Array<TextBlockDef>;
}

export interface PhotoSlotDef {
  slotKey: string; // dotted key stored in page_photo_slots.slot_key
  label: string; // human-readable, shown in admin card
  hint?: string; // optional guidance (aspect ratio, purpose, etc.)
  // Fallback is provided by the render site (the page code) -- registry
  // only enumerates what CAN be edited, not what it falls back to.
}

export interface TextBlockDef {
  blockKey: string;
  label: string;
  hint?: string;
  multiline?: boolean; // renders as textarea rather than input in edit mode
}

// -- HOME PAGE ---------------------------------------------------------------

const HOME: PageRegistryEntry = {
  key: "home",
  label: "Home",
  route: "/",
  order: 1,
  photoSlots: [
    { slotKey: "home.hero.background", label: "Hero background photo", hint: "Wide landscape, high resolution. Text overlays the left third." },
    { slotKey: "home.services.kitchens.image", label: "Services tile: Kitchens" },
    { slotKey: "home.services.bathrooms.image", label: "Services tile: Bathrooms" },
    { slotKey: "home.services.basements.image", label: "Services tile: Basements" },
    { slotKey: "home.services.additions.image", label: "Services tile: Additions" },
    { slotKey: "home.services.whole-home.image", label: "Services tile: Whole Home" },
    { slotKey: "home.services.exterior.image", label: "Services tile: Exterior" },
    { slotKey: "home.recent.1", label: "Recent work card 1 (override)", hint: "Leave empty to auto-pick from portfolio." },
    { slotKey: "home.recent.2", label: "Recent work card 2 (override)", hint: "Leave empty to auto-pick from portfolio." },
    { slotKey: "home.recent.3", label: "Recent work card 3 (override)", hint: "Leave empty to auto-pick from portfolio." },
  ],
  textBlocks: [
    // Hero
    { blockKey: "home.hero.eyebrow", label: "Hero eyebrow", hint: "Small caps above the headline." },
    { blockKey: "home.hero.headline.line1", label: "Hero headline line 1" },
    { blockKey: "home.hero.headline.line2", label: "Hero headline line 2" },
    { blockKey: "home.hero.headline.line3", label: "Hero headline line 3" },
    { blockKey: "home.hero.subcopy", label: "Hero subcopy", multiline: true },
    { blockKey: "home.hero.cta.primary", label: "Hero primary CTA label" },
    { blockKey: "home.hero.cta.secondary", label: "Hero secondary CTA label" },
    { blockKey: "home.hero.stat1.label", label: "Hero stat 1 label" },
    { blockKey: "home.hero.stat2.label", label: "Hero stat 2 label" },
    { blockKey: "home.hero.stat3.label", label: "Hero stat 3 label" },
    { blockKey: "home.hero.stat4.label", label: "Hero stat 4 label" },

    // Warranty band
    { blockKey: "home.warranty.title", label: "Warranty band: title" },
    { blockKey: "home.warranty.subtitle", label: "Warranty band: subtitle" },
    { blockKey: "home.warranty.cta", label: "Warranty band: CTA label" },
    { blockKey: "home.discounts.title", label: "Discounts band: title" },
    { blockKey: "home.discounts.line1", label: "Discounts band: line 1" },
    { blockKey: "home.discounts.line2", label: "Discounts band: line 2" },
    { blockKey: "home.financing.title", label: "Financing band: title" },
    { blockKey: "home.financing.subtitle", label: "Financing band: subtitle" },
    { blockKey: "home.financing.cta", label: "Financing band: CTA label" },

    // Services section
    { blockKey: "home.services.eyebrow", label: "Services section: eyebrow" },
    { blockKey: "home.services.headline", label: "Services section: headline", multiline: true },
    { blockKey: "home.services.subcopy", label: "Services section: subcopy", multiline: true },
    { blockKey: "home.services.kitchens.name", label: "Services tile: Kitchens name" },
    { blockKey: "home.services.kitchens.body", label: "Services tile: Kitchens body", multiline: true },
    { blockKey: "home.services.bathrooms.name", label: "Services tile: Bathrooms name" },
    { blockKey: "home.services.bathrooms.body", label: "Services tile: Bathrooms body", multiline: true },
    { blockKey: "home.services.basements.name", label: "Services tile: Basements name" },
    { blockKey: "home.services.basements.body", label: "Services tile: Basements body", multiline: true },
    { blockKey: "home.services.additions.name", label: "Services tile: Additions name" },
    { blockKey: "home.services.additions.body", label: "Services tile: Additions body", multiline: true },
    { blockKey: "home.services.whole-home.name", label: "Services tile: Whole Home name" },
    { blockKey: "home.services.whole-home.body", label: "Services tile: Whole Home body", multiline: true },
    { blockKey: "home.services.exterior.name", label: "Services tile: Exterior name" },
    { blockKey: "home.services.exterior.body", label: "Services tile: Exterior body", multiline: true },

    // Process teaser
    { blockKey: "home.process.eyebrow", label: "Process teaser: eyebrow" },
    { blockKey: "home.process.headline", label: "Process teaser: headline", multiline: true },
    { blockKey: "home.process.subcopy", label: "Process teaser: subcopy", multiline: true },
    { blockKey: "home.process.step1.title", label: "Process teaser: step 1 title" },
    { blockKey: "home.process.step1.body", label: "Process teaser: step 1 body", multiline: true },
    { blockKey: "home.process.step2.title", label: "Process teaser: step 2 title" },
    { blockKey: "home.process.step2.body", label: "Process teaser: step 2 body", multiline: true },
    { blockKey: "home.process.step3.title", label: "Process teaser: step 3 title" },
    { blockKey: "home.process.step3.body", label: "Process teaser: step 3 body", multiline: true },

    // Recent work
    { blockKey: "home.recent.eyebrow", label: "Recent work: eyebrow" },
    { blockKey: "home.recent.headline", label: "Recent work: headline", multiline: true },
    { blockKey: "home.recent.subcopy", label: "Recent work: subcopy", multiline: true },

    // Testimonial
    { blockKey: "home.testimonial.quote", label: "Testimonial quote", multiline: true },
    { blockKey: "home.testimonial.attribution", label: "Testimonial attribution" },

    // Offers
    { blockKey: "home.offers.eyebrow", label: "Offers: eyebrow" },
    { blockKey: "home.offers.headline", label: "Offers: headline", multiline: true },
    { blockKey: "home.offers.card1.label", label: "Offer 1: label chip" },
    { blockKey: "home.offers.card1.title", label: "Offer 1: title" },
    { blockKey: "home.offers.card1.body", label: "Offer 1: body", multiline: true },
    { blockKey: "home.offers.card2.label", label: "Offer 2: label chip" },
    { blockKey: "home.offers.card2.title", label: "Offer 2: title" },
    { blockKey: "home.offers.card2.body", label: "Offer 2: body", multiline: true },
    { blockKey: "home.offers.card3.label", label: "Offer 3: label chip" },
    { blockKey: "home.offers.card3.title", label: "Offer 3: title" },
    { blockKey: "home.offers.card3.body", label: "Offer 3: body", multiline: true },

    // Final CTA
    { blockKey: "home.final.eyebrow", label: "Final CTA: eyebrow" },
    { blockKey: "home.final.headline", label: "Final CTA: headline", multiline: true },
    { blockKey: "home.final.subcopy", label: "Final CTA: subcopy", multiline: true },
    { blockKey: "home.final.cta.primary", label: "Final CTA: primary button" },
    { blockKey: "home.final.cta.secondary", label: "Final CTA: secondary button" },
  ],
};

// -- SERVICE HUB PAGES -------------------------------------------------------
//
// All six service hubs share the same editable-slot shape. Only the copy
// differs. The factory below emits one PageRegistryEntry per slug and each
// slug's route is /services/<slug>. Tier 3 area pages (/services/kitchens/
// maple-grove) inherit the same template but stay non-editable in this PR --
// city-scoped edits are deferred.

const SERVICE_SLUGS = [
  { slug: "kitchens", label: "Kitchens", order: 2 },
  { slug: "bathrooms", label: "Bathrooms", order: 3 },
  { slug: "basements", label: "Basements", order: 4 },
  { slug: "additions", label: "Additions", order: 5 },
  { slug: "whole-home", label: "Whole Home", order: 6 },
  { slug: "exterior", label: "Exterior", order: 7 },
] as const;

function buildServiceHub({
  slug,
  label,
  order,
}: {
  slug: string;
  label: string;
  order: number;
}): PageRegistryEntry {
  const p = `service.${slug}`;
  return {
    key: `service.${slug}`,
    label: `Service: ${label}`,
    route: `/services/${slug}`,
    order,
    photoSlots: [
      { slotKey: `${p}.hero.image`, label: "Hero photo", hint: "Overrides the per-service hero photo picker from migration 0012." },
    ],
    textBlocks: [
      // Hero
      { blockKey: `${p}.hero.eyebrow`, label: "Hero eyebrow" },
      { blockKey: `${p}.hero.headline`, label: "Hero headline (main phrase, accent color applied)" },
      { blockKey: `${p}.hero.subcopy`, label: "Hero subcopy", multiline: true },
      { blockKey: `${p}.hero.cta.primary`, label: "Hero primary CTA label" },
      { blockKey: `${p}.hero.cta.secondary`, label: "Hero secondary CTA label" },
      // Gallery
      { blockKey: `${p}.gallery.eyebrow`, label: "Gallery eyebrow" },
      { blockKey: `${p}.gallery.headline`, label: "Gallery headline", multiline: true },
      // FAQ
      { blockKey: `${p}.faq.eyebrow`, label: "FAQ eyebrow" },
      { blockKey: `${p}.faq.headline`, label: "FAQ headline", multiline: true },
      // Financing CTA band
      { blockKey: `${p}.financing.eyebrow`, label: "Financing band eyebrow" },
      { blockKey: `${p}.financing.title`, label: "Financing band title" },
      { blockKey: `${p}.financing.description`, label: "Financing band description", multiline: true },
      { blockKey: `${p}.financing.cta`, label: "Financing band CTA label" },
      // Final CTA band
      { blockKey: `${p}.final.eyebrow`, label: "Final CTA eyebrow" },
      { blockKey: `${p}.final.headline`, label: "Final CTA headline", multiline: true },
      { blockKey: `${p}.final.subcopy`, label: "Final CTA subcopy", multiline: true },
      { blockKey: `${p}.final.cta.primary`, label: "Final CTA primary label" },
      { blockKey: `${p}.final.cta.secondary`, label: "Final CTA secondary label" },
    ],
  };
}

const SERVICE_ENTRIES = Object.fromEntries(
  SERVICE_SLUGS.map((s) => [`service.${s.slug}`, buildServiceHub(s)])
);

// -- PROCESS PAGE ------------------------------------------------------------

const PROCESS: PageRegistryEntry = {
  key: "process",
  label: "Process",
  route: "/process",
  order: 8,
  photoSlots: [
    { slotKey: "process.hero.image", label: "Hero photo", hint: "Right column of the hero. Aspect 4/3." },
    { slotKey: "process.step.01.image", label: "Step 01 photo (Reach out)" },
    { slotKey: "process.step.02.image", label: "Step 02 photo (Discovery appointment)" },
    { slotKey: "process.step.03.image", label: "Step 03 photo (Estimate preparation)" },
    { slotKey: "process.step.06.image", label: "Step 06 photo (Material selection)" },
    { slotKey: "process.step.09.image", label: "Step 09 photo (The Work)" },
    { slotKey: "process.step.10.image", label: "Step 10 photo (Final walkthrough)" },
  ],
  textBlocks: [
    // Hero
    { blockKey: "process.hero.eyebrow", label: "Hero eyebrow (large orange 'Our Process')" },
    { blockKey: "process.hero.headline", label: "Hero headline", multiline: true },
    { blockKey: "process.hero.subcopy", label: "Hero subcopy (intro to team roles)", multiline: true },
    { blockKey: "process.hero.cta", label: "Hero CTA button label" },
    // Phase labels
    { blockKey: "process.phase.getting-started", label: "Phase label: Getting started" },
    { blockKey: "process.phase.after-signing", label: "Phase label: After signing" },
    // Ten steps (title + body each)
    { blockKey: "process.step.01.title", label: "Step 01 title" },
    { blockKey: "process.step.01.body", label: "Step 01 body", multiline: true },
    { blockKey: "process.step.02.title", label: "Step 02 title" },
    { blockKey: "process.step.02.body", label: "Step 02 body", multiline: true },
    { blockKey: "process.step.03.title", label: "Step 03 title" },
    { blockKey: "process.step.03.body", label: "Step 03 body", multiline: true },
    { blockKey: "process.step.04.title", label: "Step 04 title" },
    { blockKey: "process.step.04.body", label: "Step 04 body", multiline: true },
    { blockKey: "process.step.05.title", label: "Step 05 title" },
    { blockKey: "process.step.05.body", label: "Step 05 body", multiline: true },
    { blockKey: "process.step.06.title", label: "Step 06 title" },
    { blockKey: "process.step.06.body", label: "Step 06 body", multiline: true },
    { blockKey: "process.step.06.badge", label: "Step 06 'What sets us apart' pill" },
    { blockKey: "process.step.07.title", label: "Step 07 title" },
    { blockKey: "process.step.07.body", label: "Step 07 body", multiline: true },
    { blockKey: "process.step.08.title", label: "Step 08 title" },
    { blockKey: "process.step.08.body", label: "Step 08 body", multiline: true },
    { blockKey: "process.step.09.title", label: "Step 09 title" },
    { blockKey: "process.step.09.body", label: "Step 09 body", multiline: true },
    { blockKey: "process.step.10.title", label: "Step 10 title" },
    { blockKey: "process.step.10.body", label: "Step 10 body", multiline: true },
    // Final CTA strip
    { blockKey: "process.final.headline", label: "Final CTA headline" },
    { blockKey: "process.final.subcopy", label: "Final CTA subcopy", multiline: true },
    { blockKey: "process.final.cta", label: "Final CTA button label" },
  ],
};

// -- WARRANTY PAGE -----------------------------------------------------------

const WARRANTY: PageRegistryEntry = {
  key: "warranty",
  label: "Warranty",
  route: "/warranty",
  order: 9,
  photoSlots: [],
  textBlocks: [
    // Hero
    { blockKey: "warranty.hero.eyebrow", label: "Hero eyebrow" },
    { blockKey: "warranty.hero.headline", label: "Hero headline", multiline: true },
    { blockKey: "warranty.hero.subcopy", label: "Hero subcopy", multiline: true },
    { blockKey: "warranty.hero.cta.primary", label: "Hero primary CTA label" },
    { blockKey: "warranty.hero.cta.secondary", label: "Hero secondary CTA label" },
    // Coverage section
    { blockKey: "warranty.coverage.headline", label: "Coverage section headline", multiline: true },
    { blockKey: "warranty.coverage.intro", label: "Coverage section intro", multiline: true },
    // Conditions section
    { blockKey: "warranty.conditions.headline", label: "Conditions section headline", multiline: true },
    { blockKey: "warranty.conditions.intro", label: "Conditions section intro", multiline: true },
    // Claim / filing section
    { blockKey: "warranty.filing.headline", label: "Filing a claim: headline", multiline: true },
    { blockKey: "warranty.filing.intro", label: "Filing a claim: intro", multiline: true },
    // FAQ headline
    { blockKey: "warranty.faq.headline", label: "Warranty FAQ headline" },
    // Final CTA strip
    { blockKey: "warranty.final.headline", label: "Final CTA headline", multiline: true },
    { blockKey: "warranty.final.subcopy", label: "Final CTA subcopy" },
    { blockKey: "warranty.final.cta.primary", label: "Final CTA primary label" },
    { blockKey: "warranty.final.cta.secondary", label: "Final CTA secondary label" },
  ],
};

// -- CONSULTATION PAGE -------------------------------------------------------

const CONSULTATION: PageRegistryEntry = {
  key: "consultation",
  label: "Consultation",
  route: "/consultation",
  order: 10,
  photoSlots: [],
  textBlocks: [
    // Hero
    { blockKey: "consultation.hero.eyebrow", label: "Hero eyebrow" },
    { blockKey: "consultation.hero.headline", label: "Hero headline (accent phrase applied)", multiline: true },
    { blockKey: "consultation.hero.subcopy", label: "Hero subcopy", multiline: true },
    // What to expect column
    { blockKey: "consultation.expect.eyebrow", label: "'What to expect' eyebrow" },
    { blockKey: "consultation.expect.headline", label: "'What to expect' headline", multiline: true },
    { blockKey: "consultation.expect.subcopy", label: "'What to expect' subcopy", multiline: true },
    // Financing sidecard
    { blockKey: "consultation.financing.eyebrow", label: "Financing sidecard eyebrow" },
    { blockKey: "consultation.financing.title", label: "Financing sidecard title" },
    { blockKey: "consultation.financing.subcopy", label: "Financing sidecard subcopy", multiline: true },
    { blockKey: "consultation.financing.cta", label: "Financing sidecard CTA label" },
  ],
};

// -- CONTACT PAGE ------------------------------------------------------------
// Rule 25: Otsego shop is display-only and stays out of the editable surface.
// The Maple Grove office is the NAP-of-record and also stays hard-coded so
// admin edits cannot break structured data / schema.org alignment.

const CONTACT: PageRegistryEntry = {
  key: "contact",
  label: "Contact",
  route: "/contact",
  order: 11,
  photoSlots: [],
  textBlocks: [
    // Hero
    { blockKey: "contact.hero.eyebrow", label: "Hero eyebrow" },
    { blockKey: "contact.hero.headline", label: "Hero headline", multiline: true },
    { blockKey: "contact.hero.subcopy", label: "Hero subcopy", multiline: true },
    // Left column: business info
    { blockKey: "contact.phone.eyebrow", label: "Phone callout eyebrow" },
    { blockKey: "contact.phone.subcopy", label: "Phone callout subcopy" },
    { blockKey: "contact.address.eyebrow", label: "Visit / address eyebrow" },
    { blockKey: "contact.hours.eyebrow", label: "Hours eyebrow" },
    { blockKey: "contact.service-area.eyebrow", label: "Service area eyebrow" },
    { blockKey: "contact.service-area.subcopy", label: "Service area subcopy", multiline: true },
    { blockKey: "contact.service-area.footnote", label: "Service area footnote" },
    // Ready-to-start card
    { blockKey: "contact.ready.eyebrow", label: "'Ready to start' card eyebrow" },
    { blockKey: "contact.ready.headline", label: "'Ready to start' card headline" },
    { blockKey: "contact.ready.cta", label: "'Ready to start' CTA label" },
    // Right column: form intro
    { blockKey: "contact.form.eyebrow", label: "Form column eyebrow" },
    { blockKey: "contact.form.headline", label: "Form column headline", multiline: true },
    { blockKey: "contact.form.subcopy", label: "Form column subcopy", multiline: true },
  ],
};

// -- TEAM PAGE ---------------------------------------------------------------
// The team roster itself is structural data (still hard-coded, not editable
// this PR). Copy around the roster is editable.

const TEAM: PageRegistryEntry = {
  key: "team",
  label: "Team",
  route: "/team",
  order: 12,
  photoSlots: [
    { slotKey: "team.why.image", label: "'Why M.R.' section photo", hint: "Portrait aspect 4/5. Replaces /images/about-team.jpg." },
  ],
  textBlocks: [
    // Hero
    { blockKey: "team.hero.eyebrow", label: "Hero eyebrow" },
    { blockKey: "team.hero.headline", label: "Hero headline" },
    { blockKey: "team.hero.subcopy", label: "Hero subcopy", multiline: true },
    // Intro band
    { blockKey: "team.intro.headline", label: "Intro band headline" },
    { blockKey: "team.intro.subcopy", label: "Intro band subcopy", multiline: true },
    // Crew section label
    { blockKey: "team.crew.label", label: "Crew section label" },
    // Why M.R.
    { blockKey: "team.why.eyebrow", label: "'Why M.R.' eyebrow" },
    { blockKey: "team.why.headline", label: "'Why M.R.' headline (accent phrase applied)", multiline: true },
    { blockKey: "team.why.subcopy", label: "'Why M.R.' intro subcopy", multiline: true },
    // Closing CTA (join us)
    { blockKey: "team.join.eyebrow", label: "Closing CTA eyebrow" },
    { blockKey: "team.join.headline", label: "Closing CTA headline" },
    { blockKey: "team.join.subcopy", label: "Closing CTA subcopy", multiline: true },
    { blockKey: "team.join.cta", label: "Closing CTA button label" },
    // Apply section
    { blockKey: "team.apply.eyebrow", label: "'Apply Now' eyebrow" },
    { blockKey: "team.apply.headline", label: "'Apply Now' headline" },
    { blockKey: "team.apply.subcopy", label: "'Apply Now' subcopy", multiline: true },
  ],
};

// -- CAREERS PAGE ------------------------------------------------------------
// The listings themselves come from the DB (getActiveJobListings); this only
// covers the surrounding copy.

const CAREERS: PageRegistryEntry = {
  key: "careers",
  label: "Careers",
  route: "/careers",
  order: 13,
  photoSlots: [],
  textBlocks: [
    // Hero
    { blockKey: "careers.hero.eyebrow", label: "Hero eyebrow" },
    { blockKey: "careers.hero.headline", label: "Hero headline" },
    { blockKey: "careers.hero.subcopy", label: "Hero subcopy", multiline: true },
    // Empty state (no jobs)
    { blockKey: "careers.empty.headline", label: "'No open positions' headline" },
    // Empty-state body kept structural because it embeds a mailto link.
    // Has-jobs state
    { blockKey: "careers.list.headline", label: "'Open positions' headline" },
    { blockKey: "careers.apply.cta", label: "Per-listing apply CTA label" },
  ],
};

// -- REGISTRY (exported) -----------------------------------------------------

export const PAGE_REGISTRY: Record<string, PageRegistryEntry> = {
  home: HOME,
  ...SERVICE_ENTRIES,
  process: PROCESS,
  warranty: WARRANTY,
  consultation: CONSULTATION,
  contact: CONTACT,
  team: TEAM,
  careers: CAREERS,
  // PR #113 adds resources, financing, legal
};

export function getPageEntry(key: string): PageRegistryEntry | undefined {
  return PAGE_REGISTRY[key];
}

export function listPages(): PageRegistryEntry[] {
  return Object.values(PAGE_REGISTRY).sort((a, b) => a.order - b.order);
}
