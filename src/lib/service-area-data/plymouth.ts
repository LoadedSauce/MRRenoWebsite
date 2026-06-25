import type { ServiceAreaData } from "../service-area-types";

/**
 * Plymouth, MN -- production data for service x area pages.
 *
 * Western Twin Cities suburb, ~80K population. Mix of 1970s-2000s housing.
 * About 15 minutes from the Maple Grove office.
 *
 * Copy here is staging-quality. Review before launch.
 */
export const plymouth: ServiceAreaData = {
  citySlug: "plymouth",
  cityName: "Plymouth",
  stateAbbr: "MN",
  driveTimeText: "About 15 minutes from our Maple Grove office.",
  neighborhoods: [
    "Medicine Lake",
    "Bassett Creek",
    "Fernbrook",
    "The Reserve",
    "Parkers Lake",
  ],
  nearbyLandmarks: [
    "Medicine Lake",
    "Parkers Lake Park",
    "Plymouth Creek Center",
    "I-494 and Highway 55 corridor",
  ],
  serviceNotes: {
    kitchens:
      "Plymouth's large-lot 1980s and 1990s homes are ideal candidates for open-concept kitchen renovations. We have completed projects throughout Medicine Lake, Fernbrook, and the Bassett Creek neighborhoods. The City of Plymouth typically processes kitchen permits in two to three weeks.",
    bathrooms:
      "Plymouth homeowners often combine bathroom remodels with primary suite updates in the area's larger floor plans. We handle custom tile work, in-floor heat, and all plumbing rough-in in-house.",
    basements:
      "Plymouth's 1980s split-level and two-story homes frequently have unfinished lower levels with good ceiling heights and existing egress. We have finished dozens of Plymouth basements and know the city's inspection process well.",
    additions:
      "Home additions in Plymouth require coordination with the city planning department, particularly for lots near Medicine Lake or in established neighborhoods with setback constraints. We handle the full permit process.",
    "whole-home":
      "Whole-home renovations in Plymouth typically update 1980s and 1990s construction -- dated finishes, original cabinetry, and builder-grade surfaces replaced with custom work. We phase projects to minimize displacement.",
    exterior:
      "Plymouth's mature neighborhoods benefit from exterior updates that match the architectural character of the community. We install James Hardie siding, GAF roofing, and Marvin windows, all rated for Minnesota's climate.",
  },
  recentProjectExamples: [
    {
      serviceSlug: "kitchens",
      title: "Plymouth Kitchen Remodel",
      summary:
        "Open-concept conversion in a 1988 two-story: wall removal, custom inset cabinetry, quartz countertops, and new lighting plan.",
    },
    {
      serviceSlug: "basements",
      title: "Plymouth Basement Finish",
      summary:
        "900-square-foot lower level with egress window addition, full bath, and a dedicated home office -- fully permitted through the City of Plymouth.",
    },
    {
      serviceSlug: "additions",
      title: "Plymouth Four-Season Room",
      summary:
        "Three-season porch converted to a fully insulated, year-round addition with heated floors and a cathedral ceiling.",
    },
  ],
  heroBlurb:
    "M.R. Renovations has completed projects throughout Plymouth for more than two decades. We know the city's housing stock, its permit process, and the quality standards Plymouth homeowners expect.",
  faqOverrides: [
    {
      question: "Do you work in Plymouth, MN?",
      answer:
        "Yes. Plymouth is one of our primary service cities. We complete kitchen, bathroom, basement, addition, and whole-home projects there regularly and pull permits directly with the City of Plymouth.",
    },
    {
      question: "Is M.R. Renovations licensed to work in Plymouth, MN?",
      answer:
        "Yes. We hold Minnesota Residential Contractor license BC809200 and carry full General Liability Insurance and Workers' Compensation Insurance. We are fully licensed and insured to perform renovation work anywhere in Plymouth.",
    },
  ],
};
