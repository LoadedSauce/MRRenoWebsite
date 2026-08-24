import { getPendingDrafts } from "@/lib/supabase/queries";
import { EditModeOverlayClient } from "./EditModeOverlay.client";
import { EditModeLinkSuppressor } from "./EditModeLinkSuppressor";

/**
 * Renders the persistent bottom bar shown when a page is in edit mode.
 * Fetches pending drafts server-side so the initial paint knows the count.
 * The client component handles publish/revert transitions.
 *
 * Also mounts EditModeLinkSuppressor to stop clicks inside <a>/<Link>
 * elements from navigating away while editing (e.g. clicking a text block
 * on the homepage services grid used to route to the service hub before
 * the edit chrome could open).
 *
 * Placed once at the page (or layout) level, above <PageShell>.
 */
export async function EditModeOverlay({ currentPath }: { currentPath: string }) {
  const drafts = await getPendingDrafts();
  return (
    <>
      <EditModeLinkSuppressor />
      <EditModeOverlayClient drafts={drafts} currentPath={currentPath} />
    </>
  );
}
