import type { ReactNode } from "react";
import { EditablePhotoClient } from "./EditablePhoto.client";
import { getAllActivePortfolioItems } from "@/lib/supabase/queries";
import type { PageContent } from "@/lib/page-content/loader";

interface EditablePhotoProps {
  content: PageContent;
  slotKey: string;
  fallback: { src: string; alt: string };
  /**
   * Render function: receives the resolved { src, alt } and returns the
   * image element the page normally renders. Keeps aspect-ratio, sizes,
   * className etc. in the page's control.
   */
  render: (resolved: { src: string; alt: string }) => ReactNode;
}

/**
 * Server component. Resolves the photo via content.photo(...) and, when in
 * edit mode, wraps the output in an edit chrome (client component).
 *
 * In edit mode the client component receives the full active portfolio list
 * so its picker modal has no extra round trip. Cost is one query per page in
 * edit mode; unused in public mode.
 */
export async function EditablePhoto({ content, slotKey, fallback, render }: EditablePhotoProps) {
  const resolved = content.photo(slotKey, fallback);
  const rendered = render(resolved);

  if (!content.isEditMode) {
    return <>{rendered}</>;
  }

  const pool = await getAllActivePortfolioItems();
  const currentId =
    content.admin.photoSlots[slotKey]?.draft?.id ??
    content.admin.photoSlots[slotKey]?.live?.id ??
    null;

  return (
    <EditablePhotoClient
      slotKey={slotKey}
      isDirty={content.isDirty(slotKey)}
      currentId={currentId}
      pool={pool.map((p) => ({
        id: p.id,
        photo_url: p.photo_url,
        caption: p.caption,
        service: p.service,
      }))}
    >
      {rendered}
    </EditablePhotoClient>
  );
}
