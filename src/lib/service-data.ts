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
    | "bathrooms";
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
      "From custom cabinetry to full gut renovations, M.R. Renovations brings 43 years of craftsmanship to your kitchen. We handle permits, structural work, and finishing details -- one crew, start to finish.",
    galleryImages: [
      {
        src: "/images/kitchens/kitchen-01.jpg",
        alt: "Custom white shaker kitchen with quartz countertops and island",
        caption: "Custom cabinetry with quartz countertops",
      },
      {
        src: "/images/kitchens/kitchen-02.jpg",
        alt: "Open-concept kitchen remodel with large island and pendant lighting",
        caption: "Open-concept layout with island seating",
      },
      {
        src: "/images/kitchens/kitchen-03.jpg",
        alt: "Dark navy kitchen cabinets with brass hardware and tile backsplash",
        caption: "Navy cabinetry with brass accents",
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
    galleryImages: [],
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
    galleryImages: [],
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
    galleryImages: [],
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
};
