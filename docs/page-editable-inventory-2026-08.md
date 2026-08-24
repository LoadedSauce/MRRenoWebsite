# Page editable inventory (Aug 2026)

Base commit for this inventory: `8480f109a0540ae200e732584e9331fb45811cc6` (PR #108's base).

Every visible photo becomes a **slot** in `page_photo_slots`. Every visible text string becomes a **block** in `page_text_blocks`. Both are keyed by stable code-owned keys. Empty database rows fall back to the current hardcoded values, so existing pages continue to render normally until admin sets a row.

Key naming convention: `<page_key>.<section>.<field>` (dots for readability in DB and admin UI).

## Home (`home`) - covered in PR #109

### Photo slots (13)

| slot_key                             | Where                              | Fallback |
|--------------------------------------|------------------------------------|----------|
| `home.hero.background`               | Hero background                    | `/images/hero-home.jpg` |
| `home.services.kitchens.image`       | Services grid, tile 01             | `/images/service-kitchen.jpg` |
| `home.services.bathrooms.image`      | Services grid, tile 02             | `/images/service-bathroom-primary-freestanding-tub-double-gray-vanity-marble-floor-mn.jpg` |
| `home.services.basements.image`      | Services grid, tile 03             | `/images/service-basement-lvp-tray-ceiling-linear-fireplace-built-in-entertainment-center.jpg` |
| `home.services.additions.image`      | Services grid, tile 04             | `/images/service-additions.jpg` |
| `home.services.whole-home.image`     | Services grid, tile 05             | `/images/service-whole-home.jpg` |
| `home.services.exterior.image`       | Services grid, tile 06             | `/images/service-exterior.jpg` |
| `home.recent.1`                      | Recent work card 1                 | Live Supabase feed, then `project-miller-kitchen.jpg` |
| `home.recent.2`                      | Recent work card 2                 | Live Supabase feed, then `project-johnson-lower.jpg` |
| `home.recent.3`                      | Recent work card 3                 | Live Supabase feed, then `project-carter-addition.jpg` |

Note: the recent-work section currently uses `getRecentPortfolioItems(3)`. PR #109 keeps that behavior when the three slots are empty. When any of `home.recent.{1,2,3}` are set, they override the Supabase feed for that position. This is because the section is high-value real estate and the admin wants explicit control per your ask.

### Text blocks (42)

Hero (5):
- `home.hero.eyebrow` - "Maple Grove, MN &middot; Twin Cities"
- `home.hero.headline.line1` - "We Design."
- `home.hero.headline.line2` - "We Build."
- `home.hero.headline.line3` - "We Renovate."
- `home.hero.subcopy` - "Family-owned design-build for Twin Cities homeowners..."

Hero CTAs (2):
- `home.hero.cta.primary` - "Get a Free Estimate"
- `home.hero.cta.secondary` - "See Our Work"

Hero stats labels (4) - values stay in code per Rule 16 canonical:
- `home.hero.stat1.label` - "Years of Craft"
- `home.hero.stat2.label` - "Twin Cities Homes"
- `home.hero.stat3.label` - "Lifetime Warranty"
- `home.hero.stat4.label` - "Google Rating"

Warranty band (6):
- `home.warranty.title` - "Lifetime Transferable Workmanship Warranty"
- `home.warranty.subtitle` - "Stays with the home, even if you sell."
- `home.warranty.cta` - "How the warranty works"
- `home.discounts.title` - "Discounts"
- `home.discounts.line1` - "2% cash or check."
- `home.discounts.line2` - "5% Veterans, Seniors, First Responders."
- `home.financing.title` - "Financing available"
- `home.financing.subtitle` - "Flexible monthly payments to fit your budget."
- `home.financing.cta` - "See financing options"

Services section (3 + 6 pairs):
- `home.services.eyebrow` - "What we build"
- `home.services.headline` - "Whole-home transformations and specialty remodels for Twin Cities families."
- `home.services.subcopy` - "Six core practices. Every project led by our full M.R. Renovation team..."
- `home.services.{slug}.name` - service tile name (6 slugs)
- `home.services.{slug}.body` - service tile body (6 slugs)

Process teaser (5):
- `home.process.eyebrow` - "How we move"
- `home.process.headline` - "A transparent process, start to finish."
- `home.process.subcopy` - "No mystery line items..."
- `home.process.step1.title` / `home.process.step1.body`
- `home.process.step2.title` / `home.process.step2.body`
- `home.process.step3.title` / `home.process.step3.body`

Recent work section (3):
- `home.recent.eyebrow` - "Recent work"
- `home.recent.headline` - "A few Twin Cities transformations."
- `home.recent.subcopy` - "Real homes. Real budgets..."

Testimonial (2):
- `home.testimonial.quote` - full Ken G quote
- `home.testimonial.attribution` - "Ken G · Kitchen Remodel · Maple Grove"

Offers section (5):
- `home.offers.eyebrow` - "Current offers"
- `home.offers.headline` - "Honest savings, no gimmicks."
- `home.offers.card1.label` / `home.offers.card1.title` / `home.offers.card1.body`
- `home.offers.card2.label` / `home.offers.card2.title` / `home.offers.card2.body`
- `home.offers.card3.label` / `home.offers.card3.title` / `home.offers.card3.body`

Final CTA (5):
- `home.final.eyebrow` - "Ready when you are"
- `home.final.headline` - "Let's build something that lasts."
- `home.final.subcopy` - "Tell us about your project..."
- `home.final.cta.primary` - "Start your free estimate"
- `home.final.cta.secondary` - "Or call 763-900-2024"

**Home totals:** 13 photo slots, 42 text blocks.

## Service pages (`service.<slug>`) - covered in PR #110

For each of `kitchens`, `bathrooms`, `basements`, `additions`, `whole-home`, `exterior`:

Photo slots (existing `is_service_hero` supersedes; kept for compatibility):
- `service.<slug>.hero` - already covered by migration 0012 partial index
- `service.<slug>.gallery.1` through `.6` (up to 6 explicit gallery positions)
- `service.<slug>.testimonial.image`
- `service.<slug>.before` / `service.<slug>.after` (before/after pair)

Text blocks - per service:
- `service.<slug>.hero.eyebrow`, `.headline`, `.subcopy`
- `service.<slug>.testimonial.quote`, `.attribution`
- FAQ items - each is a separate block: `service.<slug>.faq.<n>.question` / `.answer`
- Stat strip labels (currently sitewide constants: keep in code per Rule 16)
- CTA button labels

Areas (Tier 3) inherit from service defaults; each area additionally gets:
- `service.<slug>.area.<area>.hero.subcopy` (currently `area.serviceNotes[slug]`)
- `service.<slug>.area.<area>.testimonial.quote` / `.attribution`

## Process page (`process`) - PR #111

- Hero background photo, hero eyebrow/headline/subcopy
- 10 step blocks - each has `.title`, `.body`, and optional `.image` slot
- Section headings between phases
- FAQ items (each Q&A pair)
- Final CTA

## Warranty page (`warranty`) - PR #111

- Hero background
- Coverage bullet points (each editable)
- Exclusion list items
- Transfer process copy
- FAQ items
- Final CTA

## Consultation page (`consultation`) - PR #111

- Hero background
- Form intro copy
- Trust-signal strip
- Confirmation copy

## Contact page (`contact`) - PR #112

- Hero background
- Address block (already NAP-locked, but section labels are editable)
- Hours block
- Form intro copy
- Map caption

## Team page (`team`) - PR #112

- Hero background, hero copy
- Team member cards - each has photo slot + name + role + bio (block per field)
- Values section headings and body

## Careers page (`careers`) - PR #112

- Hero background, hero copy
- Open positions list (each with title, description, apply CTA)
- Benefits section
- Culture section
- Application CTA

## Resources index + article pages (`resources`, `resources.<slug>`) - PR #113

- Index: hero + intro + article list intro
- Per article: hero + intro + body sections (each editable) + related article strip

## Financing page (`financing`) - PR #113

- Hero background
- Lender partner strip (photo slots per partner)
- FAQ items
- Application flow copy

## Legal pages (`privacy`, `terms`, `accessibility`) - PR #113

- Body copy per section (each policy paragraph editable as a block)

## Layout / global (`global`) - PR #113 (last)

- Header nav labels (already in code; blockified for future admin)
- Footer sections: About, Services, Company, Legal - each link label editable
- Footer NAP block (already locked, but section labels editable)
- Cookie banner copy

## Not editable (intentionally kept in code)

Per Working Agreement:
- **Rule 16 canonical values**: "40+ years", "10-step process", stat strip experience/rating values
- **Rule 25**: Otsego shop display-only strings live in the footer NAP handler, not editable
- **NAP data** (phone, address, hours): source-of-truth is a locked constants file
- **Legal boilerplate mandatory clauses**: LLM opt-out, accessibility statement compliance text
- **JSON-LD schema strings**: derived from structured data, not free text
