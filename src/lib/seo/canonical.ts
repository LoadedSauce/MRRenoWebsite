// src/lib/seo/canonical.ts
//
// Canonical URL utilities. All canonical URLs for the site are built here
// so the trailing-slash policy and base URL stay consistent across
// metadata, schema, sitemap, robots, and llms.txt.

import { SITE } from "./site";

/**
 * Build an absolute canonical URL for a given path.
 * - `path` may be passed with or without a leading slash.
 * - The home page should be passed as "/" â€” it returns the bare base URL.
 * - Any query string or hash is stripped (canonicals must be parameter-free).
 */
export function canonical(pathname: string): string {
  // Strip query and hash
  const cleanPath = pathname.split("?")[0].split("#")[0];

  // Normalize leading slash
  const withLeading = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

  // Home is always the bare base URL
  if (withLeading === "/") {
    return SITE.baseUrl;
  }

  // Trim trailing slashes, then re-apply per site policy
  const trimmed = withLeading.replace(/\/+$/, "");
  const suffix = SITE.trailingSlash ? "/" : "";

  return `${SITE.baseUrl}${trimmed}${suffix}`;
}

/**
 * Join URL path segments safely, normalizing slashes. Useful when building
 * route paths from registry slugs:
 *
 *   path("services", service.slug, area.slug)  â†’  "/services/kitchens/rogers"
 */
export function path(...segments: string[]): string {
  const joined = segments
    .filter(Boolean)
    .map((s) => s.replace(/^\/+|\/+$/g, ""))
    .join("/");
  return `/${joined}`;
}
