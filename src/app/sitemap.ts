// src/app/sitemap.ts
//
// App Router sitemap output. Lists only live, indexable routes. Entries are
// derived from the adapter registries so the sitemap stays in sync with what
// is actually shipping.
//
// Scope note (P1.5): only the home page and active service Ã— area (Tier 3)
// pages are emitted. Service hubs (/services/[service]) and service-area hubs
// (/service-areas/[area]) are intentionally NOT listed yet â€” those route
// templates do not exist on this branch, so emitting them would advertise URLs
// that return 404. They get added here when their templates ship.

import type { MetadataRoute } from "next";
import { canonical } from "@/lib/seo/canonical";
import { getAllServices, getAllServiceAreas } from "@/lib/data/services";

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

  // Service Ã— area (Tier 3) â€” the SEO workhorses.
  // Only emit combinations whose area is active.
  const services = getAllServices();
  const areas = getAllServiceAreas();
  for (const service of services) {
    for (const area of areas) {
      if (area.isActive === false) continue;
      entries.push(entry(`/services/${service.slug}/${area.slug}`, 0.9, "monthly"));
    }
  }

  return entries;
}
