"use client";

import { useEffect } from "react";

/**
 * While the page is in edit mode, disable link navigation so clicking an
 * <EditableText> or <EditablePhoto> that happens to be inside an <a>/<Link>
 * opens the edit chrome instead of navigating away.
 *
 * Attaches a capture-phase click listener on document.body that:
 *   1. Finds the nearest ancestor anchor with an href.
 *   2. If none, does nothing (non-link clicks are unaffected).
 *   3. If the anchor opts in with `data-edit-mode-nav`, does nothing --
 *      this is the escape hatch used by the EditModeOverlay's Exit link and
 *      admin sidebar links so admins can still navigate away from edit mode.
 *   4. Otherwise, calls preventDefault + stopPropagation, which cancels
 *      both the browser's native anchor navigation and Next.js's client-side
 *      Link handler (Next's onClick lives on the same anchor).
 *
 * Rendered only from EditModeOverlay, which only renders when isEditMode is
 * true, so this listener is scoped to edit-mode renders and unmounts cleanly
 * when the admin exits edit mode.\n */
export function EditModeLinkSuppressor() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Only intercept primary-button clicks without modifier keys. Cmd/Ctrl-
      // click, middle-click, right-click still work (open in new tab, etc.)
      // so admins can preview a page in a new tab without leaving edit mode.
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as Element | null;
      if (!target) return;

      const anchor = target.closest("a[href]");
      if (!anchor) return;

      // Explicit opt-out for admin nav (Exit edit mode, sidebar links).
      if (anchor.hasAttribute("data-edit-mode-nav")) return;

      e.preventDefault();
      e.stopPropagation();
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  return null;
}
