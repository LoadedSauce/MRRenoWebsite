// src/app/llms.txt/route.ts
//
// Advisory map for AI crawlers. Lists priority URLs with one-line
// descriptions per https://llmstxt.org/. This is NOT a substitute for
// robots.ts or sitemap.ts â€” it's a hint layer for LLM-based agents that
// choose to respect it. Treat as advisory only.
//
// Scope note (P1.5): mirrors sitemap.ts â€” only the home page and live
// service Ã— area pages are listed. Service hubs and service-area hubs are
// omitted until those route templates exist and return 200, so we never
// point crawlers at URLs that 404.

import { SITE } from "@/lib/seo/site";
import { canonical } from "@/lib/seo/canonical";
import { getAllServices, getAllServiceAreas } from "@/lib/data/services";

export const dynamic = "force-static";
export const revalidate = 3600;

function link(url: string, summary: string): string {
  return `- [${url}](${url}): ${summary}`;
}

export function GET(): Response {
  const services = getAllServices();
  const activeAreas = getAllServiceAreas().filter((a) => a.isActive !== false);

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

  // Top Tier 3 pages â€” the workhorses
  lines.push("## Top service Ã— area pages");
  for (const s of services) {
    for (const a of activeAreas) {
      lines.push(
        link(canonical(`/services/${s.slug}/${a.slug}`), `${s.name} in ${a.name}, MN.`)
      );
    }
  }
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
