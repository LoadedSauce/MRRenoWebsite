// src/app/sitemap.ts
//
// App Router sitemap output. Lists only live, indexable routes. Entries are
// derived from the adapter registries, then gated to Tier 3 pages that have
// real, launched content (see LIVE_TIER3 below).
//
// Scope note: only the home page and launched service-area (Tier 3) pages are
// emitted. Service hubs (/services/[service]) and service-area hubs
// (/service-areas/[area]) are intentionally NOT listed yet -- those route
// templates do not exist on this branch, so emitting them would advertise URLs
// that return 404. Thin Tier 3 pages (no gallery/FAQ content yet) are withheld
// until their content ships; add them to LIVE_TIER3 as they go live.

import type { MetadataRoute } from "next";
import { canonical } from "@/lib/seo/canonical";
import { getAllServices, getAllServiceAreas } from "@/lib/data/services";

// Tier 3 "service/area" keys with real, launched content. Add entries here as
// each page's content ships. Format: "<serviceSlug>/<areaSlug>".
// Keep in sync with LIVE_TIER3 in src/app/llms.txt/route.ts.
const LIVE_TIER3 = new Set<string>(["kitchens/rogers"]);

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

  // Home (Tier 1)
  entries.push(entry("/", 1.0, "weekly"));

  // Service-area (Tier 3) -- only pages whose content has launched.
  const services = getAllServices();
  const areas = getAllServiceAreas();
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
