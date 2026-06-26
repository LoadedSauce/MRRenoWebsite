-- Migration 0006_admin_panel_seed
-- Migrates hardcoded data into admin tables.
-- Safe to re-run: INSERT ... ON CONFLICT DO NOTHING.

-- testimonials seed
-- Source: src/app/services/[service]/[area]/page.tsx (testimonialsByArea)
--         src/app/services/[service]/page.tsx (testimonialMap)
insert into public.testimonials (quote, author_name, city, service, active, display_order)
values
  -- Tier 3 area-level pages
  ('M.R. Renovations did an outstanding job on our kitchen. They kept the site clean, communicated every step of the way, handled all the Rogers permits without us lifting a finger, and the finished result exceeded what we had imagined.',
   'Jennifer K., Rogers, MN', 'Rogers', 'kitchens', true, 10),

  ('We used M.R. Renovations for our kitchen remodel and could not be more pleased. They are based right here in Maple Grove, which showed immediately -- they knew the permit process, they knew the neighborhood, and they treated our home with real care.',
   'David R., Maple Grove, MN', 'Maple Grove', 'kitchens', true, 20),

  ('M.R. Renovations remodeled our basement and the result is stunning. They stayed on schedule, communicated every change, and their crew treated our home with respect throughout. We would hire them again without question.',
   'Lisa T., Plymouth, MN', 'Plymouth', 'basements', true, 30),

  ('From the first estimate to the final walkthrough, M.R. Renovations was professional, transparent, and thorough. Our kitchen looks better than we imagined and the process was far smoother than we expected.',
   'Mark H., Coon Rapids, MN', 'Coon Rapids', 'kitchens', true, 40),

  -- Tier 2 service hub pages
  ('We had been quoted by three other contractors and M.R. Renovations was the only one who walked us through the structural piece honestly. The wall came down, the island went in, and they were done in six weeks with no surprise change orders.',
   'Sarah M., Maple Grove, MN', 'Maple Grove', 'kitchens', true, 50),

  ('Our primary bath was a 1990s builder-grade box and we needed it gutted. M.R. Renovations handled the moved plumbing, the curbless shower waterproofing, and the tile work entirely in-house. Five weeks start to finish.',
   'Dana R., Plymouth, MN', 'Plymouth', 'bathrooms', true, 60),

  ('They added an egress window, framed a bedroom, finished a full bath, and put in a wet bar. Permits were already pulled when we signed, and inspections happened on schedule.',
   'Kevin T., Coon Rapids, MN', 'Coon Rapids', 'basements', true, 70),

  ('A four-season sunroom addition felt like it was going to take a year. M.R. Renovations had it framed and dried in before winter, finished by spring, and matched the existing siding so well that visitors do not realize it is an addition.',
   'Lisa G., Rogers, MN', 'Rogers', 'additions', true, 80),

  ('One contract, one project manager, one warranty across the whole house. We lived through fourteen weeks of construction and never had to chase anyone for an answer.',
   'Mark and Julie H., Eden Prairie, MN', 'Eden Prairie', 'whole-home', true, 90),

  ('We had hail damage on the roof and siding and were dreading the claim process. M.R. Renovations coordinated directly with our insurance adjuster, handled the supplements, and had the full James Hardie siding and GAF roof completed in under three weeks.',
   'Brian K., St. Michael, MN', 'St. Michael', 'exterior', true, 100),

  -- Homepage (no service filter)
  ('M.R. Renovations transformed our outdated kitchen into a modern masterpiece. Their attention to detail and commitment to quality were outstanding -- and the Lifetime Warranty sealed it for us.',
   'Sarah Miller', 'Maple Grove', 'kitchens', true, 110)

on conflict do nothing;

-- team_members seed
-- Source: src/app/page.tsx about-team section
-- NOTE: page.tsx currently shows a single team photo (about-team.jpg), not individual
-- member cards. Seeding a placeholder row for Mike (owner) so the table is not empty.
-- Mike should add real members via the admin UI in ADM-3.
insert into public.team_members (name, role, photo_url, display_order, active)
values
  ('Mike Randolph', 'Owner & Project Manager', null, 10, true)
on conflict do nothing;

-- portfolio_items seed
-- Source: /public/images/ -- real photos already in the repo.
-- photo_url values use the /images/... paths (existing static files).
-- These will be replaced with Supabase Storage CDN URLs when Mike
-- uploads photos via ADM-3. Both URL formats work in <Image src=...>.
insert into public.portfolio_items (photo_url, caption, service, city, display_order, active)
values
  ('/images/kitchen/kitchen-remodel-walnut-cabinets-hex-backsplash-maple-grove-mn.jpg',
   'Custom walnut cabinetry with hex tile backsplash', 'kitchens', 'Maple Grove', 10, true),

  ('/images/kitchen/kitchen-remodel-white-shaker-cabinets-quartz-countertops-maple-grove-mn.jpg',
   'White shaker cabinets with quartz countertops', 'kitchens', 'Maple Grove', 20, true),

  ('/images/kitchen/kitchen-remodel-brick-backsplash-under-cabinet-lighting-maple-grove-mn.jpg',
   'Brick tile backsplash with under-cabinet lighting', 'kitchens', 'Maple Grove', 30, true),

  ('/images/bathroom/bathroom-remodel-marble-tile-shower-quartz-vanity-maple-grove-mn.jpg',
   'Marble tile shower with quartz vanity', 'bathrooms', 'Maple Grove', 40, true),

  ('/images/bathroom/bathroom-remodel-double-vanity-walk-in-shower-maple-grove-mn.jpg',
   'Double vanity with walk-in shower', 'bathrooms', 'Maple Grove', 50, true),

  ('/images/bathroom/bathroom-remodel-white-distressed-vanity-charcoal-quartz-maple-grove-mn.jpg',
   'White distressed vanity with charcoal quartz countertop', 'bathrooms', 'Maple Grove', 60, true),

  ('/images/whole-home/whole-home-remodel-stone-fireplace-vaulted-ceiling-maple-grove-mn.jpg',
   'Stone fireplace with vaulted ceiling', 'whole-home', 'Maple Grove', 70, true),

  ('/images/whole-home/whole-home-remodel-walnut-kitchen-open-concept-maple-grove-mn.jpg',
   'Walnut kitchen with open concept layout', 'whole-home', 'Maple Grove', 80, true),

  ('/images/whole-home/whole-home-remodel-lvp-flooring-open-concept-living-room-maple-grove-mn.jpg',
   'LVP flooring throughout open concept living area', 'whole-home', 'Maple Grove', 90, true),

  ('/images/addition/home-addition-four-season-sunroom-floor-to-ceiling-windows-maple-grove-mn.jpg',
   'Four-season sunroom addition with floor-to-ceiling windows', 'additions', 'Maple Grove', 100, true),

  ('/images/addition/home-addition-sunroom-exterior-new-construction-maple-grove-mn.jpg',
   'Sunroom addition exterior -- new construction attached to existing home', 'additions', 'Maple Grove', 110, true),

  ('/images/addition/home-addition-composite-deck-white-railing-coon-rapids-mn.jpg',
   'Composite deck addition with white railing', 'additions', 'Coon Rapids', 120, true)

on conflict do nothing;

-- job_listings seed
-- No "Now Hiring" section exists on the site yet. Table starts empty.
-- Mike adds listings via admin UI in ADM-3.
