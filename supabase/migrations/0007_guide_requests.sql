-- 0007_guide_requests.sql
--
-- ============================================================================
-- HELD FOR PERPLEXITY REVIEW -- DO NOT APPLY UNTIL APPROVED (Rule 16)
-- ============================================================================
-- Ticket P1.43 (Resources Hub) needs a table to store gated-guide email
-- captures. The table does NOT exist on the live project yet (verified via the
-- Supabase connector: public schema has only leads, team_members,
-- portfolio_items, testimonials, job_listings). The ticket's "guide_requests
-- already exists" dependency was inaccurate -- INT-001 documents the leads ->
-- Roofr/Zapier sync, not this table.
--
-- The A-UI PR (form + server action) is written against this proposed shape
-- and is safe to merge, but the gated-form write cannot be runtime-verified
-- until this migration is reviewed and applied.
--
-- These captures are NOT sales leads: do not sync to Roofr, and no
-- Roofr/Zapier automation should ever fire from this table (Rule 17).
-- ============================================================================

create table if not exists public.guide_requests (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null,
  email           text not null,
  guide_slug      text not null,          -- which gated resource was requested
  source_channel  text not null default 'Website',
  landing_url     text,                   -- attribution parity with leads
  utm_source      text,
  utm_medium      text,
  utm_campaign    text
);

comment on table public.guide_requests is
  'Gated resource (cost guide) email captures from /resources posts (P1.43). Not sales leads; never synced to Roofr/Zapier (Rule 17).';

-- RLS on, no permissive policies: inserts run through the submit-guide-request
-- server action using the service_role key, which bypasses RLS (same pattern as
-- public.leads). The anon key has no access.
alter table public.guide_requests enable row level security;
