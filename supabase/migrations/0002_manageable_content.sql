alter table public.company_settings
  add column if not exists facebook text,
  add column if not exists tiktok text;

alter table public.product_images
  add column if not exists role text not null default 'gallery',
  add column if not exists alt text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'product_images_role_check'
  ) then
    alter table public.product_images
      add constraint product_images_role_check
      check (role in ('angle', 'wearing', 'front', 'side', 'gallery'));
  end if;
end $$;

create table if not exists public.special_editions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  collaborator text not null,
  year text not null,
  theme text,
  hero_asset_id uuid references public.assets(id) on delete set null,
  published boolean not null default false,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.special_edition_translations (
  special_edition_id uuid not null references public.special_editions(id) on delete cascade,
  locale text not null check (locale in ('ko', 'en', 'zh')),
  title text not null,
  summary text,
  story text,
  cta text,
  tags text[] not null default '{}',
  primary key (special_edition_id, locale)
);

create table if not exists public.special_edition_products (
  special_edition_id uuid not null references public.special_editions(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (special_edition_id, product_id)
);

alter table public.special_editions enable row level security;
alter table public.special_edition_translations enable row level security;
alter table public.special_edition_products enable row level security;

create policy "public can read published special editions" on public.special_editions
  for select using (published = true);

create policy "public can read published special edition translations" on public.special_edition_translations
  for select using (
    exists (
      select 1 from public.special_editions
      where special_editions.id = special_edition_translations.special_edition_id
      and special_editions.published = true
    )
  );

create policy "public can read published special edition products" on public.special_edition_products
  for select using (
    exists (
      select 1 from public.special_editions
      where special_editions.id = special_edition_products.special_edition_id
      and special_editions.published = true
    )
  );

create policy "admins and editors can manage special editions" on public.special_editions
  for all using (public.can_manage_content())
  with check (public.can_manage_content());

create policy "admins and editors can manage special edition translations" on public.special_edition_translations
  for all using (public.can_manage_content())
  with check (public.can_manage_content());

create policy "admins and editors can manage special edition products" on public.special_edition_products
  for all using (public.can_manage_content())
  with check (public.can_manage_content());
