// src/lib/resources/index.ts
//
// Single source of truth for the Resources hub (P1.43 template, P1.44 content).
// The listing page, the [slug] template, sitemap.ts, and llms.txt all read from
// this registry so the surfaces can never drift (same lesson as live-tier3.ts /
// P1.37).
//
// Content is authored as structured TS blocks (no MDX -- the repo has no
// markdown toolchain and adding one is a separate dependency decision). Each
// resource is either an ungated post or a gated cost guide, driven by the
// `gated` flag. Gated posts render an email-capture form after a teaser; the
// submission is stored in the guide_requests table.
//
// The four cost guides below (kitchens/bathrooms/basements/additions) are the
// real P1.44 content and are ungated -- no dependency on the held guide_requests
// migration. Whole-Home and Exterior guides are intentionally NOT in this batch
// (held pending Chris/Mike input on categorization and scope tiers).
//
// COST FIGURES: only published ranges appear here. Do NOT add an exact
// per-project average anywhere in this file.

/** A single content block in a resource body. Discriminated on `type`. */
export type ResourceBlock =
  | { type: "prose"; heading?: string; paragraphs: string[] }
  | {
      type: "costTiers";
      heading?: string;
      /** Optional closing note under the tiers, e.g. where most projects land. */
      note?: string;
      tiers: { label: string; range: string; description: string }[];
    }
  | {
      type: "breakdown";
      heading?: string;
      note?: string;
      /** Directional line-item shares of a typical project budget. */
      items: { label: string; share: string }[];
    }
  | {
      type: "faq";
      heading?: string;
      /** `answer` MUST match the FAQPage JSON-LD text exactly (same array). */
      items: { question: string; answer: string }[];
    }
  | {
      type: "gallery";
      heading?: string;
      /** Placeholder paths until real assets land; alt is authored now. */
      images: { src: string; alt: string }[];
    }
  | {
      type: "cta";
      heading: string;
      body?: string;
      label: string;
      href: string;
      phone?: string;
    };

export interface Resource {
  slug: string;
  title: string;
  dek: string; // short hero subtitle
  category: string; // e.g. "Cost Guide", "Planning"
  gated: boolean;
  published: boolean;
  datePublished: string; // ISO date, e.g. "2026-07-01"
  dateModified?: string; // ISO date; falls back to datePublished
  /** Override the derived <title>. Include the brand suffix yourself. */
  metaTitle?: string;
  /** Override the meta description (defaults to `dek`). */
  metaDescription?: string;
  /** Bottom-of-page CTA -- links to a relevant Tier 2/3 service or city page. */
  cta: {
    label: string;
    href: string;
  };
  body: ResourceBlock[];
}

const PHONE = "763-900-2024";

const MR_DIFFERENCE =
  "Lifetime Transferable Workmanship Warranty. Free No-Gimmick Estimates. " +
  "BBB accredited, family-owned, and 43+ years serving the northwest Twin " +
  "Cities metro.";

