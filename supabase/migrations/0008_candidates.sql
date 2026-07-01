-- 0008_candidates.sql
--
-- ============================================================================
-- HELD FOR PERPLEXITY REVIEW -- DO NOT APPLY UNTIL APPROVED (Rule 16)
-- ============================================================================
-- Ticket D (Employee Candidate form on /team). Adds a table for job-candidate
-- submissions and a private storage bucket for uploaded resumes.
--
-- These are NOT sales leads: structurally separate from public.leads, never
-- synced to Roofr, and no Roofr/Zapier automation may fire from this table
-- (Rule 17). The candidate form UI (submit-candidate action + component) is
-- built against this proposed shape and is safe to merge, but its live insert
-- and resume upload cannot be runtime-verified until this migration is
-- reviewed and applied.
-- ============================================================================

-- ── candidates table ────────────────────────────────────────────────────────
create table if not exists public.candidates (
  id                  uuid          primary key default gen_random_uuid(),
  created_at          timestamptz   not null default now(),
  name                text          not null,
  email               text          not null,
  phone               text,
  role_interest       text,
  experience_summary  text,
  resume_storage_path text,                       -- path within candidate-resumes bucket
  status              text          default 'new' -- 'new' / 'reviewing' / 'contacted' / 'closed'
);

comment on table public.candidates is
  'Job-candidate submissions from the /team careers form (Ticket D). Not sales leads; never synced to Roofr/Zapier (Rule 17).';

-- ── Row-Level Security ──────────────────────────────────────────────────────
-- No permissive policies: inserts run through the submit-candidate server
-- action using the service_role key, which bypasses RLS. The anon key has no
-- access -- candidate PII and resumes are never readable by the public.
alter table public.candidates enable row level security;

-- ── Private resume storage bucket ───────────────────────────────────────────
-- Mirrors the private lead-photos pattern: public = false, no anon/authenticated
-- storage.objects policies, so only the service_role (server-side) can write or
-- read. Resume files are never served publicly.
insert into storage.buckets (id, name, public)
values ('candidate-resumes', 'candidate-resumes', false)
on conflict (id) do nothing;
