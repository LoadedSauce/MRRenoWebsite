import type { ServiceAreaData } from "./service-area-types";

/**
 * Example ServiceAreaData fixture for Rogers, MN (Priority 1 launch city).
 *
 * Purpose: verify the data shape compiles and give the service template
 * a concrete example to render during development.
 *
 * NOTE: copy here is placeholder-quality. Real per-city copy should be
 * written or reviewed by Chris before any Tier 3 pages go live.
 */
export const rogersServiceArea: ServiceAreaData = {
  citySlug: "rogers",
  cityName: "Rogers",
  stateAbbr: "MN",
  driveTimeText: "About 12 minutes from our Maple Grove office.",
  neighborhoods: ["Elm Creek", "Town Center", "Brockton Crossing", "Diamond Lake"],
  recentProjectExamples: [
    {
      serviceSlug: "kitchens",
      title: "Rogers Kitchen Remodel",
      summary:
        "Custom cherry cabinetry, quartz countertops, and full electrical update in a 1990s two-story.",
    },
    {
      serviceSlug: "basements",
      title: "Rogers Lower Level Finish",
      summary:
        "Egress window addition, full bath rough-in, and home theater framing for a growing family.",
    },
    {
      serviceSlug: "additions",
      title: "Rogers Primary Suite Addition",
      summary:
        "400-square-foot main-floor addition with private bath and walk-in closet, fully permitted through the City of Rogers.",
    },
  ],
  heroBlurb:
    "M.R. Renovations has completed projects across Rogers for more than two decades. We pull permits directly with the City of Rogers, know the local housing stock, and have references throughout the community.",
  faqOverrides: [
    {
      question: "Do you work in Rogers, MN?",
      answer:
        "Yes. Rogers is one of our primary service cities. We complete kitchen, bathroom, basement, and whole-home projects there regularly, and we pull permits directly with the City of Rogers.",
    },
    {
      question: "How far is M.R. Renovations from Rogers?",
      answer:
        "Our office is in Maple Grove, about 12 minutes from Rogers. We visit active projects multiple times per week and are reachable by phone throughout the build.",
    },
  ],
};