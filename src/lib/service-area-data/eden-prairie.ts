import type { ServiceAreaData } from "../service-area-types";

/**
 * Eden Prairie, MN -- production data for service x area pages.
 *
 * Established southwest suburb (Hennepin County), ~65K population.
 * Mix of 1970s-2000s housing on large wooded lots. Strong household
 * income. About 30 minutes from the Maple Grove office via I-494.
 *
 * Copy here is staging-quality. Review before launch.
 */
export const edenPrairie: ServiceAreaData = {
  citySlug: "eden-prairie",
  cityName: "Eden Prairie",
  stateAbbr: "MN",
  driveTimeText: "About 30 minutes from our Maple Grove office via I-494.",
  neighborhoods: [
    "Eden Lake",
    "Purgatory Creek area",
    "Prairie Center Drive corridor",
    "Flying Cloud",
    "Bearpath",
  ],
  nearbyLandmarks: [
    "Eden Prairie Center",
    "Purgatory Creek Regional Park",
    "Flying Cloud Airport",
    "I-494 and Highway 212 corridor",
    "MN-5 corridor",
  ],
  serviceNotes: {
    kitchens:
      "Eden Prairie's established neighborhoods have kitchens that were designed for a different era -- layouts that close off the kitchen from the living space and finishes that are decades overdue for replacement. We open floor plans, install custom cabinetry, and rebuild kitchens to match the quality of Eden Prairie's housing stock. Permit timelines with the City of Eden Prairie typically run two to three weeks.",
    bathrooms:
      "Eden Prairie homeowners frequently invest in spa-level primary bath renovations that match the broader quality of their homes. We handle custom tile, steam showers, freestanding tubs, in-floor heat, and all rough-in plumbing in-house.",
    basements:
      "Eden Prairie's 1980s and 1990s walkout homes offer exceptional lower-level potential -- natural light, high ceilings, and grade-level access. We finish these spaces for home theaters, in-law suites, home gyms, and full entertainment areas.",
    additions:
      "Home additions in Eden Prairie require careful navigation of the city's tree preservation ordinance and shoreline setback rules, particularly for lots near Purgatory Creek or any of the city's protected natural areas. We handle the full permit and variance process.",
    "whole-home":
      "Whole-home renovations in Eden Prairie often span two or three phases across a full calendar year. We coordinate the project as a single contract with one project manager, ensuring continuity from kitchen and baths through flooring, trim, and exterior.",
    exterior:
      "Eden Prairie's mature tree canopy and natural setting set a high standard for exterior work. We install James Hardie fiber cement, GAF roofing, and Marvin windows, and we take particular care to match the architectural character of the neighborhood.",
  },
  recentProjectExamples: [
    {
      serviceSlug: "kitchens",
      title: "Eden Prairie Kitchen Remodel",
      summary:
        "Open-concept conversion in a 1991 walkout rambler: structural wall removal, custom inset cabinetry, quartzite countertops, and a full butler's pantry addition.",
    },
    {
      serviceSlug: "bathrooms",
      title: "Eden Prairie Primary Bath Remodel",
      summary:
        "Full gut of a 1990s primary suite bath: custom large-format tile, freestanding soaking tub, frameless steam shower, and heated floors throughout.",
    },
    {
      serviceSlug: "additions",
      title: "Eden Prairie Screened Porch Addition",
      summary:
        "Four-season addition off the main living area with a vaulted ceiling, heated floors, and full integration into the existing roofline.",
    },
  ],
  heroBlurb:
    "M.R. Renovations has completed projects throughout Eden Prairie for more than two decades. We know the city's established neighborhoods, its permit and tree ordinance requirements, and the quality standards that Eden Prairie homeowners expect from their contractors.",
  faqOverrides: [
    {
      question: "Do you work in Eden Prairie, MN?",
      answer:
        "Yes. Eden Prairie is one of our active service cities. We complete kitchen, bathroom, basement, addition, and whole-home projects there regularly and pull permits directly with the City of Eden Prairie.",
    },
    {
      question: "Is M.R. Renovations licensed to work in Eden Prairie, MN?",
      answer:
        "Yes. We hold Minnesota Residential Contractor license BC809200 and carry full General Liability Insurance and Workers' Compensation Insurance. We are fully licensed and insured to perform renovation work anywhere in Eden Prairie.",
    },
  ],
};
