import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser-safe Supabase client.
 * Uses the anon key -- subject to RLS policies.
 * Safe to import in client components.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
