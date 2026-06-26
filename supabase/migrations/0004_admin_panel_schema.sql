-- Migration 0004_admin_panel_schema
-- Phase 1 Admin Panel ADM-1
-- Creates team_members, portfolio_items, testimonials, job_listings tables with RLS.

-- team_members
create table if not exists public.team_members (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text        not null,
  role          text        not null,
  photo_url     text,
  display_order integer     not null default 0,
  active        boolean     not null default true
);

alter table public.team_members enable row level security;

-- Public site reads active members
create policy "team_members_public_read"
  on public.team_members
  for select
  to anon, authenticated
  using (active = true);

-- portfolio_items
create table if not exists public.portfolio_items (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  photo_url     text        not null,
  caption       text,
  service       text        check (service in ('kitchens','bathrooms','basements','additions','whole-home','exterior')),
  city          text,
  display_order integer     not null default 0,
  active        boolean     not null default true
);

alter table public.portfolio_items enable row level security;

create policy "portfolio_items_public_read"
  on public.portfolio_items
  for select
  to anon, authenticated
  using (active = true);

-- testimonials
create table if not exists public.testimonials (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  quote         text        not null,
  author_name   text        not null,
  city          text,
  service       text        check (service in ('kitchens','bathrooms','basements','additions','whole-home','exterior') or service is null),
  active        boolean     not null default true,
  display_order integer     not null default 0
);

alter table public.testimonials enable row level security;

create policy "testimonials_public_read"
  on public.testimonials
  for select
  to anon, authenticated
  using (active = true);

-- job_listings
create table if not exists public.job_listings (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  title         text        not null,
  description   text        not null,
  active        boolean     not null default true,
  display_order integer     not null default 0
);

alter table public.job_listings enable row level security;

create policy "job_listings_public_read"
  on public.job_listings
  for select
  to anon, authenticated
  using (active = true);
