-- ════════════════════════════════════════════════════════════════════════════
-- Migration: 0001_create_leads_table
-- Ticket:    SCHEMA-001
-- Status:    ALREADY APPLIED on Supabase project jpcycdfayzvsbblgmmfu
--            via the Supabase MCP connector by Perplexity on June 18, 2026.
--
-- This file is committed to the repo for version-control parity and to act
-- as the canonical schema reference. DO NOT re-run it against the same
-- project (the table already exists). It serves as documentation and a
-- bootstrap script for fresh Supabase environments (e.g. a future staging
-- database or local Supabase CLI dev setup).
-- ════════════════════════════════════════════════════════════════════════════

-- ── leads table ─────────────────────────────────────────────────────────────
create table if not exists public.leads (
  id                uuid          primary key default gen_random_uuid(),
  created_at        timestamptz   not null default now(),

  -- enum-style: 'consultation' (Free Consultation page) or 'contact' (Contact page)
  form_type         text          not null
                                  check (form_type in ('consultation', 'contact')),

  full_name         text          not null,
  email             text,
  phone             text,
  project_type      text,
  project_details   text,
  preferred_contact text,

  -- Attribution context — captured by the client at submit time. Carried
  -- through to Roofr by the INT-001 Zapier sync.
  source_channel    text,
  source_campaign   text,
  landing_url       text,
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  utm_term          text,
  utm_content       text,

  -- Reserved for downstream scoring (Phase 2+).
  lead_score        integer,

  -- Workflow status — 'new' / 'contacted' / 'qualified' / 'dead'.
  status            text          default 'new',

  -- Roofr sync tracking — flipped to true by INT-001 Zapier on successful
  -- push to Roofr. The application itself never writes these columns.
  synced_to_roofr   boolean       default false,
  roofr_synced_at   timestamptz
);

-- ── Row-Level Security ──────────────────────────────────────────────────────
alter table public.leads enable row level security;

-- Public website (anon role) can INSERT a lead. Anyone can submit a form.
create policy leads_anon_insert
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- No SELECT / UPDATE / DELETE policies for anon — those operations are
-- restricted to service_role (which bypasses RLS by design). This means:
--   • Anonymous browsers CAN insert their own lead.
--   • Anonymous browsers CANNOT read, edit, or delete any leads.
--   • Roofr sync (INT-001) and any future admin tooling must use the
--     service_role key, server-side only.
