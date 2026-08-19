-- Migration 0010_admin_sections_featured
-- Admin Panel enhancements: team sections + portfolio featured flag
-- Rule 8 approval: Chris Hunter, 2026-08-19 (Admin Page request)

-- team_members: add section column
-- Sections: Owner / CSM+Production+Coordination / Sales / Crew
alter table public.team_members
  add column if not exists section text
    not null
    default 'Crew'
    check (section in (
      'Owner',
      'Customer Service, Production & Coordination',
      'Sales',
      'Crew'
    ));

comment on column public.team_members.section is
  'Display group on the admin Team page and public site. One of: Owner, Customer Service Production & Coordination, Sales, Crew.';

-- portfolio_items: add featured flag
-- Homepage shows 3 featured items. Admin UI enforces max 3.
alter table public.portfolio_items
  add column if not exists featured boolean
    not null
    default false;

comment on column public.portfolio_items.featured is
  'When true, item appears in the homepage featured strip. Admin enforces a maximum of 3.';

-- Partial index to keep the featured lookup snappy
create index if not exists portfolio_items_featured_idx
  on public.portfolio_items (display_order)
  where featured = true and active = true;
