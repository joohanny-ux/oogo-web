alter table public.archive_items
  add column if not exists collection_key text not null default 'oogo';

alter table public.archive_items
  drop constraint if exists archive_items_collection_key_check;

alter table public.archive_items
  add constraint archive_items_collection_key_check
  check (collection_key in ('oogo', 'youngbin-edition'));

create index if not exists archive_items_collection_public_newest_idx
  on public.archive_items(collection_key, published, published_at desc, created_at desc);
