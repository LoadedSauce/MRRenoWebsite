/**
 * Lead row shape mirrors the public.leads schema (SCHEMA-001).
 * form_type is a CHECK-constrained enum at the DB layer.
 */

export type FormType = "consultation" | "contact";

export type LeadStatus = "new" | "contacted" | "qualified" | "dead";

/**
 * Payload submitted from a client form to the submitLead Server Action.
 * Matches columns in public.leads. Nullable fields can be omitted or null.
 */
export interface LeadSubmission {
  form_type: FormType;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  project_type?: string | null;
  project_details?: string | null;
  preferred_contact?: string | null;
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
