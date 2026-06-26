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
      "Custom cabinetry, structural work, and finish detail -- backed by 43+ years of craftsmanship. M.R. Renovations runs your kitchen remodel on one contract, with one crew, from demo to final walkthrough.",
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
          "A full kitchen remodel with M.R. Renovations covers demolition, framing and structural changes (where applicable), rough plumbing and electrical, new cabinetry and countertops, flooring, backsplash, drywall, paint, fixtures, lighting, and final trim. We coordinate all trades under one contract so you have a single point of accountability from start to finish.",
      },
      {
        question: "Do you handle the permits for kitchen projects?",
        answer:
          "Yes. We pull all required building, plumbing, and electrical permits and schedule inspections directly with your municipality. Pulling permits is standard on every M.R. Renovations project -- it protects your investment, satisfies your homeowners insurance, and ensures the work meets Minnesota residential code.",
      },
      {
        question: "How long does a kitchen remodel take?",
        answer:
          "Most kitchen remodels take four to eight weeks from demolition to final walkthrough. Cosmetic-level projects with minimal structural change run closer to four weeks; full gut renovations with custom cabinetry and structural work run closer to eight. You receive a written project schedule before demo day, and any timeline changes are communicated in advance.",
      },
      {
        question: "Is M.R. Renovations licensed and insured in Minnesota?",
        answer:
          "Yes. M.R. Renovations holds Minnesota Residential Contractor license BC809200 and carries full General Liability Insurance and Workers' Compensation Insurance. License and insurance documentation is available upon request before contract signing.",
      },
      {
        question: "Do you offer a warranty on kitchen remodeling work?",
        answer:
          "Yes. Every kitchen project is backed by our Lifetime Transferable Workmanship Warranty -- it covers our labor for the life of the home and transfers to future owners if you sell. Manufacturer warranties on cabinetry, countertops, appliances, and fixtures are passed through to you at project completion. Full warranty terms at m-r-reno.com/warranty.",
      },
      {
        question: "Do you follow a defined process on every project?",
        answer:
          "Absolutely. Every M.R. Renovations project follows a defined 9-step process from first call through final walkthrough and warranty signing. The full walkthrough -- including how we handle permits, selections timing, inspections, and the punch list before final payment -- is available at m-r-reno.com/process.",
      },
    ],
  },

  // -- SKELETON STUBS (content added when each service page is built) -------
  additions: {
    slug: "additions",
    displayName: "Home Additions",
    heroDefaultSubcopy:
      "Single-room bump-outs, primary suite additions, four-season rooms, and full second-story builds. M.R. Renovations engineers each addition to match your existing structure, handles every permit, and ties the work into your home with 43+ years of carpentry behind it.",
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
          "A home addition with M.R. Renovations covers design coordination, foundation or footing work, framing and structural changes (where applicable), tying into the existing roofline and siding, rough plumbing and electrical, insulation, HVAC extensions, drywall, paint, flooring, trim, and all finish work. Everything runs under one contract with one project manager from first sketch to final inspection.",
      },
      {
        question: "Do you handle permits for home addition projects?",
        answer:
          "Yes. Additions almost always require building, mechanical, and sometimes zoning permits in Minnesota. We pull every permit on your behalf, coordinate with your city's planning and inspection departments, and schedule all inspections. Setback variances and lot-coverage questions are addressed before construction starts -- not after.",
      },
      {
        question: "How long does a home addition take?",
        answer:
          "Most home additions take ten to sixteen weeks from permit approval to final walkthrough. A single-room bump-out sits at the shorter end; a full second-story or multi-room addition sits at the longer end. You receive a written schedule before construction begins, and weather-sensitive milestones are flagged in advance.",
      },
      {
        question: "Is M.R. Renovations licensed and insured in Minnesota?",
        answer:
          "Yes. M.R. Renovations holds Minnesota Residential Contractor license BC809200 and carries full General Liability Insurance and Workers' Compensation Insurance. Documentation is available upon request before contract signing, and certificates of insurance can be provided directly to your lender if your project is financed.",
      },
      {
        question: "Do you offer a warranty on home addition work?",
        answer:
          "Yes. Every addition is backed by our Lifetime Transferable Workmanship Warranty -- it covers our labor for the life of the home and transfers to future owners if you sell. Manufacturer warranties on windows, doors, roofing, siding, and fixtures are passed through at project completion. Full warranty terms at m-r-reno.com/warranty.",
      },
      {
        question: "Do you follow a defined process on every project?",
        answer:
          "Absolutely. Every M.R. Renovations project follows a defined 9-step process from first call through final walkthrough and warranty signing. The full walkthrough -- including how we handle permits, selections timing, inspections, and the punch list before final payment -- is available at m-r-reno.com/process.",
      },
    ],
  },

  "whole-home": {
    slug: "whole-home",
    displayName: "Whole Home Remodeling",
    heroDefaultSubcopy:
      "A whole-home renovation runs through every trade in your house. M.R. Renovations has managed projects of this scale for over four decades -- one contract, one project manager, one Lifetime Transferable Workmanship Warranty covering the entire home.",
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
          "A whole-home remodel with M.R. Renovations covers full-scope demolition, framing and structural changes (where applicable), rough plumbing and electrical updates throughout the home, HVAC modifications, insulation, drywall, paint, all new flooring, every cabinetry and fixture set, lighting, trim, and exterior tie-in work where needed. Every room is sequenced under one contract, with one project manager and one timeline.",
      },
      {
        question: "Do you handle permits for whole home remodeling projects?",
        answer:
          "Yes. Whole-home projects typically require multiple permits across building, plumbing, electrical, and mechanical trades. We pull every required permit, coordinate inspections in the correct sequence, and handle all communication with your municipality. Most cities require a permitting plan before work starts -- we produce and submit it.",
      },
      {
        question: "How long does a whole home remodel take?",
        answer:
          "Most whole-home remodels take twelve to twenty weeks from permit approval to final walkthrough, driven by the size of the home and the depth of the structural work. Larger homes with extensive mechanical updates trend longer. You receive a phased schedule before construction begins so you can plan around mid-project milestones if you are living in the home.",
      },
      {
        question: "Is M.R. Renovations licensed and insured in Minnesota?",
        answer:
          "Yes. M.R. Renovations holds Minnesota Residential Contractor license BC809200 and carries full General Liability Insurance and Workers' Compensation Insurance. For whole-home projects, certificates of insurance are typically required by lenders -- we provide them directly to your loan officer if needed.",
      },
      {
        question: "Do you offer a warranty on whole home remodeling work?",
        answer:
          "Yes. The full scope of a whole-home remodel is backed by our Lifetime Transferable Workmanship Warranty -- one warranty covers labor across every room and every trade we performed, for the life of the home, and transfers to future owners if you sell. Manufacturer warranties on materials and fixtures pass through to you at project completion. Full warranty terms at m-r-reno.com/warranty.",
      },
      {
        question: "Do you follow a defined process on every project?",
        answer:
          "Absolutely. Every M.R. Renovations project follows a defined 9-step process from first call through final walkthrough and warranty signing. The full walkthrough -- including how we handle permits, selections timing, inspections, and the punch list before final payment -- is available at m-r-reno.com/process.",
      },
    ],
  },

  basements: {
    slug: "basements",
    displayName: "Basement Finishing",
    heroDefaultSubcopy:
      "Unfinished space into livable square footage. M.R. Renovations handles framing, egress, mechanical rough-ins, insulation, drywall, paint, and finish carpentry -- fully permitted, code-correct, and backed by our Lifetime Transferable Workmanship Warranty.",
    galleryImages: [],
    faqItems: [
      {
        question: "What does a basement finishing project typically include?",
        answer:
          "A finished basement with M.R. Renovations covers framing and structural changes (where applicable), egress window installation if a bedroom is in scope, mechanical rough-ins for plumbing and electrical, HVAC extensions, insulation, drywall, paint, flooring, trim, lighting, and any built-ins or bar work you have planned. We coordinate the inspection sequence so the project does not stall between trades.",
      },
      {
        question: "Do you handle permits for basement finishing in Minnesota?",
        answer:
          "Yes. Basement finishing requires a building permit in every Minnesota municipality, and most projects also need separate plumbing, electrical, and mechanical permits. We pull every required permit, coordinate inspections, and verify egress and ceiling-height compliance before drywall. Permitted work is required by most homeowners insurance policies and by every lender we work with.",
      },
      {
        question: "How long does a basement finishing project take?",
        answer:
          "Most basement finishing projects take six to twelve weeks from permit approval to final walkthrough. Straightforward open layouts come in around six; projects with egress window additions, full baths, bar plumbing, or HVAC reconfiguration trend toward twelve. You receive a written schedule before framing starts.",
      },
      {
        question: "Is M.R. Renovations licensed and insured in Minnesota?",
        answer:
          "Yes. M.R. Renovations holds Minnesota Residential Contractor license BC809200 and carries full General Liability Insurance and Workers' Compensation Insurance. License and insurance documentation is available upon request before contract signing.",
      },
      {
        question: "Do you offer a warranty on basement finishing work?",
        answer:
          "Yes. Every basement finish is backed by our Lifetime Transferable Workmanship Warranty -- it covers our labor for the life of the home and transfers to future owners if you sell. Manufacturer warranties on flooring, fixtures, and egress windows are passed through at project completion. Full warranty terms at m-r-reno.com/warranty.",
      },
      {
        question: "Do you follow a defined process on every project?",
        answer:
          "Absolutely. Every M.R. Renovations project follows a defined 9-step process from first call through final walkthrough and warranty signing. The full walkthrough -- including how we handle permits, selections timing, inspections, and the punch list before final payment -- is available at m-r-reno.com/process.",
      },
    ],
  },

  bathrooms: {
    slug: "bathrooms",
    displayName: "Bathroom Remodels",
    heroDefaultSubcopy:
      "Primary baths, family baths, and powder rooms -- delivered on schedule, on a fixed contract, with tile and waterproofing detail that lasts decades. M.R. Renovations handles every trade in-house and pulls every permit.",
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
          "A full bathroom remodel with M.R. Renovations covers demolition, framing and structural changes (where applicable), waterproofing and shower-pan construction, rough plumbing and electrical, tile work, new fixtures, vanity, drywall, paint, lighting, exhaust ventilation, and finish carpentry. Our in-house tile crew handles every shower and floor installation -- not subcontracted out.",
      },
      {
        question: "Do you handle permits for bathroom remodeling projects?",
        answer:
          "Yes. Any bathroom project involving plumbing changes, electrical work, or moved walls requires permits in Minnesota. We pull every required permit, schedule inspections, and verify plumbing rough-in passes inspection before tile goes on the wall. Permitted work protects your investment if you sell and is required by most homeowners insurance policies.",
      },
      {
        question: "How long does a bathroom remodel take?",
        answer:
          "Most bathroom remodels take three to eight weeks from demolition to final walkthrough. A cosmetic refresh with no structural change runs closer to three; a primary bath with moved walls, custom tile, and structural work runs closer to eight. You receive a written schedule before demo day and we communicate any adjustments in advance.",
      },
      {
        question: "Is M.R. Renovations licensed and insured in Minnesota?",
        answer:
          "Yes. M.R. Renovations holds Minnesota Residential Contractor license BC809200 and carries full General Liability Insurance and Workers' Compensation Insurance. License and insurance documentation is available upon request before contract signing.",
      },
      {
        question: "Do you offer a warranty on bathroom remodeling work?",
        answer:
          "Yes. Every bathroom remodel is backed by our Lifetime Transferable Workmanship Warranty -- it covers our labor, including tile and waterproofing, for the life of the home and transfers to future owners if you sell. Manufacturer warranties on fixtures, vanities, and countertops are passed through at project completion. Full warranty terms at m-r-reno.com/warranty.",
      },
      {
        question: "Do you follow a defined process on every project?",
        answer:
          "Absolutely. Every M.R. Renovations project follows a defined 9-step process from first call through final walkthrough and warranty signing. The full walkthrough -- including how we handle permits, selections timing, inspections, and the punch list before final payment -- is available at m-r-reno.com/process.",
      },
    ],
  },

  // -- EXTERIOR --------------------------------------------------------------
  exterior: {
    slug: "exterior",
    displayName: "Roofing, Siding & Exterior",
    heroDefaultSubcopy:
      "Roofing, siding, windows, doors, and garages -- specified with James Hardie, GAF, Marvin, and Trex products rated for Minnesota's climate. M.R. Renovations pulls every permit, coordinates with your insurance adjuster when storms are involved, and backs the work with our Lifetime Transferable Workmanship Warranty.",
    galleryImages: [],
    faqItems: [
      {
        question: "What does an exterior project typically include?",
        answer:
          "Our exterior work covers roofing tear-off and replacement, fiber cement and lap siding installation, window and door replacement, garage builds, soffit and fascia, gutters, and trim. Framing and structural changes (where applicable) are included -- rotted sheathing, fascia repair, and header work are addressed during the project, not flagged as change orders. Drywall and paint are included on any interior surfaces affected by exterior work.",
      },
      {
        question: "Do you handle permits for exterior projects?",
        answer:
          "Yes. We pull all required building permits and schedule inspections directly with your city. Roofing, siding, window, and structural permits vary by municipality -- we handle the paperwork so you do not have to. For storm-damage projects, we coordinate the permit process alongside your insurance claim timeline.",
      },
      {
        question: "How long does an exterior project take?",
        answer:
          "Roofing-only and siding-only projects typically take one to three weeks, weather permitting. Full exterior packages that include roofing, siding, windows, doors, and any structural work typically run three to eight weeks. You receive a written schedule before work begins, and weather-related adjustments are communicated in advance.",
      },
      {
        question: "Is M.R. Renovations licensed and insured for exterior work in Minnesota?",
        answer:
          "Yes. M.R. Renovations holds Minnesota Residential Contractor license BC809200 and carries full General Liability Insurance and Workers' Compensation Insurance. We are fully licensed and insured to perform roofing, siding, window, door, and exterior renovation work throughout our service area. Certificates of insurance can be provided directly to your insurance adjuster for storm-damage claims.",
      },
      {
        question: "Do you offer a warranty on exterior work?",
        answer:
          "Yes. Every exterior project is backed by our Lifetime Transferable Workmanship Warranty -- it covers our labor for the life of the home and transfers to future owners if you sell. Manufacturer warranties on James Hardie siding, GAF roofing systems, Marvin windows and doors, and Trex composite materials are passed through to you at project completion. Full warranty terms at m-r-reno.com/warranty.",
      },
      {
        question: "Do you follow a defined process on every project?",
        answer:
          "Absolutely. Every M.R. Renovations project follows a defined 9-step process from first call through final walkthrough and warranty signing. The full walkthrough -- including how we handle permits, selections timing, inspections, and the punch list before final payment -- is available at m-r-reno.com/process.",
      },
    ],
  },
};

