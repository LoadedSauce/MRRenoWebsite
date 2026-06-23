// src/lib/service-area-data/index.ts
//
// Barrel for all service-area (city) data modules. This is the single place
// that knows which cities exist, so nothing else has to hardcode the list:
//   - the adapter (src/lib/data/services.ts) enumerates areas from here
//   - the Tier 3 route resolves the area param against `serviceAreaRegistry`
//   - sitemap.ts / llms.txt enumerate areas via the adapter, which reads here
//
// To add a city: create `./<city>.ts` exporting a `ServiceAreaData`, import it
// below, and add it to `serviceAreaRegistry`. Nothing else needs to change.

import type { ServiceAreaData } from "../service-area-types";
import { rogers } from "./rogers";

export const serviceAreaRegistry = {
  rogers,
} as const satisfies Record<string, ServiceAreaData>;

export type ServiceAreaSlug = keyof typeof serviceAreaRegistry;

export const allServiceAreas: ServiceAreaData[] =
  Object.values(serviceAreaRegistry);
