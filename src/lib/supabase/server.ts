import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Server-side Supabase client using the service role key.
 * Bypasses RLS -- for use in Server Actions and API routes ONLY.
 *
 * Rule 7 (v2.7): This client may only be used under /app/admin/ and in
 * server-side API routes that handle data writes. It must NEVER appear
 * in any NEXT_PUBLIC_ variable, any client component, or any publicly
 * accessible route.
 *
 * Import this function -- do not import the client directly -- so that
 * it is instantiated per-request and not shared across requests.
 */
export function createServiceRoleClient() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
