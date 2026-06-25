import type { ServiceAreaData } from "../service-area-types";

/**
 * Coon Rapids, MN -- production data for service x area pages.
 *
 * Northern Twin Cities suburb (Anoka County), ~65K population.
 * Primarily 1970s-1990s housing. About 20 minutes from the Maple Grove office.
 *
 * Copy here is staging-quality. Review before launch.
 */
export const coonRapids: ServiceAreaData = {
  citySlug: "coon-rapids",
  cityName: "Coon Rapids",
  stateAbbr: "MN",
  driveTimeText: "About 20 minutes north from our Maple Grove office.",
  neighborhoods: [
    "Coon Rapids Dam area",
    "Northdale",
    "Sand Creek",
    "Riverview",
    "Viking Drive corridor",
  ],
  nearbyLandmarks: [
    "Coon Rapids Dam Regional Park",
    "Riverdale Village shopping district",
    "Mississippi River corridor",
    "I-610 and Highway 10 corridor",
  ],
  serviceNotes: {
    kitchens:
      "Coon Rapids has a large inventory of 1970s and 1980s ranch and split-level homes that are ideal candidates for full kitchen renovations. We have completed projects throughout Northdale and Sand Creek and know the City of Coon Rapids permit process well.",
    bathrooms:
      "Bathroom remodels in Coon Rapids often involve replacing original 1970s-1980s fixtures and tile. We handle complete gut remodels, custom tile work, and all rough-in plumbing in-house.",
    basements:
      "Coon Rapids' older ranch-style and split-level homes frequently have partially finished or unfinished lower levels. We bring these spaces up to current code with proper egress, insulation, and finished living areas.",
    additions:
      "Home additions in Coon Rapids require coordination with the city's planning and inspection departments. We manage the full permit process from application to final inspection.",
    "whole-home":
      "Whole-home renovations in Coon Rapids typically address decades of deferred updates in one coordinated project. We phase the work to keep families in their homes throughout construction where possible.",
    exterior:
      "Coon Rapids' older housing stock benefits from modern exterior materials built for Minnesota's climate. We install James Hardie fiber cement, GAF roofing, and Marvin windows on projects throughout the city.",
  },
  recentProjectExamples: [
    {
      serviceSlug: "kitchens",
      title: "Coon Rapids Kitchen Remodel",
      summary:
        "Full gut renovation in a 1978 ranch: custom shaker cabinetry, quartz countertops, and a new peninsula layout that opened the space to the living room.",
    },
    {
      serviceSlug: "bathrooms",
      title: "Coon Rapids Primary Bath Remodel",
      summary:
        "Complete gut of a 1980s primary bath: custom tile shower, freestanding tub, heated floors, and a double vanity with custom millwork.",
    },
    {
      serviceSlug: "basements",
      title: "Coon Rapids Basement Finish",
      summary:
        "800-square-foot lower level with egress window, full bath, and a finished family room -- fully permitted through the City of Coon Rapids.",
    },
  ],
  heroBlurb:
    "M.R. Renovations has been completing renovation projects in Coon Rapids for more than two decades. We know the city's older housing stock, its permit requirements, and the craftsmanship standards that Coon Rapids homeowners deserve.",
  faqOverrides: [
    {
      question: "Do you work in Coon Rapids, MN?",
      answer:
        "Yes. Coon Rapids is one of our active service cities. We complete kitchen, bathroom, basement, and whole-home projects there regularly and pull permits directly with the City of Coon Rapids.",
    },
    {
      question: "Is M.R. Renovations licensed to work in Coon Rapids, MN?",
      answer:
        "Yes. We hold Minnesota Residential Contractor license BC809200 and carry full General Liability Insurance and Workers' Compensation Insurance. We are fully licensed and insured to perform renovation work anywhere in Coon Rapids.",
    },
  ],
};
