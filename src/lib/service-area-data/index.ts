// src/lib/service-area-data/index.ts
//
// Barrel for all service-area (city) data modules. This is the single place
// that knows which cities exist, so nothing else has to hardcode the list.
//
// To add a city: create `./<city>.ts` exporting a `ServiceAreaData`, import it
// below, and add it to `serviceAreaRegistry`. Nothing else needs to change.

import type { ServiceAreaData } from "../service-area-types";
import { rogers } from "./rogers";
import { mapleGrove } from "./maple-grove";
import { plymouth } from "./plymouth";
import { coonRapids } from "./coon-rapids";
import { stMichael } from "./st-michael";
import { edenPrairie } from "./eden-prairie";

export const serviceAreaRegistry = {
  rogers,
  "maple-grove": mapleGrove,
  plymouth,
  "coon-rapids": coonRapids,
  "st-michael": stMichael,
  "eden-prairie": edenPrairie,
} as const satisfies Record<string, ServiceAreaData>;

export type ServiceAreaSlug = keyof typeof serviceAreaRegistry;

export const allServiceAreas: ServiceAreaData[] =
  Object.values(serviceAreaRegistry);
