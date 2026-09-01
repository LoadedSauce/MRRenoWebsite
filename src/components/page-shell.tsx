import { type ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { loadPageContent } from "@/lib/page-content/loader";

interface PageShellProps {
  children: ReactNode;
}

/**
 * Server component. Loads the shared `global` page content once per render
 * and hands the resolved strings to the header (client component) as props
 * and to the footer (server component) which reads live/draft directly
 * through EditableText.
 *
 * Global copy is edited from the admin sidebar via `/admin/edit?page=global`,
 * not by clicking chrome in the header itself (header cannot host server
 * components). Footer strings do render with inline click-to-edit chrome.
 */
export async function PageShell({ children }: PageShellProps) {
  // Header/footer are shared across every route, so the global surface is
  // never in edit mode from the page shell's perspective. `?edit=1` is
  // scoped to per-page overlays; global copy is authored via the sidebar.
  const globalContent = await loadPageContent("global", false);

  const headerStrings = {
    utilityFamilyOwned: globalContent.text("global.header.utility.family-owned", "Family-owned"),
    utilityYears: globalContent.text("global.header.utility.years", "40+ Years"),
    utilityWarranty: globalContent.text(
      "global.header.utility.warranty",
      "Lifetime Transferable Workmanship Warranty"
    ),
    brandTagline: globalContent.text("global.header.brand.tagline", "Design | Build | Renovate"),
    cta: globalContent.text("global.header.cta", "Free Estimate"),
    mobileCallLabel: globalContent.text("global.header.mobile.call-label", "Call 763-900-2024"),
  };

  return (
    <>
      <SiteHeader strings={headerStrings} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter content={globalContent} />
    </>
  );
}