const RESOURCES: Resource[] = [
  // ── KITCHEN ─────────────────────────────────────────────────────────────
  {
    slug: "kitchens",
    title: "How Much Does a Kitchen Remodel Cost in Minnesota?",
    dek: "See what a kitchen remodel actually costs in the northwest Twin Cities metro -- the scope tiers, what moves the budget most, and how to plan before you request a quote.",
    category: "Cost Guide",
    gated: false,
    published: true,
    datePublished: "2026-07-01",
    metaTitle: "Kitchen Remodel Cost in Minnesota | M.R. Renovations",
    metaDescription:
      "See real kitchen remodel cost ranges from a Maple Grove, MN contractor with 43+ years experience. Free no-gimmick estimates, lifetime warranty.",
    cta: {
      label: "See kitchen remodeling examples",
      href: "/services/kitchens",
    },
    body: [
      {
        type: "prose",
        paragraphs: [
          "In the Maple Grove and northwest metro area, kitchen remodel costs typically range from $25,000 to $175,000 or more, depending on cabinetry, layout changes, and finish level. Below is a breakdown of what drives that range so you can see roughly where your project fits before you request a quote.",
        ],
      },
      {
        type: "costTiers",
        heading: "Cost by scope",
        tiers: [
          {
            label: "Defined-Scope Refresh",
            range: "$25,000--$45,000",
            description:
              "Cabinet refacing or repaint, new hardware, new countertops and backsplash on the same footprint, and an appliance swap -- no layout or plumbing changes.",
          },
          {
            label: "Full Remodel",
            range: "$55,000--$95,000",
            description:
              "New semi-custom cabinetry, layout adjustments within the existing footprint, new countertops, flooring, lighting, and appliances, plus minor plumbing or electrical relocation.",
          },
          {
            label: "Premium Custom",
            range: "$100,000--$175,000+",
            description:
              "Full layout change, wall removal, custom cabinetry, premium countertop material, professional-grade appliances, and structural work or footprint expansion.",
          },
        ],
        note: "Most of the kitchen projects we complete land in the Full Remodel to Premium Custom range -- kitchens tend to be a homeowner's flagship remodel, not a quick refresh.",
      },
      {
        type: "cta",
        heading: "Get a Free No-Gimmick Estimate",
        body: "Talk through your kitchen with a team that has been remodeling northwest metro homes for over 40 years.",
        label: "Schedule a free consultation",
        href: "/consultation",
        phone: PHONE,
      },
      {
        type: "prose",
        heading: "What drives the price",
        paragraphs: [
          "Layout changes are the single biggest swing -- moving a sink, range, or island relocates plumbing and gas lines. After that, cabinetry tier is the largest single line item, followed by countertop and appliance tier, and any structural changes such as wall removal or footprint expansion.",
        ],
      },
      {
        type: "breakdown",
        heading: "Where the money goes",
        note: "Directional shares of a typical kitchen budget -- your project will vary.",
        items: [
          { label: "Cabinetry", share: "30--35%" },
          { label: "Labor", share: "20--25%" },
          { label: "Countertops & backsplash", share: "10--12%" },
          { label: "Appliances", share: "10--15%" },
          { label: "Flooring & lighting", share: "8--10%" },
          { label: "Permits & design", share: "4--6%" },
          { label: "Contingency", share: "8--10%" },
        ],
      },
      {
        type: "prose",
        heading: "Timeline",
        paragraphs: [
          "Most kitchen remodels run 4 to 8 weeks from demolition to final walkthrough. Cabinetry lead times -- 8 to 16 weeks for semi-custom or custom -- are the most common source of delay, so they are ordered early in the process.",
        ],
      },
      {
        type: "gallery",
        heading: "Recent kitchens",
        images: [
          {
            src: "/images/kitchen/mr-renovations-kitchen-01.jpg",
            alt: "Kitchen remodel with navy island, quartz countertops, and stainless appliances",
          },
          {
            src: "/images/kitchen/mr-renovations-kitchen-02.jpg",
            alt: "Full custom kitchen remodel, open-concept after wall removal",
          },
          {
            src: "/images/kitchen/mr-renovations-kitchen-03.jpg",
            alt: "Custom kitchen cabinetry and tile backsplash detail",
          },
        ],
      },
      {
        type: "prose",
        heading: "The M.R. difference",
        paragraphs: [MR_DIFFERENCE],
      },
      {
        type: "faq",
        heading: "Frequently asked questions",
        items: [
          {
            question: "How much does a kitchen remodel cost in Minnesota?",
            answer:
              "Most Minnesota kitchen remodels fall between $25,000 and $175,000, depending on cabinetry, layout changes, and finish level.",
          },
          {
            question: "How long does a kitchen remodel take?",
            answer:
              "Most take 4 to 8 weeks from demolition to completion. Custom cabinetry lead times can extend the timeline if ordered late.",
          },
          {
            question: "Do I need a permit to remodel my kitchen in Minnesota?",
            answer:
              "Most remodels involving plumbing, electrical, or structural changes require a permit. A licensed Minnesota contractor pulls the required permits as part of the project.",
          },
          {
            question:
              "How do I know if a kitchen remodeling contractor is licensed in Minnesota?",
            answer:
              "Look up the contractor through the Minnesota DLI license lookup tool. Confirm the license is active, matches the legal business name on your contract, and is the correct classification.",
          },
          {
            question: "What is the biggest factor in kitchen remodel cost?",
            answer:
              "Cabinetry is typically the largest single line item, followed by whether the layout changes.",
          },
        ],
      },
    ],
  },

  // ── BATHROOM ────────────────────────────────────────────────────────────
  {
    slug: "bathrooms",
    title: "How Much Does a Bathroom Remodel Cost in Minnesota?",
    dek: "Bathroom remodel cost ranges for the northwest Twin Cities metro -- how plumbing, tile scope, and fixture tier move the budget, from a refresh to a primary suite.",
    category: "Cost Guide",
    gated: false,
    published: true,
    datePublished: "2026-07-01",
    metaTitle: "Bathroom Remodel Cost in Minnesota | M.R. Renovations",
    metaDescription:
      "Real bathroom remodel cost ranges from a Maple Grove, MN contractor with 43+ years experience. Free no-gimmick estimates, lifetime warranty.",
    cta: {
      label: "See bathroom remodeling examples",
      href: "/services/bathrooms",
    },
    body: [
      {
        type: "prose",
        paragraphs: [
          "M.R. Renovations' bathroom remodels in the northwest metro typically range from $12,000 to $75,000 or more, depending on plumbing changes, tile scope, and fixture tier. Bathrooms are our highest-volume, most consistently completed service, so the ranges below reflect a lot of finished projects.",
        ],
      },
      {
        type: "costTiers",
        heading: "Cost by scope",
        tiers: [
          {
            label: "Defined-Scope Refresh",
            range: "$12,000--$22,000",
            description:
              "New vanity, toilet, fixtures, and tile on the same footprint, plus fresh paint, lighting, and hardware -- no structural changes.",
          },
          {
            label: "Full Remodel",
            range: "$25,000--$45,000",
            description:
              "Tub-to-shower conversion or full shower rebuild, new floor-to-ceiling tile in the wet area, and minor plumbing relocation.",
          },
          {
            label: "Premium Custom",
            range: "$45,000--$75,000+",
            description:
              "Primary suite with a double vanity, freestanding tub, large-format tile, heated flooring, custom glass enclosure, and a layout change.",
          },
        ],
        note: "Most of the bathroom projects we complete land in the Full Remodel tier -- the most common scope homeowners choose.",
      },
      {
        type: "cta",
        heading: "Get a Free No-Gimmick Estimate",
        body: "Talk through your bathroom with a team that has been remodeling northwest metro homes for over 40 years.",
        label: "Schedule a free consultation",
        href: "/consultation",
        phone: PHONE,
      },
      {
        type: "prose",
        heading: "What drives the price",
        paragraphs: [
          "Plumbing relocation is the single biggest cost lever -- keeping the toilet, sink, and shower in place avoids a lot of labor, permitting, and inspection. After that, tile scope and fixture tier move the budget most, along with any structural or waterproofing needs discovered during demolition.",
        ],
      },
      {
        type: "breakdown",
        heading: "Where the money goes",
        note: "Directional shares of a typical bathroom budget -- your project will vary.",
        items: [
          { label: "Labor", share: "40--50%" },
          { label: "Tile & shower/tub systems", share: "20--25%" },
          { label: "Vanity & cabinetry", share: "10--12%" },
          { label: "Fixtures", share: "8--10%" },
          { label: "Permits & design", share: "4--6%" },
          { label: "Contingency", share: "8--10%" },
        ],
      },
      {
        type: "prose",
        heading: "Timeline",
        paragraphs: [
          "Most bathroom remodels run 3 to 8 weeks depending on scope. A cosmetic refresh lands at the lower end; a full remodel with a layout change trends toward 8 weeks.",
        ],
      },
      {
        type: "gallery",
        heading: "Recent bathrooms",
        images: [
          {
            src: "/images/bathroom/mr-renovations-bathroom-01.jpg",
            alt: "Primary bathroom remodel with freestanding tub and large-format tile",
          },
          {
            src: "/images/bathroom/mr-renovations-bathroom-02.jpg",
            alt: "Walk-in shower conversion with glass enclosure",
          },
          {
            src: "/images/bathroom/mr-renovations-bathroom-03.jpg",
            alt: "Double vanity bathroom remodel with custom tile flooring",
          },
        ],
      },
      {
        type: "prose",
        heading: "The M.R. difference",
        paragraphs: [MR_DIFFERENCE],
      },
      {
        type: "faq",
        heading: "Frequently asked questions",
        items: [
          {
            question: "How much does a bathroom remodel cost in Minnesota?",
            answer:
              "Most fall between $12,000 and $75,000, depending on plumbing changes and finish level.",
          },
          {
            question: "Can I keep costs down by not moving plumbing?",
            answer:
              "Yes. Keeping the toilet, sink, and shower in place avoids the labor, permitting, and inspection costs of relocating pipes.",
          },
          {
            question: "How long does a bathroom remodel take?",
            answer: "Most take 3 to 8 weeks depending on scope.",
          },
          {
            question: "Does a bathroom remodel require a permit in Minnesota?",
            answer:
              "Projects involving plumbing, electrical, or structural changes typically require one. A licensed contractor pulls the required permits.",
          },
          {
            question:
              "What's the difference between a residential remodeler and residential building contractor license in Minnesota?",
            answer:
              "A Residential Remodeler license covers existing structures only; a Residential Building Contractor license covers existing structures and new construction. Either is appropriate for a bathroom remodel.",
          },
        ],
      },
    ],
  },

  // ── BASEMENT ────────────────────────────────────────────────────────────
  {
    slug: "basements",
    title: "How Much Does It Cost to Finish a Basement in Minnesota?",
    dek: "Basement finishing cost ranges for the northwest Twin Cities metro -- how layout, egress, bathrooms, and finish level shape the budget.",
    category: "Cost Guide",
    gated: false,
    published: true,
    datePublished: "2026-07-01",
    metaTitle: "Basement Finishing Cost in Minnesota | M.R. Renovations",
    metaDescription:
      "Real basement finishing cost ranges from a Maple Grove, MN contractor with 43+ years experience. Free no-gimmick estimates, lifetime warranty.",
    cta: {
      label: "See basement finishing examples",
      href: "/services/basements",
    },
    body: [
      {
        type: "prose",
        paragraphs: [
          "M.R. Renovations' basement projects in the northwest metro typically range from $20,000 to $120,000 or more, depending on layout, bathroom additions, and finish level. Basements convert at the highest close rate of any service we offer.",
        ],
      },
      {
        type: "costTiers",
        heading: "Cost by scope",
        tiers: [
          {
            label: "Defined-Scope Finish",
            range: "$20,000--$35,000",
            description:
              "Open rec room or flex space with standard drywall, flooring, and lighting -- no bathroom.",
          },
          {
            label: "Full Remodel",
            range: "$40,000--$65,000",
            description:
              "Multiple defined rooms, an egress window added for a legal bedroom, and a full bathroom added.",
          },
          {
            label: "Premium Custom",
            range: "$70,000--$120,000+",
            description:
              "Home theater, wet bar or kitchenette, custom built-ins, premium flooring, and additional structural or waterproofing work.",
          },
        ],
        note: "Most of the basement projects we complete land in the Full Remodel tier -- a multi-room basement with an added bathroom is the most common scope.",
      },
      {
        type: "cta",
        heading: "Get a Free No-Gimmick Estimate",
        body: "Talk through your basement with a team that has been remodeling northwest metro homes for over 40 years.",
        label: "Schedule a free consultation",
        href: "/consultation",
        phone: PHONE,
      },
      {
        type: "prose",
        heading: "What drives the price",
        paragraphs: [
          "Egress window requirements are a major driver -- any room used as a legal bedroom needs a code-compliant egress window. After that, moisture and waterproofing prep, whether a bathroom is added, and ceiling height and code compliance in older homes move the budget most.",
        ],
      },
      {
        type: "breakdown",
        heading: "Where the money goes",
        note: "Directional shares of a typical basement budget -- your project will vary.",
        items: [
          { label: "Labor", share: "35--40%" },
          { label: "Materials", share: "25--30%" },
          {
            label: "Electrical & plumbing (incl. bathroom rough-in if added)",
            share: "15--20%",
          },
          { label: "Permits & design", share: "4--6%" },
          { label: "Contingency", share: "10--15%" },
        ],
      },
      {
        type: "prose",
        heading: "Timeline",
        paragraphs: [
          "Most basements run 6 to 12 weeks depending on scope. Adding a bathroom, egress window, or waterproofing work extends toward the upper end.",
        ],
      },
      {
        type: "gallery",
        heading: "Recent basements",
        images: [
          {
            src: "/images/basement/mr-renovations-basement-01.jpg",
            alt: "Finished basement rec room with custom built-ins",
          },
          {
            src: "/images/basement/mr-renovations-basement-02.jpg",
            alt: "Basement bathroom addition with walk-in shower",
          },
          {
            src: "/images/basement/mr-renovations-basement-03.jpg",
            alt: "Basement guest bedroom with egress window",
          },
        ],
      },
      {
        type: "prose",
        heading: "The M.R. difference",
        paragraphs: [MR_DIFFERENCE],
      },
      {
        type: "faq",
        heading: "Frequently asked questions",
        items: [
          {
            question: "How much does it cost to finish a basement in Minnesota?",
            answer:
              "Most projects fall between $20,000 and $120,000, depending on layout, bathroom additions, and finish level.",
          },
          {
            question:
              "Do I need an egress window to add a bedroom in my basement?",
            answer:
              "Yes. Minnesota building code requires a code-compliant egress window for any room used as a legal bedroom below grade.",
          },
          {
            question: "How long does it take to finish a basement?",
            answer:
              "Most take 6 to 12 weeks, depending on whether a bathroom or egress window is part of the scope.",
          },
          {
            question: "Does finishing a basement add value to my home?",
            answer:
              "A properly permitted, finished basement typically returns a strong share of its cost at resale and adds functional living space, though exact return varies by home and market.",
          },
          {
            question:
              "What should I ask a Minnesota basement contractor before signing a contract?",
            answer:
              "Confirm their DLI license is active and matches your contract, ask whether they pull permits themselves, and get a written, itemized quote broken down by trade.",
          },
        ],
      },
    ],
  },

  // ── HOME ADDITION ───────────────────────────────────────────────────────
  {
    slug: "additions",
    title: "How Much Does a Home Addition Cost in Minnesota?",
    dek: "Home addition cost ranges for the northwest Twin Cities metro -- ground-level vs. second-story, foundation, and plumbing, from a single room to a full suite.",
    category: "Cost Guide",
    gated: false,
    published: true,
    datePublished: "2026-07-01",
    metaTitle: "Home Addition Cost in Minnesota | M.R. Renovations",
    metaDescription:
      "Real home addition cost ranges from a Maple Grove, MN contractor with 43+ years experience. Free no-gimmick estimates, lifetime warranty.",
    cta: {
      label: "See home addition examples",
      href: "/services/additions",
    },
    body: [
      {
        type: "prose",
        paragraphs: [
          "M.R. Renovations' home addition projects in the northwest metro typically range from $50,000 to $350,000 or more. Additions carry the highest dollar value per project of any service we offer, driven mostly by foundation type and whether you build out or up.",
        ],
      },
      {
        type: "costTiers",
        heading: "Cost by scope",
        tiers: [
          {
            label: "Defined-Scope Addition",
            range: "$50,000--$90,000",
            description:
              "Single-room, ground-level addition (bedroom, office, family room) with minimal or no plumbing, a new foundation section, and an exterior tie-in to match the existing home.",
          },
          {
            label: "Full Remodel Addition",
            range: "$95,000--$160,000",
            description:
              "Larger footprint or a room requiring plumbing, a full HVAC extension and electrical build-out, and a more complex roofline tie-in.",
          },
          {
            label: "Premium Custom / Second-Story",
            range: "$175,000--$350,000+",
            description:
              "Full second-story addition or a primary suite over existing space, structural reinforcement, and complete roof removal and rebuild.",
          },
        ],
        note: "Most of the addition projects we complete are ground-level, single-room additions rather than full second stories.",
      },
      {
        type: "cta",
        heading: "Get a Free No-Gimmick Estimate",
        body: "Talk through your addition with a team that has been remodeling northwest metro homes for over 40 years.",
        label: "Schedule a free consultation",
        href: "/consultation",
        phone: PHONE,
      },
      {
        type: "prose",
        heading: "What drives the price",
        paragraphs: [
          "Foundation type is the biggest factor -- a new ground-level foundation versus structural reinforcement for a second story. Ground-level vs. second-story is roughly double the per-square-foot cost. Plumbing or kitchen inclusion and roofline tie-in complexity round out the major drivers.",
        ],
      },
      {
        type: "breakdown",
        heading: "Where the money goes",
        note: "Directional shares of a typical addition budget -- your project will vary.",
        items: [
          { label: "Labor", share: "35--40%" },
          { label: "Foundation & structural", share: "20--25%" },
          { label: "Exterior finishes", share: "15%" },
          { label: "Interior finish", share: "12--15%" },
          { label: "Permits & design", share: "6--10%" },
        ],
      },
      {
        type: "prose",
        heading: "Timeline",
        paragraphs: [
          "Most home additions run 10 to 16 weeks depending on scope. A single-room, ground-level addition lands toward the shorter end; a second-story addition or one with plumbing extends toward the upper end.",
        ],
      },
      {
        type: "gallery",
        heading: "Recent additions",
        images: [
          {
            src: "/images/additions/mr-renovations-addition-01.jpg",
            alt: "Family room home addition matching the existing siding",
          },
          {
            src: "/images/additions/mr-renovations-addition-02.jpg",
            alt: "Primary suite home addition with vaulted ceiling",
          },
          {
            src: "/images/additions/mr-renovations-addition-03.jpg",
            alt: "Exterior view of a home addition with roofline tied into the existing structure",
          },
        ],
      },
      {
        type: "prose",
        heading: "The M.R. difference",
        paragraphs: [MR_DIFFERENCE],
      },
      {
        type: "faq",
        heading: "Frequently asked questions",
        items: [
          {
            question: "How much does a home addition cost in Minnesota?",
            answer:
              "Most fall between $50,000 and $350,000, depending on whether the addition is ground-level or second-story and whether it includes plumbing.",
          },
          {
            question:
              "Is it cheaper to build a second story or add a ground-level addition?",
            answer:
              "Ground-level additions typically cost less per square foot, since they avoid the structural reinforcement, roof removal, and staircase framing a second story requires. Second-story additions preserve yard space.",
          },
          {
            question: "How long does a home addition take?",
            answer:
              "Most take 10 to 16 weeks. A single-room, ground-level addition lands toward the shorter end.",
          },
          {
            question: "Do I need permits for a home addition in Minnesota?",
            answer:
              "Yes. Any addition that increases square footage requires building permits; second-story additions typically require a structural engineer's review as well.",
          },
          {
            question:
              "How do I verify a home addition contractor is properly licensed in Minnesota?",
            answer:
              "Use the DLI license lookup to confirm an active Residential Building Contractor license and that the legal business name matches your contract.",
          },
        ],
      },
    ],
  },
];

export function getAllResources(): Resource[] {
  return RESOURCES;
}

export function getPublishedResources(): Resource[] {
  return RESOURCES.filter((r) => r.published);
}

export function getResource(slug: string): Resource | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}
