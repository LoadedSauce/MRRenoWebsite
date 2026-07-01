// src/app/llms.txt/route.ts
//
// Advisory map for AI crawlers. Lists priority URLs with one-line
// descriptions per https://llmstxt.org/. This is NOT a substitute for
// robots.ts or sitemap.ts -- it is a hint layer for LLM-based agents that
// choose to respect it. Treat as advisory only.
//
// Scope note: mirrors sitemap.ts -- only the home page and launched
// service-area (Tier 3) pages are listed. Service hubs and service-area hubs
// are omitted until those route templates exist and return 200, and thin
// Tier 3 pages are withheld until their content ships (see LIVE_TIER3).

import { SITE } from "@/lib/seo/site";
import { canonical } from "@/lib/seo/canonical";
import { getAllServices, getAllServiceAreas } from "@/lib/data/services";
import { LIVE_TIER3 } from "@/lib/seo/live-tier3";
import { getPublishedResources } from "@/lib/resources";

export const dynamic = "force-static";
export const revalidate = 3600;

function link(url: string, summary: string): string {
  return `- [${url}](${url}): ${summary}`;
}

export function GET(): Response {
  const services = getAllServices();
  const areas = getAllServiceAreas().filter((a) => a.isActive !== false);

  const lines: string[] = [];

  // Header
  lines.push(`# ${SITE.brandName}`);
  lines.push("");
  lines.push(
    `> ${SITE.brandName} is a remodeling contractor based in ` +
      `${SITE.address.locality}, ${SITE.address.region}, serving the northwest ` +
      `metro within roughly ${SITE.serviceRadiusMiles} miles. Five core ` +
      `services: kitchens, additions, whole-home remodels, basements, and bathrooms.`
  );
  lines.push("");

  // Start here
  lines.push("## Start here");
  lines.push(
    link(canonical("/"), "Overview of services, service area, and how to start a project.")
  );
  lines.push("");

  // Launched service-area pages
  lines.push("## Top service-area pages");
  for (const s of services) {
    for (const a of areas) {
      const key = `${s.slug}/${a.slug}`;
      if (!LIVE_TIER3.has(key)) continue;
      lines.push(link(canonical(`/services/${key}`), `${s.name} in ${a.name}, MN.`));
    }
  }
  lines.push("");

  // Resources hub + published posts
  const resources = getPublishedResources();
  if (resources.length > 0) {
    lines.push("## Resources");
    lines.push(
      link(canonical("/resources"), "Remodeling planning guides and cost breakdowns.")
    );
    for (const r of resources) {
      lines.push(link(canonical(`/resources/${r.slug}`), `${r.title}. ${r.category}.`));
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
