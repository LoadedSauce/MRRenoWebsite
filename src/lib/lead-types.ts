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
 */
export interface LeadSubmission {
  form_type: FormType;
  // Split name — both required at the form layer
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  project_type?: string | null;
  project_details?: string | null;
  preferred_contact?: string | null;
  // Structured address — required on consultation, optional on contact
  street_address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  // Attribution context — captured by the client from window.location at submit time
  landing_url?: string | null;
  source_channel?: string | null;
  source_campaign?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
}

export interface SubmitResult {
  ok: boolean;
  /** Human-readable error message — never leaks Supabase internals to client. */
  error?: string;
}