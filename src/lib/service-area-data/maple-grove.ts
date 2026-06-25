import type { ServiceAreaData } from "../service-area-types";

/**
 * Maple Grove, MN -- production data for service x area pages.
 *
 * M.R. Renovations is headquartered in Maple Grove. This is the
 * highest-priority secondary city after Rogers. All 6 services
 * receive a local serviceNote.
 *
 * Copy here is staging-quality. Review before launch.
 */
export const mapleGrove: ServiceAreaData = {
  citySlug: "maple-grove",
  cityName: "Maple Grove",
  stateAbbr: "MN",
  driveTimeText: "Our office is in Maple Grove -- no drive time.",
  neighborhoods: [
    "Elm Creek",
    "Stony Creek",
    "Rice Lake",
    "Edinbrook",
    "Village Creek",
  ],
  nearbyLandmarks: [
    "Elm Creek Park Reserve",
    "Maple Grove Town Center",
    "Rush Creek Golf Club",
    "Central Park of Maple Grove",
  ],
  serviceNotes: {
    kitchens:
      "Kitchen remodeling is our most-requested service in Maple Grove. We have completed projects throughout Elm Creek, Edinbrook, and the TH-169 corridor. Permit timelines with the City of Maple Grove are typically two to three weeks for kitchen work.",
    bathrooms:
      "Maple Grove homeowners frequently pair bathroom remodels with primary suite updates. We handle tile, custom vanities, and all rough-in plumbing in-house. Most bathroom permits in Maple Grove are issued within two weeks.",
    basements:
      "Maple Grove's 1990s and 2000s housing stock is well-suited for full basement finishes -- high ceilings, open footprints, and good egress. We have completed dozens of lower-level projects in the city and know the City of Maple Grove inspection cadence well.",
    additions:
      "Home additions in Maple Grove require careful coordination with the city's planning department and setback requirements. We have navigated this process many times and carry working relationships with local inspectors that keep projects on schedule.",
    "whole-home":
      "Whole-home renovations in Maple Grove typically involve updating 1990s or early-2000s construction to current design standards. We phase the work to keep the family in the home throughout the project whenever possible.",
    exterior:
      "Maple Grove's climate demands exterior materials rated for Minnesota's freeze-thaw cycles. We install James Hardie fiber cement, GAF roofing, and Marvin windows -- all specified for the northern climate zone.",
  },
  recentProjectExamples: [
    {
      serviceSlug: "kitchens",
      title: "Maple Grove Kitchen Remodel",
      summary:
        "Full kitchen gut with custom painted cabinetry, quartzite countertops, and a new island layout in a 2002 two-story.",
    },
    {
      serviceSlug: "basements",
      title: "Maple Grove Basement Finish",
      summary:
        "1,100-square-foot lower level with home theater, wet bar, and full bath -- fully permitted through the City of Maple Grove.",
    },
    {
      serviceSlug: "additions",
      title: "Maple Grove Primary Suite Addition",
      summary:
        "360-square-foot main-floor addition with walk-in closet and spa bath, tied into the existing roofline.",
    },
  ],
  heroBlurb:
    "M.R. Renovations is based in Maple Grove and has completed projects across the city for more than four decades. We know the local housing stock, the city permit process, and the neighborhoods -- because this is where we work every day.",
  faqOverrides: [
    {
      question: "Do you work in Maple Grove, MN?",
      answer:
        "Yes. Maple Grove is our home base. Our office is located in Maple Grove and the majority of our projects are within city limits or the immediately surrounding communities.",
    },
    {
      question: "Is M.R. Renovations licensed to work in Maple Grove, MN?",
      answer:
        "Yes. We hold Minnesota Residential Contractor license BC809200 and carry full General Liability Insurance and Workers' Compensation Insurance. We are fully licensed and insured to perform renovation work anywhere in Maple Grove.",
    },
  ],
};
