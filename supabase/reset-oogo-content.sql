-- Reset only OOGO CMS-owned tables, functions, and storage assets.
-- This keeps Supabase project settings and auth.users intact.
-- Run this before applying supabase/migrations/0001 through 0006 on an existing project.

drop policy if exists "admins and editors can upload oogo assets" on storage.objects;
drop policy if exists "admins and editors can update oogo assets" on storage.objects;
drop policy if exists "admins and editors can delete oogo assets" on storage.objects;

delete from storage.objects where bucket_id = 'oogo-assets';
delete from storage.buckets where id = 'oogo-assets';

drop table if exists public.special_edition_products cascade;
drop table if exists public.special_edition_translations cascade;
drop table if exists public.special_editions cascade;
drop table if exists public.archive_items cascade;
drop table if exists public.product_images cascade;
drop table if exists public.product_translations cascade;
drop table if exists public.products cascade;
drop table if exists public.landing_blocks cascade;
drop table if exists public.landing_pages cascade;
drop table if exists public.company_translations cascade;
drop table if exists public.company_settings cascade;
drop table if exists public.inquiries cascade;
drop table if exists public.assets cascade;
drop table if exists public.profiles cascade;

drop function if exists public.can_manage_content() cascade;
drop function if exists public.current_profile_role() cascade;
