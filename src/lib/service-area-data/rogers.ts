import type { ServiceAreaData } from "../service-area-types";

/**
 * Rogers, MN â€” real production data for service x area pages.
 *
 * Phase 1.4: kitchens serviceNote added to provide Rogers-specific
 * hero sub-copy on the Kitchens x Rogers page. Other service notes
 * will be added when those pages are built.
 *
 * Copy here is staging-quality. Review before launch.
 */
export const rogers: ServiceAreaData = {
  citySlug: "rogers",
  cityName: "Rogers",
  stateAbbr: "MN",
  driveTimeText: "About 12 minutes from our Maple Grove office.",
  neighborhoods: [
    "Downtown Rogers",
    "Elm Creek",
    "Lake Charlotte area",
    "Hassan Township",
    "Brockton Crossing",
  ],
  nearbyLandmarks: [
    "Elm Creek Park Reserve",
    "Rogers Community Arena",
    "Interstate 94 corridor",
  ],
  serviceNotes: {
    kitchens:
      "We have completed kitchen remodels throughout Rogers and Hassan Township for over two decades, including new construction neighborhoods along the Elm Creek corridor. Permit timelines with the City of Rogers are typically two to three weeks.",
  },
  recentProjectExamples: [
    {
      serviceSlug: "kitchens",
      title: "Rogers Kitchen Remodel",
      summary:
        "Custom cherry cabinetry, quartz countertops, and full electrical update in a 1990s two-story.",
    },
    {
      serviceSlug: "basement-finishing",
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
      question: "Is M.R. Renovations licensed to work in Rogers, MN?",
      answer:
        "Yes. We hold a Minnesota Residential Contractor license and carry full general liability and workers' compensation insurance. We are fully licensed and insured to perform renovation work anywhere in Rogers.",
    },
  ],
};