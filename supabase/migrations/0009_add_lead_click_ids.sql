-- 0009_add_lead_click_ids.sql
--
-- Ticket E: capture Google/Meta click identifiers on inbound leads so lead
-- counts can be reconciled against ad-platform-reported numbers, and (Ticket F)
-- so offline conversions can be matched back to the originating click.
--
-- Additive + nullable: no existing rows change, fully reversible. This MUST be
-- live before the gclid/fbclid capture code ships, or lead INSERTs that include
-- these keys would be rejected. Applied to the live project via the Supabase
-- connector (migration name: add_lead_click_ids) on 2026-07-07.

alter table public.leads
  add column if not exists gclid text,
  add column if not exists fbclid text;

comment on column public.leads.gclid is 'Google Ads click identifier (gclid) captured client-side from the landing URL at form-submit time. Nullable.';
comment on column public.leads.fbclid is 'Meta click identifier (fbclid) captured client-side from the landing URL at form-submit time. Nullable.';
