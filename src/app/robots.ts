// src/app/robots.ts
//
// App Router robots output.
//
// Public crawl is wide open for content routes; non-indexable utility
// paths (preview, draft, thank-you, internal API, build artifacts) are
// disallowed so crawl budget isn't wasted and low-value pages don't
// leak into search.

import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/preview/",
          "/draft/",
          "/thank-you",
          "/thanks",
          "/admin",
          "/admin/",
        ],
      },
    ],
    sitemap: `${SITE.baseUrl}/sitemap.xml`,
    host: SITE.baseUrl,
  };
}
