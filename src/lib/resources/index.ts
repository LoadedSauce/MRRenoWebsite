// src/lib/resources/index.ts
//
// Single source of truth for the Resources hub (P1.43). The listing page,
// the [slug] template, sitemap.ts, and llms.txt all read from this registry
// so the surfaces can never drift (same lesson as live-tier3.ts / P1.37).
//
// Content is authored as structured TS (no MDX -- the repo has no markdown
// toolchain and adding one is a separate dependency decision). Each resource
// is either an ungated blog-style post or a gated cost guide, driven by the
// `gated` flag. Gated posts render an email-capture form that writes to the
// guide_requests table.
//
// NOTE (P1.43): the posts below are placeholders that prove the template
// end-to-end. Filler copy only -- real cost-guide content is a later ticket.

export interface ResourceSection {
  heading?: string;
  paragraphs: string[];
}

export interface Resource {
  slug: string;
  title: string;
  dek: string; // short hero subtitle; also used as the meta description
  category: string; // e.g. "Cost Guide", "Planning"
  gated: boolean;
  published: boolean;
  datePublished: string; // ISO date, e.g. "2026-07-01"
  dateModified?: string; // ISO date; falls back to datePublished
  cta: {
    label: string;
    href: string; // links to a relevant Tier 2/3 service or city page
  };
  body: ResourceSection[];
}

const RESOURCES: Resource[] = [
  {
    slug: "planning-your-kitchen-remodel",
    title: "Planning Your Kitchen Remodel",
    dek: "A plain-language walkthrough of how a kitchen remodel comes together, from first sketch to final walkthrough, so you know what to expect at every step.",
    category: "Planning",
    gated: false,
    published: true,
    datePublished: "2026-07-01",
    cta: {
      label: "Explore kitchen remodeling",
      href: "/services/kitchens",
    },
    body: [
      {
        paragraphs: [
          "This is placeholder copy that demonstrates the ungated resource layout. It renders straight through with no email gate, the same way a standard blog-style post will once real content is authored.",
        ],
      },
      {
        heading: "Start with how you use the room",
        paragraphs: [
          "Before layouts and finishes, a good remodel starts with how the household actually cooks, gathers, and stores things. That is the placeholder stand-in for real planning guidance.",
          "A second paragraph keeps the template honest about spacing and rhythm across multiple blocks of body copy.",
        ],
      },
      {
        heading: "What to expect on timeline",
        paragraphs: [
          "Filler copy describing a typical sequence of design, selections, and build phases would live here in the shipped version of this guide.",
        ],
      },
    ],
  },
  {
    slug: "kitchen-remodel-cost-guide",
    title: "Kitchen Remodel Cost Guide",
    dek: "See the real cost ranges behind a Twin Cities kitchen remodel -- what drives the budget, where the money goes, and how to plan for it without surprises.",
    category: "Cost Guide",
    gated: true,
    published: true,
    datePublished: "2026-07-01",
    cta: {
      label: "See kitchen remodeling in Maple Grove",
      href: "/services/kitchens/maple-grove",
    },
    body: [
      {
        paragraphs: [
          "This is placeholder copy that demonstrates the gated resource layout. Because this post is marked gated, the page shows an email-capture form before the full guide, and the submission is stored in the guide_requests table.",
        ],
      },
      {
        heading: "What is inside the full guide",
        paragraphs: [
          "The shipped version will break down cost ranges by scope, the line items that move a budget the most, and how allowances are handled. For now this is filler copy proving the gated branch renders.",
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
