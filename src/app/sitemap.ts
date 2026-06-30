// src/app/sitemap.ts
//
// App Router sitemap output. Lists only live, indexable routes.

import type { MetadataRoute } from "next";
import { canonical } from "@/lib/seo/canonical";
import { getAllServices, getAllServiceAreas } from "@/lib/data/services";

// Tier 3 "service/area" keys with real, launched content.
// Format: "<serviceSlug>/<areaSlug>".
// Keep in sync with LIVE_TIER3 in src/app/llms.txt/route.ts.
const LIVE_TIER3 = new Set<string>([
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

type SitemapEntry = MetadataRoute.Sitemap[number];

const entry = (
  pathname: string,
  priority: SitemapEntry["priority"],
  changeFrequency: SitemapEntry["changeFrequency"],
  lastModified: Date = new Date()
): SitemapEntry => ({
  url: canonical(pathname),
  lastModified,
  changeFrequency,
  priority,
});

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  entries.push(entry("/", 1.0, "weekly"));
  entries.push(entry("/careers", 0.7, "monthly"));

  // Supporting pages
  entries.push(entry("/process", 0.7, "monthly"));
  entries.push(entry("/warranty", 0.7, "monthly"));
  entries.push(entry("/financing", 0.6, "monthly"));
  entries.push(entry("/contact", 0.6, "monthly"));

  const services = getAllServices();
  const areas = getAllServiceAreas();

  // Tier 2 -- service hubs
  for (const service of services) {
    entries.push(entry(`/services/${service.slug}`, 0.85, "monthly"));
  }

  // Tier 3 -- service x area
  for (const service of services) {
    for (const area of areas) {
      if (area.isActive === false) continue;
      const key = `${service.slug}/${area.slug}`;
      if (!LIVE_TIER3.has(key)) continue;
      entries.push(entry(`/services/${key}`, 0.9, "monthly"));
    }
  }

  return entries;
}
