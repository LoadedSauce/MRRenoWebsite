-- 0014_page_content_drafts.sql
-- Draft columns for inline edit mode. Public site reads only the live columns.
-- Admin edits write to draft_*, publish action promotes draft to live in one
-- transaction and clears the draft.

alter table page_text_blocks
  add column if not exists draft_content text,
  add column if not exists draft_updated_at timestamptz;

alter table page_photo_slots
  add column if not exists draft_portfolio_item_id uuid references portfolio_items(id) on delete set null,
  add column if not exists draft_updated_at timestamptz;

-- Publish helper: atomic promote-and-clear for a single row.
create or replace function publish_page_text_block(p_block_key text) returns void as $$
begin
  update page_text_blocks
     set content = coalesce(draft_content, content),
         draft_content = null,
         draft_updated_at = null
   where block_key = p_block_key
     and draft_content is not null;
end;
$$ language plpgsql;

create or replace function publish_page_photo_slot(p_slot_key text) returns void as $$
begin
  update page_photo_slots
     set portfolio_item_id = draft_portfolio_item_id,
         draft_portfolio_item_id = null,
         draft_updated_at = null
   where slot_key = p_slot_key
     and draft_updated_at is not null;
end;
$$ language plpgsql;

-- Publish-all helper: atomic promote-and-clear across every pending row.
create or replace function publish_all_page_drafts() returns table (
  text_blocks_published int,
  photo_slots_published int
) as $$
declare
  v_text_count int;
  v_slot_count int;
begin
  with updated as (
    update page_text_blocks
       set content = draft_content,
           draft_content = null,
           draft_updated_at = null
     where draft_content is not null
     returning 1
  ) select count(*)::int into v_text_count from updated;

  with updated as (
    update page_photo_slots
       set portfolio_item_id = draft_portfolio_item_id,
           draft_portfolio_item_id = null,
           draft_updated_at = null
     where draft_updated_at is not null
     returning 1
  ) select count(*)::int into v_slot_count from updated;

  return query select v_text_count, v_slot_count;
end;
$$ language plpgsql;
