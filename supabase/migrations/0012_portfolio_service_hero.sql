-- Migration 0012_portfolio_service_hero
-- Per-service hero photo selection for portfolio_items.
-- Rule 8 approval: Chris Hunter, 2026-08-21 (in-session confirmation).
-- Applied to prod on 2026-08-21.

-- When true, this item's photo is used as the hero image on its service's
-- Tier 2 hub page and Tier 3 area pages. At most one item per service may
-- be flagged; enforced by the admin server action AND by a partial unique
-- index below (defense in depth).

alter table public.portfolio_items
  add column if not exists is_service_hero boolean not null default false;

comment on column public.portfolio_items.is_service_hero is
  'When true, item is the hero photo on its service page (Tier 2 and Tier 3). At most one item per service may have this flag set; enforced by the admin server action and by a partial unique index.';

-- Only one hero per service; only active items count. Ignores rows where
-- is_service_hero is false or the item is inactive or service is null.
create unique index if not exists portfolio_items_service_hero_uidx
  on public.portfolio_items (service)
  where is_service_hero = true and active = true and service is not null;
