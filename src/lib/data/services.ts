// src/lib/data/services.ts
//
// Adapter between the P1.4 content registries and the contract the SEO layer
// (src/lib/seo/*) expects. The SEO files import ONLY from here â€” they never
// reach into `service-data.ts` or `service-area-data/*` directly. This keeps
// the SEO layer decoupled from the shape of the content registries: if the
// content layer changes field names later, only this adapter moves.
//
// Mapping performed here (thin, no business logic):
//   ServiceData.displayName        -> Service.name
//   ServiceData.slug               -> Service.slug   (canonical short slugs)
//   ServiceAreaData.cityName       -> ServiceArea.name
//   ServiceAreaData.citySlug       -> ServiceArea.slug
//   (synthesized)                  -> ServiceArea.isActive = true

import { serviceRegistry, type ServiceData } from "@/lib/service-data";
import { allServiceAreas } from "@/lib/service-area-data";
import type { ServiceAreaData } from "@/lib/service-area-types";

// The contract the SEO layer consumes. Structurally compatible with
// `ServiceLike` / `ServiceAreaLike` in src/lib/seo/routes.ts, so the values
// returned here can be passed straight into the metadata/schema builders.
export interface Service {
  slug: string;
  name: string;
  shortLabel?: string;
  description?: string;
}

export interface ServiceArea {
  slug: string;
  name: string;
  isActive?: boolean;
}

function toService(data: ServiceData): Service {
  return { slug: data.slug, name: data.displayName };
}

function toServiceArea(data: ServiceAreaData): ServiceArea {
  return { slug: data.citySlug, name: data.cityName, isActive: true };
}

export function getAllServices(): Service[] {
  return Object.values(serviceRegistry).map(toService);
}

export function getService(slug: string): Service | undefined {
  const data = (serviceRegistry as Record<string, ServiceData>)[slug];
  return data ? toService(data) : undefined;
}

export function getAllServiceAreas(): ServiceArea[] {
  return allServiceAreas.map(toServiceArea);
}

export function getServiceArea(slug: string): ServiceArea | undefined {
  const data = allServiceAreas.find((a) => a.citySlug === slug);
  return data ? toServiceArea(data) : undefined;
}
