import Link from "next/link";
import { listPages } from "@/lib/page-content/registry";
import { getPendingDrafts } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

/**
 * Edit-content landing. Lists every editable page + a pending-changes
 * summary. Clicking a page jumps to that page with ?edit=1 which flips it
 * into inline edit mode.
 */
export default async function EditContentLanding() {
  const pages = listPages();
  const drafts = await getPendingDrafts();
  const totalPending = drafts.textBlocks.length + drafts.photoSlots.length;

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display font-bold text-2xl text-ink tracking-tight">
        Edit content
      </h1>
      <p className="mt-2 text-sm text-muted">
        Click a page to open it in edit mode. Hover any editable text or photo to change it. Edits save as drafts. Approve edits when ready to push them live.
      </p>

      {totalPending > 0 ? (
        <div className="mt-5 border border-amber-300 bg-amber-50 rounded p-4">
          <p className="font-display font-semibold text-sm text-amber-900">
            {totalPending} pending {totalPending === 1 ? "edit" : "edits"} across the site
          </p>
          <p className="text-xs text-amber-800 mt-1">
            Open any page in edit mode and use the bottom bar to review and publish.
          </p>
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pages.map((page) => (
          <Link
            key={page.key}
            href={`${page.route}?edit=1`}
            className="border border-faint rounded-lg p-4 bg-paper hover:border-navy transition"
          >
            <p className="font-display font-bold text-lg text-ink">{page.label}</p>
            <p className="text-xs text-muted mt-0.5 font-mono">{page.route}</p>
            <p className="mt-2 text-xs text-muted">
              {page.photoSlots.length} photo {page.photoSlots.length === 1 ? "slot" : "slots"} &middot; {page.textBlocks.length} text{" "}
              {page.textBlocks.length === 1 ? "block" : "blocks"}
            </p>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-[11px] text-muted">
        Additional pages appear here as they are added to the editable content registry (see roadmap: PR #110 services, PR #111 process/warranty/consultation, PR #112 contact/team/careers, PR #113 resources/financing/legal).
      </p>
    </div>
  );
}
