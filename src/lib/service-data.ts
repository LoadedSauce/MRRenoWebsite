/**
 * Service-level data registry.
 *
 * One entry per service slug. Content here is service-owned
 * and applies across all cities â€” it does not know about Rogers,
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
  // â”€â”€ KITCHENS (Phase 1.4 launch service) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  kitchens: {
    slug: "kitchens",
    displayName: "Kitchen Remodeling",
    heroDefaultSubcopy:
      "From custom cabinetry to full gut renovations, M.R. Renovations brings 43 years of craftsmanship to your kitchen. We handle permits, structural work, and finishing details â€” one crew, start to finish.",
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
          "A full kitchen remodel with M.R. Renovations covers demolition, structural changes, rough plumbing and electrical, new cabinetry and countertops, flooring, backsplash, fixtures, and final trim. We handle the permit process and coordinate all trades under one contract.",
      },
      {
        question: "Do you handle the permits for kitchen projects?",
        answer:
          "Yes. We pull all required building permits and schedule inspections on your behalf. This is standard on every project â€” it protects you as the homeowner and ensures the work meets code.",
      },
      {
        question: "Is M.R. Renovations licensed and insured in Minnesota?",
        answer:
          "Yes. M.R. Renovations holds a Minnesota Residential Contractor license and carries full general liability and workers' compensation insurance. License information is available upon request.",
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

  // â”€â”€ SKELETON STUBS (content added when each service page is built) â”€â”€
  additions: {
    slug: "additions",
    displayName: "Home Additions",
    heroDefaultSubcopy:
      "M.R. Renovations designs and builds home additions that match your existing structure and meet Minnesota code â€” from single-room additions to full second-story builds.",
    galleryImages: [],
    faqItems: [],
  },

  "whole-home": {
    slug: "whole-home",
    displayName: "Whole Home Remodeling",
    heroDefaultSubcopy:
      "Transforming an entire home requires a contractor you can trust through every phase. M.R. Renovations has managed whole-home renovations across the Twin Cities metro for over four decades.",
    galleryImages: [],
    faqItems: [],
  },

  "basements": {
    slug: "basements",
    displayName: "Basement Finishing",
    heroDefaultSubcopy:
      "Turn your unfinished basement into livable space. M.R. Renovations handles framing, egress, mechanical rough-ins, insulation, drywall, and finish work â€” permitted and built to last.",
    galleryImages: [],
    faqItems: [],
  },

  "bathrooms": {
    slug: "bathrooms",
    displayName: "Bathroom Remodels",
    heroDefaultSubcopy:
      "From master bath overhauls to powder room updates, M.R. Renovations delivers bathroom remodels on schedule with transparent pricing.",
    galleryImages: [],
    faqItems: [],
  },
};