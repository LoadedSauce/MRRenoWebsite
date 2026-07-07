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

  // ── EXTERIOR ────────────────────────────────────────────────────────────
  // NOTE: dollar ranges below are MN-market starting figures pending Chris's
  // confirmation against M.R.'s actual exterior pricing. Timeline + licensing
  // mirror the already-published /services/exterior page (no new claims).
  {
    slug: "exterior",
    title: "How Much Does Exterior Work Cost in Minnesota?",
    dek: "Roofing, siding, window, and deck cost ranges for the northwest Twin Cities metro -- broken out by service, since exterior work covers four very different projects with their own budgets and timelines.",
    category: "Cost Guide",
    gated: false,
    published: true,
    datePublished: "2026-07-07",
    metaTitle: "Roofing, Siding & Exterior Cost in Minnesota | M.R. Renovations",
    metaDescription:
      "Real roofing, siding, window, and deck cost ranges from a Maple Grove, MN contractor with 43+ years experience. Storm restoration, free no-gimmick estimates, lifetime warranty.",
    cta: {
      label: "See our roofing, siding & exterior work",
      href: "/services/exterior",
    },
    body: [
      {
        type: "prose",
        paragraphs: [
          "M.R. Renovations' exterior projects across Maple Grove and the northwest Twin Cities metro generally run from about $9,000 for a straightforward roof replacement to $60,000 or more for a full exterior package that combines roofing, siding, windows, and a deck. Because \"exterior work\" spans four very different services -- each with its own materials, labor, and timeline -- the ranges below are broken out by service rather than by a single scope ladder.",
          "Where your project lands depends on the size and complexity of your home, the materials you choose, how much of the old surface has to come off, and whether storm damage is involved. This guide walks through each service, what moves the price, how to choose materials that hold up to Minnesota winters, and how storm-damage insurance claims work in this state.",
        ],
      },
      {
        type: "costTiers",
        heading: "Cost by service",
        tiers: [
          {
            label: "Roofing",
            range: "$9,000--$28,000",
            description:
              "Tear-off and full replacement of an asphalt shingle roof on a typical northwest-metro home, including underlayment, flashing, and ventilation. Steep or complex rooflines, added stories, and premium or metal systems run higher.",
          },
          {
            label: "Siding",
            range: "$18,000--$50,000",
            description:
              "Full-house James Hardie fiber cement or engineered lap siding with new house wrap, trim, soffit, and fascia. Larger two-story homes and full ColorPlus packages run toward the top of the range.",
          },
          {
            label: "Windows & Doors",
            range: "$12,000--$40,000+",
            description:
              "Full-house replacement of roughly 10 to 20 Marvin windows rated for Minnesota's climate, plus entry or patio doors. Custom sizes and specialty shapes run higher.",
          },
          {
            label: "Decks",
            range: "$12,000--$45,000+",
            description:
              "A new Trex composite deck with aluminum or cable railing and code-compliant framing and footings. Elevated, multi-level, or large decks run toward the top of the range.",
          },
        ],
        note: "Most homeowners bundle two or more of these -- roof and siding together after a storm is the most common exterior package we complete. Storm damage is often covered by insurance, and we coordinate directly with your adjuster.",
      },
      {
        type: "cta",
        heading: "Get a Free No-Gimmick Estimate",
        body: "Talk through your roof, siding, windows, or deck with a team that has been protecting northwest metro homes for over 40 years.",
        label: "Schedule a free consultation",
        href: "/consultation",
        phone: PHONE,
      },
      {
        type: "prose",
        heading: "What drives the price",
        paragraphs: [
          "Exterior pricing comes down to four shared levers -- the material tier you choose, the size and complexity of the surface, whatever hidden damage turns up once the old material is off, and the permits your city requires. How each one plays out differs by service.",
          "Roofing. Cost scales with roof area (measured in squares) and pitch -- a steep, cut-up roof with valleys, dormers, skylights, and multiple chimneys takes far more labor and flashing than a simple gable. Tearing off multiple old layers, replacing rotted decking, and adding the code-required ice-and-water shield that guards against Minnesota ice dams all add up, and the shingle line -- architectural asphalt versus designer or standing-seam metal -- sets the material floor.",
          "Siding. Wall square footage and the number of stories, corners, and window openings drive the labor, since every penetration means cutting and trim. Fiber cement (James Hardie) costs more than vinyl but lasts decades in this climate; a factory ColorPlus finish, new house wrap, added foam insulation, and the soffit, fascia, and trim scope all move the number -- as does replacing any sheathing that has rotted behind the old siding.",
          "Windows and doors. Price tracks the opening count and the frame and glass package -- vinyl versus fiberglass versus Marvin wood-clad, and double- versus triple-pane Low-E glass built for Minnesota winters. Full-frame replacement costs more than a pocket insert but lets us fix rot and re-flash the opening; custom sizes, specialty shapes, and patio or entry doors each carry a premium.",
          "Decks. Square footage and height set the base -- an elevated or multi-level deck needs deeper frost footings (Minnesota's frost line runs about 42 inches), more framing, stairs, and code-compliant guardrails. Composite boards (Trex) with aluminum or cable railing cost more than pressure-treated wood but last far longer, and built-ins like benches, lighting, pergolas, or skirting each add to the total.",
          "Two factors cut across all four: hidden repairs -- rot in sheathing, fascia, or rim joists that only surfaces once the old material is off -- and timing. Storm-damage roofing and siding are frequently offset by an insurance claim, and we coordinate directly with your adjuster.",
        ],
      },
      {
        type: "breakdown",
        heading: "Where the money goes",
        note: "Directional shares of a typical exterior project -- roofing skews toward labor and disposal, while windows and Hardie siding skew toward materials.",
        items: [
          { label: "Materials", share: "40--50%" },
          { label: "Labor", share: "30--40%" },
          { label: "Tear-off & disposal", share: "5--10%" },
          { label: "Permits & inspections", share: "3--5%" },
          { label: "Contingency (hidden repairs)", share: "8--12%" },
        ],
      },
      {
        type: "prose",
        heading: "Choosing materials that hold up to Minnesota winters",
        paragraphs: [
          "In Minnesota, material choice is as much about surviving freeze-thaw cycles, ice dams, hail, and 90-degree summer-to-winter temperature swings as it is about looks. Spending a little more up front on climate-rated materials usually lowers what you spend on repairs and energy over the life of the home.",
          "Roofing. Architectural (dimensional) asphalt shingles are the northwest-metro default -- they carry higher wind and impact ratings than old 3-tab shingles and typically last 25 to 30 years. Systems from manufacturers like GAF pair the shingle with ice-and-water shield at the eaves and valleys, proper ridge ventilation, and optional impact-resistant (Class 4) shingles that can earn an insurance discount. Standing-seam metal costs more up front but sheds snow, resists ice dams, and can last 40 to 50 years.",
          "Siding. Vinyl is the lowest-cost option but can grow brittle in deep cold and fade over time. James Hardie fiber cement is engineered for cold, wet climates -- it resists moisture, pests, and warping, holds its factory ColorPlus finish for 15-plus years, and stands up well to hail and fire. Engineered wood products such as LP SmartSide sit between the two on price. Whatever the cladding, it is the house wrap and flashing behind it that actually keep a Minnesota wall dry.",
          "Windows. Double-pane Low-E glass with argon fill is the practical baseline for Minnesota; triple-pane adds insulation and noise reduction and makes the most sense on north- and west-facing walls that take the winter wind. Vinyl frames offer the best value, while fiberglass and wood-clad frames (such as Marvin) add durability and a higher-end look. Check the U-factor -- the lower the number, the better the window holds heat in a Minnesota January.",
          "Decks. Pressure-treated pine is the budget choice but needs regular sealing and can check and splinter after a few Minnesota winters. Composite decking (Trex and similar) costs more up front but shrugs off moisture, fading, and freeze-thaw with almost no maintenance, which is why most homeowners planning to stay in the home choose it. Aluminum and cable railings also outlast wood by years in this climate.",
        ],
      },
      {
        type: "prose",
        heading: "Storm damage, hail, and insurance claims",
        paragraphs: [
          "Minnesota sees regular hail and high-wind events, and storm damage is one of the most common reasons homeowners here replace a roof or siding. If a storm has damaged your home, much of the cost may be covered by your homeowner's insurance rather than paid out of pocket -- which can change the math on the ranges above entirely.",
          "It helps to note the date of the storm, photograph any visible damage, and have a contractor inspect the roof and siding before you file. M.R. Renovations provides a written inspection, meets your insurance adjuster on-site, and supplies certificates of insurance for the claim. We hold Minnesota Residential Contractor license BC809200 and pull every required permit.",
          "One caution: be wary of any contractor who offers to waive or \"eat\" your insurance deductible, or who pressures you to sign before an adjuster has seen the damage. Both are red flags -- and waiving a deductible is illegal in Minnesota. A reputable contractor documents the real scope and lets the claim run its course.",
        ],
      },
      {
        type: "prose",
        heading: "Timeline",
        paragraphs: [
          "Single-trade exterior projects -- a roof, siding, windows, or a deck on their own -- typically run one to three weeks, weather permitting. A full exterior package that combines several of these, plus any structural repair uncovered along the way, typically runs three to eight weeks. You receive a written schedule before work begins, and weather-related adjustments are communicated in advance.",
        ],
      },
      {
        type: "gallery",
        heading: "Recent exterior projects",
        images: [
          {
            src: "/images/exterior/mr-renovations-exterior-01.jpg",
            alt: "Complete roof replacement with architectural asphalt shingles on a two-story home",
          },
          {
            src: "/images/exterior/mr-renovations-exterior-02.jpg",
            alt: "James Hardie fiber cement siding installation with new trim and fascia",
          },
          {
            src: "/images/exterior/mr-renovations-exterior-03.jpg",
            alt: "Trex composite deck with aluminum railing off the back of a home",
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
            question: "How much does exterior work cost in Minnesota?",
            answer:
              "It depends on the service: roughly $9,000 to $28,000 for a roof, $18,000 to $50,000 for full siding, $12,000 to $40,000 or more for windows and doors, and $12,000 to $45,000 or more for a composite deck.",
          },
          {
            question: "How much does it cost to replace a roof in Minnesota?",
            answer:
              "A full asphalt shingle roof replacement on a typical northwest-metro home runs about $9,000 to $28,000, depending on roof size, pitch, the number of old layers torn off, and whether any decking needs replacing. Standing-seam metal and steep or complex rooflines run higher.",
          },
          {
            question: "How much does James Hardie siding cost?",
            answer:
              "Full-house James Hardie fiber cement siding typically runs $18,000 to $50,000 installed, depending on the size and number of stories, the trim and soffit scope, and whether sheathing behind the old siding needs repair. It costs more than vinyl but lasts far longer in Minnesota's climate.",
          },
          {
            question: "Are triple-pane windows worth it in Minnesota?",
            answer:
              "For many homes, double-pane Low-E windows with argon fill are the practical baseline. Triple-pane adds insulation and noise reduction and pays off most on north- and west-facing walls exposed to winter wind. The right choice depends on your home's orientation and how long you plan to stay.",
          },
          {
            question: "Is a composite deck worth it compared to wood?",
            answer:
              "Composite decking such as Trex costs more up front than pressure-treated wood but needs almost no maintenance and handles Minnesota freeze-thaw without checking, splintering, or annual sealing. For homeowners who plan to stay in the home, it usually costs less over the life of the deck.",
          },
          {
            question: "Will insurance cover my roof or siding?",
            answer:
              "Storm damage is often covered. We coordinate directly with your insurance adjuster and can provide certificates of insurance for the claim. M.R. Renovations holds Minnesota Residential Contractor license BC809200.",
          },
          {
            question:
              "When is the best time of year for exterior work in Minnesota?",
            answer:
              "Roofing, siding, and decks are typically installed spring through fall, though roofing can often be done in mild winter stretches. Scheduling in late winter or early spring usually means more flexible timing before the summer rush, and storm-damage work is handled year-round.",
          },
          {
            question: "Does new siding or new windows add value to my home?",
            answer:
              "Exterior projects consistently return a large share of their cost at resale because they improve curb appeal, energy efficiency, and buyer confidence. A new roof, new siding, and updated windows are among the improvements buyers notice first.",
          },
          {
            question: "How long does an exterior project take?",
            answer:
              "Single-trade projects -- a roof, siding, windows, or a deck on their own -- typically run one to three weeks, weather permitting. A full exterior package runs three to eight weeks.",
          },
          {
            question: "Do exterior projects require a permit in Minnesota?",
            answer:
              "Roofing, siding, window, and structural work typically require building permits, which vary by municipality. A licensed contractor pulls the required permits and schedules the inspections.",
          },
          {
            question:
              "How do I verify an exterior contractor is licensed in Minnesota?",
            answer:
              "Use the Minnesota DLI license lookup to confirm an active Residential Building Contractor license -- M.R. Renovations holds BC809200 -- and that the legal business name matches your contract.",
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
