-- Migration 0011_portfolio_service_featured
-- Per-service featuring for portfolio_items.
-- Rule 8 approval: Chris Hunter, 2026-08-21 (in-session confirmation).
-- Applied to prod on 2026-08-21.

-- A NULL value means "not featured on the service page"; a non-null integer
-- is the display order within that service's featured strip. The admin UI
-- enforces a per-service cap (MAX_FEATURED_PORTFOLIO_ITEMS_PER_SERVICE = 3).

alter table public.portfolio_items
  add column if not exists service_featured_order integer null default null;

comment on column public.portfolio_items.service_featured_order is
  'When not null, item is featured on its service page in ascending order of this value. When null, the item is not on the service page featured strip (still visible in the rest of the service gallery if active).';

-- Partial index to keep per-service featured lookups fast.
create index if not exists portfolio_items_service_featured_idx
  on public.portfolio_items (service, service_featured_order)
  where service_featured_order is not null and active = true;
