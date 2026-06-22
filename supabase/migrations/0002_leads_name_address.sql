-- ALREADY APPLIED by Perplexity (Orchestrator) on 2026-06-18 via Supabase MCP connector.
-- Committed here for repo parity only. DO NOT re-run this migration.
--
-- Migration: 0002_leads_name_address
-- Project:   jpcycdfayzvsbblgmmfu (MRRENOVATIONS's Project)
-- Triggered by: Roofr audit FLAG 1 (split name) + FLAG 2 (structured address)
--
-- Changes (all additive — live P1.2 forms continue working during transition):
--   - Added nullable columns: first_name, last_name, street_address, city, state, zip
--   - source_channel default set to 'Website'
--   - full_name retained as NOT NULL (dropped in migration 0003 after Phase 1.2b bakes)

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS first_name     text,
  ADD COLUMN IF NOT EXISTS last_name      text,
  ADD COLUMN IF NOT EXISTS street_address text,
  ADD COLUMN IF NOT EXISTS city           text,
  ADD COLUMN IF NOT EXISTS state          text,
  ADD COLUMN IF NOT EXISTS zip            text;

ALTER TABLE public.leads
  ALTER COLUMN source_channel SET DEFAULT 'Website';