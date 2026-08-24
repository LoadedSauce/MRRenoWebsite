import { getPendingDrafts } from "@/lib/supabase/queries";
import { EditModeOverlayClient } from "./EditModeOverlay.client";

/**
 * Renders the persistent bottom bar shown when a page is in edit mode.
 * Fetches pending drafts server-side so the initial paint knows the count.
 * The client component handles publish/revert transitions.
 *
 * Placed once at the page (or layout) level, above <PageShell>.
 */
export async function EditModeOverlay({ currentPath }: { currentPath: string }) {
  const drafts = await getPendingDrafts();
  return <EditModeOverlayClient drafts={drafts} currentPath={currentPath} />;
}
