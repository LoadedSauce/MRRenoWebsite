import type { ReactNode } from "react";
import { EditableTextClient } from "./EditableText.client";
import type { PageContent } from "@/lib/page-content/loader";

interface EditableTextProps {
  content: PageContent;
  blockKey: string;
  fallback: string;
  /** Optional wrapper: pass a fn to render the resolved string. Default: text as-is. */
  render?: (value: string) => ReactNode;
  /** Force textarea vs input in edit mode. Registry hint takes precedence when omitted. */
  multiline?: boolean;
}

/**
 * Server component. Resolves the text via `content.text(...)` and, when in
 * edit mode, wraps the output in an edit chrome (client component).
 *
 * Every editable string on a page uses this so registry, admin overlay, and
 * public rendering stay in one flow.
 */
export function EditableText({ content, blockKey, fallback, render, multiline }: EditableTextProps) {
  const value = content.text(blockKey, fallback);
  const rendered = render ? render(value) : value;

  if (!content.isEditMode) {
    return <>{rendered}</>;
  }

  return (
    <EditableTextClient
      blockKey={blockKey}
      value={value}
      isDirty={content.isDirty(blockKey)}
      multiline={multiline ?? false}
    >
      {rendered}
    </EditableTextClient>
  );
}
