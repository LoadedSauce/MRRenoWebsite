/**
 * Service-level data registry.
 *
 * One entry per service slug. Content here is service-owned
 * and applies across all cities -- it does not know about Rogers,
 * Maple Grove, or any other area.
 *
 * Area-specific overrides live in ServiceAreaData.serviceNotes.
 */

export type ServiceFaqItem = {
  question: string;
  answer: string;
};

export type ServiceGalleryImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type ServiceData = {
  slug:
    | "kitchens"
    | "additions"
    | "whole-home"
    | "basements"
    | "bathrooms"
    | "exterior";
  displayName: string;
  heroDefaultSubcopy: string;
  galleryImages: ServiceGalleryImage[];
  faqItems: ServiceFaqItem[];
};

export const serviceRegistry: Record<ServiceData["slug"], ServiceData> = {
  // -- KITCHENS (Phase 1.4 launch service) ----------------------------------
  kitchens: {
    slug: "kitchens",
    displayName: "Kitchen Remodeling",
    heroDefaultSubcopy:
      "From custom cabinetry to full gut renovations, M.R. Renovations brings 43+ years of craftsmanship to your kitchen. We handle permits, structural work, and finishing details -- one crew, start to finish.",
    galleryImages: [
      {
        src: "/images/kitchen/kitchen-remodel-walnut-cabinets-hex-backsplash-maple-grove-mn.jpg",
        alt: "Kitchen remodel with custom walnut cabinets and hex tile backsplash in Maple Grove, MN",
        caption: "Custom walnut cabinetry with hex tile backsplash",
      },
      {
        src: "/images/kitchen/kitchen-remodel-white-shaker-cabinets-quartz-countertops-maple-grove-mn.jpg",
        alt: "Kitchen remodel with white shaker cabinets and quartz countertops in Maple Grove, MN",
        caption: "White shaker cabinets with quartz countertops",
      },
      {
        src: "/images/kitchen/kitchen-remodel-brick-backsplash-under-cabinet-lighting-maple-grove-mn.jpg",
        alt: "Kitchen remodel with brick tile backsplash and under-cabinet lighting in Maple Grove, MN",
        caption: "Brick tile backsplash with under-cabinet lighting",
      },
    ],
    faqItems: [
      {
        question: "What does a kitchen remodel typically include?",
        answer:
          "A full kitchen remodel with M.R. Renovations covers demolition, framing and structural changes (where applicable), rough plumbing and electrical, new cabinetry and countertops, flooring, backsplash, drywall, paint, fixtures, and final trim. We handle the permit process and coordinate all trades under one contract.",
      },
      {
        question: "Do you handle the permits for kitchen projects?",
        answer:
          "Yes. We pull all required building permits and schedule inspections on your behalf. This is standard on every project -- it protects you as the homeowner and ensures the work meets code.",
      },
      {
        question: "Is M.R. Renovations licensed and insured in Minnesota?",
        answer:
          "Yes. M.R. Renovations holds Minnesota Residential Contractor license BC809200 and carries full General Liability Insurance and Workers' Compensation Insurance. License and insurance documentation is available upon request.",
      },
      {
        question: "How long does a kitchen remodel take?",
        answer:
          "Most kitchen remodels take four to eight weeks from demolition to final walkthrough, depending on scope. We provide a project schedule before work begins and communicate any changes in advance.",
      },
      {
        question: "Do you offer a warranty on kitchen remodeling work?",
        answer:
          "Yes. M.R. Renovations backs all labor with a lifetime workmanship warranty. Material warranties vary by manufacturer and are passed through to you at project completion.",
      },
    ],
  },

  // -- SKELETON STUBS (content added when each service page is built) -------
  additions: {
    slug: "additions",
    displayName: "Home Additions",
    heroDefaultSubcopy:
      "M.R. Renovations designs and builds home additions that match your existing structure and meet Minnesota code -- from single-room additions to full second-story builds.",
    galleryImages: [
      {
        src: "/images/addition/home-addition-four-season-sunroom-floor-to-ceiling-windows-maple-grove-mn.jpg",
        alt: "Home addition four-season sunroom with floor-to-ceiling windows in Maple Grove, MN",
        caption: "Four-season sunroom addition with floor-to-ceiling windows",
      },
      {
        src: "/images/addition/home-addition-sunroom-exterior-new-construction-maple-grove-mn.jpg",
        alt: "Home addition sunroom exterior view new construction in Maple Grove, MN",
        caption: "Sunroom addition exterior -- new construction attached to existing home",
      },
      {
        src: "/images/addition/home-addition-composite-deck-white-railing-coon-rapids-mn.jpg",
        alt: "Home addition composite deck with white railing in Coon Rapids, MN",
        caption: "Composite deck addition with white railing in Coon Rapids",
      },
    ],
    faqItems: [
      {
        question: "What does a home addition typically include?",
        answer:
          "A home addition with M.R. Renovations covers design coordination, framing and structural changes (where applicable), rough plumbing and electrical, insulation, drywall, paint, flooring, trim, and all finish work. We handle permits and coordinate all trades under one contract.",
      },
      {
        question: "Do you handle permits for home addition projects?",
        answer:
          "Yes. Home additions require building permits in Minnesota, and we pull all required permits and schedule inspections on your behalf. Permitted work protects your investment and ensures the addition meets current building code.",
      },
      {
        question: "How long does a home addition take?",
        answer:
          "Most home additions take ten to sixteen weeks from permit approval to final walkthrough, depending on size and scope. We provide a project schedule before work begins and communicate any changes in advance.",
      },
      {
        question: "Is M.R. Renovations licensed and insured in Minnesota?",
        answer:
          "Yes. M.R. Renovations holds Minnesota Residential Contractor license BC809200 and carries full General Liability Insurance and Workers' Compensation Insurance. License and insurance documentation is available upon request.",
      },
      {
        question: "Do you offer a warranty on home addition work?",
        answer:
          "Yes. M.R. Renovations backs all labor with a lifetime workmanship warranty. Material warranties vary by manufacturer and are passed through to you at project completion.",
      },
    ],
  },

  "whole-home": {
    slug: "whole-home",
    displayName: "Whole Home Remodeling",
    heroDefaultSubcopy:
      "Transforming an entire home requires a contractor you can trust through every phase. M.R. Renovations has managed whole-home renovations across the Twin Cities metro for over four decades.",
    galleryImages: [
      {
        src: "/images/whole-home/whole-home-remodel-stone-fireplace-vaulted-ceiling-maple-grove-mn.jpg",
        alt: "Whole home remodel stone fireplace and vaulted ceiling in Maple Grove, MN",
        caption: "Stone fireplace with vaulted ceiling -- whole home remodel",
      },
      {
        src: "/images/whole-home/whole-home-remodel-walnut-kitchen-open-concept-maple-grove-mn.jpg",
        alt: "Whole home remodel walnut kitchen open concept layout in Maple Grove, MN",
        caption: "Walnut kitchen with open concept layout",
      },
      {
        src: "/images/whole-home/whole-home-remodel-lvp-flooring-open-concept-living-room-maple-grove-mn.jpg",
        alt: "Whole home remodel LVP flooring and open concept living room in Maple Grove, MN",
        caption: "LVP flooring throughout open concept living area",
      },
    ],
    faqItems: [
      {
        question: "What does a whole home remodel typically include?",
        answer:
          "A whole home remodel with M.R. Renovations covers full-scope demolition, framing and structural changes (where applicable), rough plumbing and electrical, insulation, drywall, paint, new flooring, cabinetry, fixtures, trim, and all finish work throughout the home. We handle permits and coordinate all trades under one contract.",
      },
      {
        question: "Do you handle permits for whole home remodeling projects?",
        answer:
          "Yes. Whole home remodels require multiple permits across trades, and we pull all required building, plumbing, and electrical permits and schedule all inspections on your behalf.",
      },
      {
        question: "How long does a whole home remodel take?",
        answer:
          "Most whole home remodels take twelve to twenty weeks from permit approval to final walkthrough, depending on the size of the home and scope of work. We provide a detailed project schedule before work begins and communicate any changes in advance.",
      },
      {
        question: "Is M.R. Renovations licensed and insured in Minnesota?",
        answer:
          "Yes. M.R. Renovations holds Minnesota Residential Contractor license BC809200 and carries full General Liability Insurance and Workers' Compensation Insurance. License and insurance documentation is available upon request.",
      },
      {
        question: "Do you offer a warranty on whole home remodeling work?",
        answer:
          "Yes. M.R. Renovations backs all labor with a lifetime workmanship warranty. Material warranties vary by manufacturer and are passed through to you at project completion.",
      },
    ],
  },

  "basements": {
    slug: "basements",
    displayName: "Basement Finishing",
    heroDefaultSubcopy:
      "Turn your unfinished basement into livable space. M.R. Renovations handles framing, egress, mechanical rough-ins, insulation, drywall, and finish work -- permitted and built to last.",
    galleryImages: [],
    faqItems: [
      {
        question: "What does a basement finishing project typically include?",
        answer:
          "A finished basement with M.R. Renovations typically covers framing and structural changes (where applicable), insulation, egress window installation if required, mechanical rough-ins, drywall, paint, flooring, trim, and lighting. We handle permits and coordinate all trades under one contract.",
      },
      {
        question: "Do you pull permits for basement finishing in Minnesota?",
        answer:
          "Yes. Basement finishing requires building permits in Minnesota, and we pull all required permits and schedule inspections on your behalf. Permitted work protects your investment and is required by most lenders and insurers.",
      },
      {
        question: "How long does a basement finishing project take?",
        answer:
          "Most basement finishing projects take six to twelve weeks from permit approval to final walkthrough, depending on scope and mechanical work involved. We provide a project schedule before work begins.",
      },
      {
        question: "Is M.R. Renovations licensed and insured in Minnesota?",
        answer:
          "Yes. M.R. Renovations holds Minnesota Residential Contractor license BC809200 and carries full General Liability Insurance and Workers' Compensation Insurance. License and insurance documentation is available upon request.",
      },
      {
        question: "Do you offer a warranty on basement finishing work?",
        answer:
          "Yes. M.R. Renovations backs all labor with a lifetime workmanship warranty. Material warranties vary by manufacturer and are passed through to you at project completion.",
      },
    ],
  },

  "bathrooms": {
    slug: "bathrooms",
    displayName: "Bathroom Remodels",
    heroDefaultSubcopy:
      "From master bath overhauls to powder room updates, M.R. Renovations delivers bathroom remodels on schedule with transparent pricing.",
    galleryImages: [
      {
        src: "/images/bathroom/bathroom-remodel-marble-tile-shower-quartz-vanity-maple-grove-mn.jpg",
        alt: "Bathroom remodel with marble tile shower and quartz vanity in Maple Grove, MN",
        caption: "Marble tile shower with quartz vanity",
      },
      {
        src: "/images/bathroom/bathroom-remodel-double-vanity-walk-in-shower-maple-grove-mn.jpg",
        alt: "Bathroom remodel with double vanity and walk-in shower in Maple Grove, MN",
        caption: "Double vanity with walk-in shower",
      },
      {
        src: "/images/bathroom/bathroom-remodel-white-distressed-vanity-charcoal-quartz-maple-grove-mn.jpg",
        alt: "Bathroom remodel with white distressed vanity and charcoal quartz countertop in Maple Grove, MN",
        caption: "White distressed vanity with charcoal quartz countertop",
      },
    ],
    faqItems: [
      {
        question: "What does a bathroom remodel typically include?",
        answer:
          "A full bathroom remodel with M.R. Renovations covers demolition, framing and structural changes (where applicable), waterproofing, rough plumbing and electrical, new tile, fixtures, vanity, drywall, paint, lighting, and finish work. We handle permits and coordinate all trades under one contract.",
      },
      {
        question: "Do you handle permits for bathroom remodeling projects?",
        answer:
          "Yes. Any bathroom project involving plumbing or electrical work requires permits in Minnesota, and we pull all required permits and schedule inspections on your behalf.",
      },
      {
        question: "How long does a bathroom remodel take?",
        answer:
          "Most bathroom remodels take three to eight weeks from demolition to final walkthrough, depending on scope. Larger master bath projects or those with structural changes may take longer. We provide a project schedule before work begins.",
      },
      {
        question: "Is M.R. Renovations licensed and insured in Minnesota?",
        answer:
          "Yes. M.R. Renovations holds Minnesota Residential Contractor license BC809200 and carries full General Liability Insurance and Workers' Compensation Insurance. License and insurance documentation is available upon request.",
      },
      {
        question: "Do you offer a warranty on bathroom remodeling work?",
        answer:
          "Yes. M.R. Renovations backs all labor with a lifetime workmanship warranty. Material warranties vary by manufacturer and are passed through to you at project completion.",
      },
    ],
  },

  // -- EXTERIOR --------------------------------------------------------------
  exterior: {
    slug: "exterior",
    displayName: "Roofing, Siding & Exterior",
    heroDefaultSubcopy:
      "M.R. Renovations handles full exterior packages -- roofing, siding, windows, doors, and garages -- using James Hardie, GAF, Marvin, and Trex products. Framing and structural changes are included where applicable. We manage permits, coordinate inspections, and back every project with our Lifetime Transferable Workmanship Warranty.",
    galleryImages: [],
    faqItems: [
      {
        question: "What exterior work does M.R. Renovations handle?",
        answer:
          "We handle complete exterior packages including roofing, siding, windows, doors, and garages. We work with James Hardie fiber cement siding, GAF roofing systems, Marvin windows and doors, and Trex composite decking. Framing and structural changes are included where the project requires them.",
      },
      {
        question: "Do you handle permits for exterior projects?",
        answer:
          "Yes. We pull all required building permits and schedule inspections on your behalf. Roofing, siding, and structural permits vary by municipality -- we handle the process directly with your city so you do not have to.",
      },
      {
        question: "How long does an exterior project take?",
        answer:
          "Roofing and siding projects typically take one to three weeks depending on scope and weather. Full exterior packages that include windows, doors, and structural work typically run three to eight weeks. We provide a project schedule before work begins and communicate any weather-related adjustments in advance.",
      },
      {
        question: "Is M.R. Renovations licensed and insured for exterior work in Minnesota?",
        answer:
          "Yes. M.R. Renovations holds Minnesota Residential Contractor license BC809200 and carries full General Liability Insurance and Workers' Compensation Insurance. We are fully licensed and insured to perform roofing, siding, and exterior renovation work throughout our service area.",
      },
    ],
  },
};
