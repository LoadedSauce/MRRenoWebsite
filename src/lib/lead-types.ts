/**
 * Lead row shape mirrors the public.leads schema (SCHEMA-002).
 * form_type is a CHECK-constrained enum at the DB layer.
 */

export type FormType = "consultation" | "contact";

export type LeadStatus = "new" | "contacted" | "qualified" | "dead";

/**
 * Payload submitted from a client form to the submitLead Server Action.
 * Matches columns in public.leads. Nullable fields can be omitted or null.
 *
 * SCHEMA-002 additions (Phase 1.2b):
 *   first_name / last_name replace the single `name` field on the form side.
 *   full_name is composed server-side for the legacy NOT-NULL column (dropped
 *   in migration 0003 after this ticket bakes on staging).
 *   street_address / city / state / zip support the Roofr "Create Job" action.
 *
 * FORM-PHOTOS addition:
 *   photo_data_urls carries base64-encoded photo data from the client so the
 *   server action can upload them to Supabase Storage. Each entry is a
 *   data URL (data:<mime>;base64,<data>). Max 5 items, max 10MB each --
 *   enforced at the form layer before submission. The server action strips
 *   the data URL prefix, decodes the bytes, and uploads to the lead-photos
 *   bucket using the service role key.
 */
export interface LeadSubmission {
  form_type: FormType;
  // Split name -- both required at the form layer
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  project_type?: string | null;
  project_details?: string | null;
  preferred_contact?: string | null;
  // Structured address -- required on consultation, optional on contact
  street_address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  // Attribution context -- captured by the client from window.location at submit time
  landing_url?: string | null;
  source_channel?: string | null;
  source_campaign?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  // FORM-PHOTOS: optional photo data URLs (base64 encoded), max 5
  photo_data_urls?: string[] | null;
  // FORM-PHOTOS: original filenames parallel to photo_data_urls (for storage path)
  photo_filenames?: string[] | null;
}

export interface SubmitResult {
  ok: boolean;
  /** Human-readable error message -- never leaks Supabase internals to client. */
  error?: string;
}
