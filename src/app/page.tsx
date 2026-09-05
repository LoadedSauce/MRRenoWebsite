import type { Metadata } from "next";
import { buildHomeMetadata } from "@/lib/seo/routes";
import { HomePageBody } from "@/components/templates/HomePageBody";

export const revalidate = 3600;

export const metadata: Metadata = buildHomeMetadata();

/**
 * Canonical home page. The entire visible body lives in HomePageBody, which
 * is shared with /magazine (INT-004). Edit content there, not here.
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <HomePageBody searchParams={searchParams} />;
}
