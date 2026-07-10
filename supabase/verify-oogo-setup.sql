-- Read-only setup verification for the OOGO Supabase project.
-- Run after reset, migrations, seed, and profile creation.

with expected_tables(table_name) as (
  values
    ('profiles'),
    ('assets'),
    ('products'),
    ('product_translations'),
    ('product_images'),
    ('landing_pages'),
    ('landing_blocks'),
    ('company_settings'),
    ('company_translations'),
    ('inquiries'),
    ('special_editions'),
    ('special_edition_translations'),
    ('special_edition_products')
)
select
  'table:' || expected_tables.table_name as check_name,
  case when tables.table_name is null then 'missing' else 'ok' end as status
from expected_tables
left join information_schema.tables tables
  on tables.table_schema = 'public'
  and tables.table_name = expected_tables.table_name
order by check_name;

select
  'bucket:oogo-assets' as check_name,
  case when exists (select 1 from storage.buckets where id = 'oogo-assets') then 'ok' else 'missing' end as status;

select
  'seed:landing_pages' as check_name,
  count(*)::text as status
from public.landing_pages;

select
  'seed:company_settings' as check_name,
  count(*)::text as status
from public.company_settings;

select
  'admin_profiles' as check_name,
  count(*)::text as status
from public.profiles
where role in ('admin', 'editor');

select
  'published_products' as check_name,
  count(*)::text as status
from public.products
where published = true;

select
  'published_landing_blocks' as check_name,
  count(*)::text as status
from public.landing_blocks
where published = true;
