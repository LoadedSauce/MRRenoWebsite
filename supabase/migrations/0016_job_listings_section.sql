-- ============================================================================
-- 0016_job_listings_section.sql
-- Hiring slots on /team
--
-- The team page renders one "Now Hiring" card per active job listing, placed
-- into the same section the role would belong to once filled. That placement
-- has to be data, not a lookup table in code: otherwise a role added later in
-- /admin/jobs lands in the wrong part of the page with nothing to warn anyone.
--
-- Values mirror TEAM_SECTIONS in src/lib/supabase/types.ts and the section
-- column on public.team_members. Default 'Crew' is the safe fallback -- a new
-- listing shows up with the trades rather than disappearing.
--
-- Additive and idempotent.
-- ============================================================================

alter table public.job_listings
  add column if not exists section text not null default 'Crew';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'job_listings_section_check'
  ) then
    alter table public.job_listings
      add constraint job_listings_section_check
      check (section in (
        'Owner',
        'Customer Service, Production & Coordination',
        'Sales',
        'Crew'
      ));
  end if;
end $$;

comment on column public.job_listings.section is
  'Which /team section this opening is displayed in. Mirrors team_members.section so a filled role lands where its hiring card was.';

-- ---------------------------------------------------------------------------
-- Seed the six current openings. Carpenter already exists (display_order 0);
-- this sets its section and adds the rest. Re-runnable.
-- ---------------------------------------------------------------------------
update public.job_listings set section = 'Crew' where title = 'Carpenter';

-- title carries no unique constraint, so ON CONFLICT would not fire and a
-- re-run would duplicate every row. Guard each insert on its own title.

insert into public.job_listings (title, description, active, display_order, section)
select 'Lead Carpenter', 'Run your own jobs start to finish with our own crews, not subcontracted labor. Finish carpentry experience required.', true, 1, 'Crew'
where not exists (select 1 from public.job_listings where title = 'Lead Carpenter');

insert into public.job_listings (title, description, active, display_order, section)
select 'Painter', 'Interior and exterior finish work on remodels across the northwest metro. Steady year-round work.', true, 3, 'Crew'
where not exists (select 1 from public.job_listings where title = 'Painter');

insert into public.job_listings (title, description, active, display_order, section)
select 'Tile Installer', 'Bathroom and kitchen tile, stone, and shower systems. Craftsmanship matters more than speed here.', true, 4, 'Crew'
where not exists (select 1 from public.job_listings where title = 'Tile Installer');

insert into public.job_listings (title, description, active, display_order, section)
select 'Sales', 'Meet homeowners, learn their full vision, and translate it into a project our production team can build.', true, 5, 'Sales'
where not exists (select 1 from public.job_listings where title = 'Sales');

insert into public.job_listings (title, description, active, display_order, section)
select 'Project Coordinator', 'Own material selections, permitting details, ordering, and logistics so projects run on schedule.', true, 6, 'Customer Service, Production & Coordination'
where not exists (select 1 from public.job_listings where title = 'Project Coordinator');

-- ============================================================================
-- DOWN
-- ============================================================================
-- delete from public.job_listings where title in
--   ('Lead Carpenter','Painter','Tile Installer','Sales','Project Coordinator');
-- alter table public.job_listings drop constraint if exists job_listings_section_check;
-- alter table public.job_listings drop column if exists section;
