import type { ServiceAreaData } from "../service-area-types";

/**
 * St. Michael, MN -- production data for service x area pages.
 *
 * Fast-growing exurb in Wright County, ~25K population and climbing.
 * Primarily 2000s-2020s new construction. About 20 minutes from the
 * Maple Grove office via I-94 west.
 *
 * Copy here is staging-quality. Review before launch.
 */
export const stMichael: ServiceAreaData = {
  citySlug: "st-michael",
  cityName: "St. Michael",
  stateAbbr: "MN",
  driveTimeText: "About 20 minutes from our Maple Grove office via I-94.",
  neighborhoods: [
    "Cornerstone Creek",
    "Fieldstone",
    "Riverview Estates",
    "Pheasant Ridge",
    "Downtown St. Michael",
  ],
  nearbyLandmarks: [
    "Ney Park",
    "St. Michael-Albertville High School",
    "I-94 and Highway 241 corridor",
    "Crow River",
  ],
  serviceNotes: {
    kitchens:
      "St. Michael's 2000s and 2010s homes often have functional but builder-grade kitchens ready for a full custom upgrade. We have completed kitchen remodels throughout Cornerstone Creek and Fieldstone and work closely with the City of St. Michael on permit timelines, which typically run two to three weeks.",
    bathrooms:
      "Bathroom remodels in St. Michael frequently involve upgrading builder-grade vanities, tile, and fixtures in homes that are 10 to 20 years old. We handle custom tile, in-floor heat, and all rough-in plumbing in-house.",
    basements:
      "St. Michael's newer housing stock has excellent lower levels -- high ceilings, open footprints, and egress windows already in place in most cases. We finish these spaces for home theaters, playrooms, home offices, and in-law suites.",
    additions:
      "Home additions in St. Michael require coordination with Wright County and the City of St. Michael planning departments. We handle the full permit process and have experience with the setback and impervious surface rules common to newer Wright County subdivisions.",
    "whole-home":
      "Whole-home renovations in St. Michael typically take a 2000s build and bring it fully current -- custom cabinetry, hardwood or LVP flooring, updated bathrooms, and a refreshed exterior. We phase the work to keep the family in the home throughout.",
    exterior:
      "St. Michael's newer homes are reaching the age where original roofing and siding need replacement. We install James Hardie fiber cement, GAF roofing, and Marvin windows, all specified for Minnesota's climate and Wright County's suburban aesthetic.",
  },
  recentProjectExamples: [
    {
      serviceSlug: "kitchens",
      title: "St. Michael Kitchen Remodel",
      summary:
        "Full builder-grade tearout in a 2007 two-story: custom painted shaker cabinetry, quartz waterfall island, and under-cabinet lighting throughout.",
    },
    {
      serviceSlug: "basements",
      title: "St. Michael Basement Finish",
      summary:
        "1,200-square-foot lower level with home theater, wet bar, and full bath -- fully permitted through the City of St. Michael.",
    },
    {
      serviceSlug: "additions",
      title: "St. Michael Mudroom Addition",
      summary:
        "Attached mudroom and laundry addition off the garage entry, with custom built-ins, tile floor, and a connecting half bath.",
    },
  ],
  heroBlurb:
    "M.R. Renovations has been working in St. Michael as the community has grown. We know Wright County's permit process, the housing stock in the newer subdivisions, and the expectations of homeowners who invested in St. Michael for the long term.",
  faqOverrides: [
    {
      question: "Do you work in St. Michael, MN?",
      answer:
        "Yes. St. Michael is one of our active service cities. We complete kitchen, bathroom, basement, addition, and whole-home projects there regularly and pull permits directly with the City of St. Michael and Wright County.",
    },
    {
      question: "Is M.R. Renovations licensed to work in St. Michael, MN?",
      answer:
        "Yes. We hold Minnesota Residential Contractor license BC809200 and carry full General Liability Insurance and Workers' Compensation Insurance. We are fully licensed and insured to perform renovation work anywhere in St. Michael.",
    },
  ],
};
