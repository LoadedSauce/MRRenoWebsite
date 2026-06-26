-- Migration 0005_admin_panel_storage
-- Creates the media storage bucket and RLS policies.
-- Bucket is public: images served via CDN with no auth header required.

-- Create bucket (idempotent)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Public read on media bucket (site-facing images)
create policy "media_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'media');

-- Authenticated admin session can upload
create policy "media_auth_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'media');

-- Authenticated admin session can delete
create policy "media_auth_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'media');
