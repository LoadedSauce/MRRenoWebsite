// src/app/sitemap.ts
//
// App Router sitemap output. Lists only live, indexable routes.

import type { MetadataRoute } from "next";
import { canonical } from "@/lib/seo/canonical";
import { getAllServices, getAllServiceAreas } from "@/lib/data/services";
import { LIVE_TIER3 } from "@/lib/seo/live-tier3";
import { getPublishedResources } from "@/lib/resources";

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
  entries.push(entry("/team", 0.7, "monthly"));
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

  // Resources hub + published posts
  entries.push(entry("/resources", 0.6, "monthly"));
  for (const r of getPublishedResources()) {
    entries.push(entry(`/resources/${r.slug}`, 0.6, "monthly"));
  }

  return entries;
}
