-- Migration 0003 — Drop legacy full_name column
-- APPLIED to Supabase on 2026-06-22 via apply_migration (DO NOT re-run; IF EXISTS makes it a safe no-op).
--
-- Context: full_name was the original single name field. SCHEMA-002 (Phase 1.2b) added
-- first_name/last_name; the server action composed full_name to satisfy this NOT-NULL
-- column. Phase 1.2d (PR #6 → main, PR #7 → staging) removed the full_name writer from
-- submit-lead.ts in BOTH environments. With nothing writing or reading full_name
-- (0 dependent views, 0 rows at drop time), the column is now safe to remove.
-- first_name / last_name are the canonical name fields going forward.

ALTER TABLE public.leads DROP COLUMN IF EXISTS full_name;
