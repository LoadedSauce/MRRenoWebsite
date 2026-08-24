-- 0013_page_slots_and_text_blocks.sql
-- Per-page named photo slots + text blocks. Both keyed by stable code-owned
-- keys. Single row per key so admin edits are UPSERT-in-place. Empty defaults
-- mean pages fall back to hardcoded copy/photos until admin sets a row.
-- Missing keys are not errors.

create table if not exists page_photo_slots (
  slot_key           text primary key,
  portfolio_item_id  uuid references portfolio_items(id) on delete set null,
  updated_at         timestamptz not null default now()
);

create table if not exists page_text_blocks (
  block_key  text primary key,
  content    text not null default '',
  updated_at timestamptz not null default now()
);

alter table page_photo_slots enable row level security;
alter table page_text_blocks enable row level security;

drop policy if exists "public read slots" on page_photo_slots;
create policy "public read slots" on page_photo_slots for select using (true);

drop policy if exists "public read blocks" on page_text_blocks;
create policy "public read blocks" on page_text_blocks for select using (true);

create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists page_photo_slots_set_updated_at on page_photo_slots;
create trigger page_photo_slots_set_updated_at
  before update on page_photo_slots
  for each row execute function set_updated_at();

drop trigger if exists page_text_blocks_set_updated_at on page_text_blocks;
create trigger page_text_blocks_set_updated_at
  before update on page_text_blocks
  for each row execute function set_updated_at();
