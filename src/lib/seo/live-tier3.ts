// src/lib/seo/live-tier3.ts
//
// Single source of truth for launched Tier 3 "service/area" pages.
//
// Both src/app/sitemap.ts and src/app/llms.txt/route.ts import this set so the
// two surfaces can never drift out of sync (previously each hand-maintained its
// own copy, and llms.txt fell behind at a single entry -- BUG-1 / P1.37).
//
// Format: "<serviceSlug>/<areaSlug>". Add a key here only once that
// service x area page has real, shipped content and returns 200.

export const LIVE_TIER3 = new Set<string>([
  // Rogers
  "kitchens/rogers",
  "bathrooms/rogers",
  "basements/rogers",
  "additions/rogers",
  "whole-home/rogers",
  "exterior/rogers",
  // Maple Grove
  "kitchens/maple-grove",
  "bathrooms/maple-grove",
  "basements/maple-grove",
  "additions/maple-grove",
  "whole-home/maple-grove",
  "exterior/maple-grove",
  // Plymouth
  "kitchens/plymouth",
  "bathrooms/plymouth",
  "basements/plymouth",
  "additions/plymouth",
  "whole-home/plymouth",
  "exterior/plymouth",
  // Coon Rapids
  "kitchens/coon-rapids",
  "bathrooms/coon-rapids",
  "basements/coon-rapids",
  "additions/coon-rapids",
  "whole-home/coon-rapids",
  "exterior/coon-rapids",
  // St. Michael
  "kitchens/st-michael",
  "bathrooms/st-michael",
  "basements/st-michael",
  "additions/st-michael",
  "whole-home/st-michael",
  "exterior/st-michael",
  // Eden Prairie
  "kitchens/eden-prairie",
  "bathrooms/eden-prairie",
  "basements/eden-prairie",
  "additions/eden-prairie",
  "whole-home/eden-prairie",
  "exterior/eden-prairie",
]);
