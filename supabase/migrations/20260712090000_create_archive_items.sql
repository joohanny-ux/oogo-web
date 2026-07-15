create table if not exists public.archive_items (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.assets(id) on delete set null,
  image_url text not null check (length(trim(image_url)) > 0),
  alt_text text not null default 'OOGO archive image',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists archive_items_created_at_idx
  on public.archive_items(created_at desc);

create index if not exists archive_items_public_newest_idx
  on public.archive_items(published_at desc, created_at desc)
  where published = true;

alter table public.archive_items enable row level security;

drop policy if exists "public can read published archive items" on public.archive_items;
create policy "public can read published archive items" on public.archive_items
  for select using (published = true);

drop policy if exists "admins and editors can manage archive items" on public.archive_items;
create policy "admins and editors can manage archive items" on public.archive_items
  for all using (public.can_manage_content())
  with check (public.can_manage_content());

with legacy_block as (
  select case
    when published and published_content <> '{}'::jsonb then published_content
    else draft_content
  end as content
  from public.landing_blocks
  where page_key = 'archive'
    and block_key = 'gallery'
    and locale = 'ko'
  order by updated_at desc
  limit 1
),
legacy_urls as (
  select
    entry.ordinal,
    case
      when entry.ordinal = 1 then coalesce(
        nullif(trim(legacy_block.content ->> 'mediaUrl'), ''),
        nullif(trim(legacy_block.content ->> 'imageUrl'), '')
      )
      else nullif(trim(legacy_block.content ->> entry.content_key), '')
    end as image_url
  from legacy_block
  cross join (
    values
      (1, 'mediaUrl'),
      (2, 'image2Url'),
      (3, 'image3Url'),
      (4, 'image4Url'),
      (5, 'image5Url'),
      (6, 'image6Url'),
      (7, 'image7Url'),
      (8, 'image8Url'),
      (9, 'image9Url'),
      (10, 'image10Url'),
      (11, 'image11Url'),
      (12, 'image12Url')
  ) as entry(ordinal, content_key)
)
insert into public.archive_items (
  image_url,
  alt_text,
  published,
  created_at,
  published_at
)
select
  legacy_urls.image_url,
  'OOGO archive image',
  true,
  now() - make_interval(secs => legacy_urls.ordinal),
  now() - make_interval(secs => legacy_urls.ordinal)
from legacy_urls
where legacy_urls.image_url is not null
  and not exists (
    select 1
    from public.archive_items
    where archive_items.image_url = legacy_urls.image_url
  );

insert into public.archive_items (
  asset_id,
  image_url,
  alt_text,
  published,
  created_at,
  published_at
)
select
  assets.id,
  assets.public_url,
  coalesce(nullif(trim(assets.alt), ''), 'OOGO archive image'),
  false,
  assets.created_at,
  null
from public.assets
where assets.path like 'archive/%'
  and not exists (
    select 1
    from public.archive_items
    where archive_items.asset_id = assets.id
       or archive_items.image_url = assets.public_url
  );
