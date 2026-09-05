-- ============================================================================
-- 0015_qr_tracking.sql
-- INT-004 - QR scan tracking
--
-- Additive only. Creates two tables, two nullable columns on leads, one view,
-- and patches int001_notify_zapier_new_lead() to read its source tag from the
-- QR registry. No existing data is modified.
--
-- NOTE: this migration was applied directly to the production project
-- (jpcycdfayzvsbblgmmfu) before it was committed. It is recorded here so the
-- repo matches the live database and a fresh environment can be rebuilt from
-- migrations alone. Every statement is idempotent.
--
-- Reverse: see the DOWN block at the bottom of this file.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. The registry. One row per printed code. Adding a print placement is an
--    INSERT here, not a deploy.
-- ---------------------------------------------------------------------------
create table if not exists public.qr_codes (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  slug              text not null unique,          -- the /r/<slug> path segment
  label             text not null,                 -- human name, shown in reports
  channel           text not null default 'print', -- print | signage | vehicle | event | mail
  destination_path  text not null default '/',     -- where the scanner lands
  utm_source        text not null,
  utm_medium        text not null default 'print',
  utm_campaign      text,
  utm_content       text,
  roofr_tag         text,                          -- e.g. MGMAG -> "Jane Doe- Kitchen (MGMAG)"
  source_channel    text,                          -- e.g. 'Maple Grove Magazine'
  cost_cents        integer,                       -- what the placement cost, for ROI
  quantity          integer,                       -- circulation / print run, optional
  run_starts_on     date,
  run_ends_on       date,
  notes             text,
  is_active         boolean not null default true,
  constraint qr_codes_slug_format check (slug ~ '^[a-z0-9][a-z0-9-]{1,30}$')
);

comment on table  public.qr_codes is
  'INT-004. One row per printed QR code. The /r/<slug> route reads this to log the scan and build the redirect. Destination and UTMs are editable after the piece is printed.';
comment on column public.qr_codes.slug is
  'Path segment in /r/<slug>. Keep it short - every character adds modules to the printed code.';
comment on column public.qr_codes.roofr_tag is
  'Source marker appended to the Roofr job name, in the same convention as WL / GA / MA.';
comment on column public.qr_codes.cost_cents is
  'Placement cost in cents. Drives cost_per_scan and cost_per_lead in public.qr_performance.';

-- ---------------------------------------------------------------------------
-- 2. The log. One row per hit on /r/<slug>.
-- ---------------------------------------------------------------------------
create table if not exists public.qr_scans (
  id           uuid primary key default gen_random_uuid(),
  scanned_at   timestamptz not null default now(),
  qr_code_id   uuid not null references public.qr_codes(id) on delete cascade,
  slug         text not null,
  is_repeat    boolean not null default false,  -- same device already scanned this code
  is_bot       boolean not null default false,  -- link previewer / crawler, not a person
  user_agent   text,
  referer      text,
  ip_hash      text,                            -- salted SHA-256. Raw IP is never stored.
  city         text,
  region       text,
  country      text
);

comment on table  public.qr_scans is
  'INT-004. Append-only log of QR scans. is_repeat and is_bot are filtered out of the headline scan count in public.qr_performance.';
comment on column public.qr_scans.ip_hash is
  'SHA-256 of (IP + QR_IP_SALT). Used only for coarse repeat detection. The raw address is never written.';

create index if not exists qr_scans_code_time_idx on public.qr_scans (qr_code_id, scanned_at desc);
create index if not exists qr_scans_time_idx      on public.qr_scans (scanned_at desc);
create index if not exists qr_scans_real_idx      on public.qr_scans (qr_code_id)
  where is_bot = false and is_repeat = false;

-- ---------------------------------------------------------------------------
-- 3. Link a lead back to the scan that produced it.
--    Exact join via scan id, not inferred from UTM strings.
-- ---------------------------------------------------------------------------
alter table public.leads
  add column if not exists qr_code_slug text,
  add column if not exists qr_scan_id   uuid references public.qr_scans(id) on delete set null;

comment on column public.leads.qr_code_slug is
  'INT-004. Slug of the QR code this lead first arrived through. Set server-side in submitLead from the httpOnly mr_qr cookie.';
comment on column public.leads.qr_scan_id is
  'INT-004. Exact scan that produced this lead. Preferred over UTM matching.';

create index if not exists leads_qr_slug_idx on public.leads (qr_code_slug)
  where qr_code_slug is not null;

-- ---------------------------------------------------------------------------
-- 4. RLS. Both tables are service-role only, matching the project rule that
--    all writes go through service-role API routes. No anon policies are
--    created, so the anon key cannot read or write either table.
-- ---------------------------------------------------------------------------
alter table public.qr_codes enable row level security;
alter table public.qr_scans enable row level security;

-- ---------------------------------------------------------------------------
-- 5. The reporting view. This is what the admin KPI card reads.
-- ---------------------------------------------------------------------------
create or replace view public.qr_performance as
select
  c.slug,
  c.label,
  c.channel,
  c.utm_campaign,
  c.is_active,
  c.run_starts_on,
  c.run_ends_on,
  round(c.cost_cents / 100.0, 2)                                as cost_dollars,
  coalesce(s.scans, 0)                                          as scans,
  coalesce(s.hits, 0)                                           as total_hits,
  coalesce(s.bot_hits, 0)                                       as bot_hits,
  s.first_scan_at,
  s.last_scan_at,
  coalesce(l.leads, 0)                                          as leads,
  coalesce(l.consultations, 0)                                  as consultations,
  coalesce(l.reached_roofr, 0)                                  as reached_roofr,
  round((c.cost_cents / 100.0) / nullif(s.scans, 0), 2)         as cost_per_scan,
  round((c.cost_cents / 100.0) / nullif(l.leads, 0), 2)         as cost_per_lead,
  round(100.0 * l.leads / nullif(s.scans, 0), 1)                as scan_to_lead_pct
from public.qr_codes c
left join lateral (
  select
    count(*) filter (where not is_bot and not is_repeat) as scans,
    count(*) filter (where not is_bot)                   as hits,
    count(*) filter (where is_bot)                       as bot_hits,
    min(scanned_at) filter (where not is_bot)            as first_scan_at,
    max(scanned_at) filter (where not is_bot)            as last_scan_at
  from public.qr_scans
  where qr_code_id = c.id
) s on true
left join lateral (
  select
    count(*)                                             as leads,
    count(*) filter (where form_type = 'consultation')   as consultations,
    count(*) filter (where synced_to_roofr)              as reached_roofr
  from public.leads
  where qr_code_slug = c.slug
) l on true;

comment on view public.qr_performance is
  'INT-004. One row per QR code: scans, leads, and cost efficiency. scans excludes bots and same-device repeats; total_hits does not.';

-- Views default to SECURITY DEFINER semantics, which would let the anon key
-- read this through PostgREST and bypass RLS on qr_scans and leads.
-- Force invoker semantics and keep the view service-role only.
alter view public.qr_performance set (security_invoker = on);
revoke all on public.qr_performance from anon, authenticated;
grant select on public.qr_performance to service_role;

-- ---------------------------------------------------------------------------
-- 6. Patch the Roofr job-name tag to read from the registry.
--    Everything else in this function is unchanged from
--    int001_gate_on_roofr_requirements_only.
--    After this, a new print channel needs no SQL - just a qr_codes row.
-- ---------------------------------------------------------------------------
create or replace function public.int001_notify_zapier_new_lead()
 returns trigger
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  v_url      text;
  v_secret   text;
  v_short    text;
  v_tag      text;
  v_job_name text;
begin
  select decrypted_secret into v_url
    from vault.decrypted_secrets
   where name = 'int001_hook_url'
   limit 1;

  -- Not configured yet: do nothing, silently. Also the kill switch.
  if coalesce(v_url, '') = '' then
    return null;
  end if;

  select decrypted_secret into v_secret
    from vault.decrypted_secrets
   where name = 'int001_hook_secret'
   limit 1;

  -- Shorten our form's project names to match how the board already reads.
  v_short := case new.project_type
               when 'Kitchen Remodel'        then 'Kitchen'
               when 'Bathroom Remodel'       then 'Bathroom'
               when 'Basement Finishing'     then 'Basement'
               when 'Home Addition'          then 'Addition'
               when 'Whole-Home Renovation'  then 'Whole-Home'
               when 'Exterior Renovation'    then 'Exterior'
               else nullif(trim(coalesce(new.project_type, '')), '')
             end;

  -- The contact form collects no project type.
  v_short := coalesce(v_short, case when new.form_type = 'contact'
                                    then 'Inquiry' else 'Project' end);

  -- INT-004: a QR-sourced lead carries its tag in the registry.
  if new.qr_code_slug is not null then
    select nullif(trim(roofr_tag), '') into v_tag
      from public.qr_codes
     where slug = new.qr_code_slug
     limit 1;
  end if;

  v_tag := coalesce(v_tag,
             case lower(coalesce(new.source_channel, ''))
               when 'google ads' then 'GA'
               when 'meta ads'   then 'MA'
               else 'WL'
             end);

  v_job_name := trim(concat_ws(' ', new.first_name, new.last_name))
                || '- ' || v_short || ' (' || v_tag || ')';

  perform net.http_post(
    url := v_url,
    body := jsonb_build_object(
      'type',     'INSERT',
      'table',    'leads',
      'schema',   'public',
      'secret',   coalesce(v_secret, ''),
      'job_name', v_job_name,
      'record',   to_jsonb(new)
    ),
    headers := jsonb_build_object(
      'Content-Type',     'application/json',
      'X-Webhook-Secret', coalesce(v_secret, '')
    ),
    timeout_milliseconds := 5000
  );

  return null;
exception when others then
  -- A webhook problem must never cost us the lead. Log and move on.
  raise warning 'INT-001 webhook dispatch failed for lead %: %', new.id, sqlerrm;
  return null;
end;
$function$;

-- ---------------------------------------------------------------------------
-- 7. Seed the first code.
-- ---------------------------------------------------------------------------
insert into public.qr_codes
  (slug, label, channel, destination_path,
   utm_source, utm_medium, utm_campaign,
   roofr_tag, source_channel, cost_cents, notes)
values
  ('mgmag',
   'Maple Grove Magazine - 1/3 page',
   'print',
   '/',
   'mgmag', 'print', 'mgmag_2026',
   'MGMAG', 'Maple Grove Magazine', null,
   'First print placement. Set cost_cents once the invoice is in. Change destination_path to a dedicated landing page when one exists - the printed code does not change.')
on conflict (slug) do nothing;

-- ============================================================================
-- DOWN (reverse this migration)
-- ============================================================================
-- drop view if exists public.qr_performance;
-- alter table public.leads drop column if exists qr_scan_id;
-- alter table public.leads drop column if exists qr_code_slug;
-- drop table if exists public.qr_scans;
-- drop table if exists public.qr_codes;
-- then re-apply int001_gate_on_roofr_requirements_only to restore the function.
