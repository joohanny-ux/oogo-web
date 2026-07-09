create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now()
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'oogo-assets',
  path text not null,
  public_url text not null,
  alt text,
  kind text not null default 'general' check (kind in ('brand', 'product', 'special', 'general')),
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  model_code text not null unique,
  size text,
  frame_material text,
  lens_material text,
  lens_features text[] not null default '{}',
  published boolean not null default false,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_translations (
  product_id uuid not null references public.products(id) on delete cascade,
  locale text not null check (locale in ('ko', 'en', 'zh')),
  name text not null,
  colorway text,
  description text,
  primary key (product_id, locale)
);

create table public.product_images (
  product_id uuid not null references public.products(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (product_id, asset_id)
);

create table public.landing_pages (
  page_key text primary key,
  title text not null,
  published boolean not null default true,
  sort_order integer not null default 0
);

create table public.landing_blocks (
  id uuid primary key default gen_random_uuid(),
  page_key text not null references public.landing_pages(page_key) on delete cascade,
  block_key text not null,
  locale text not null check (locale in ('ko', 'en', 'zh')),
  draft_content jsonb not null default '{}',
  published_content jsonb not null default '{}',
  published boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (page_key, block_key, locale)
);

create table public.company_settings (
  id boolean primary key default true,
  email text,
  phone text,
  kakao text,
  instagram text,
  address text,
  constraint company_settings_singleton check (id = true)
);

create table public.company_translations (
  locale text primary key check (locale in ('ko', 'en', 'zh')),
  brand_description text not null default '',
  footer_note text not null default ''
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('general', 'buyer', 'retail', 'collaboration', 'other')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'closed')),
  name text not null,
  company text,
  country text,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.assets enable row level security;
alter table public.products enable row level security;
alter table public.product_translations enable row level security;
alter table public.product_images enable row level security;
alter table public.landing_pages enable row level security;
alter table public.landing_blocks enable row level security;
alter table public.company_settings enable row level security;
alter table public.company_translations enable row level security;
alter table public.inquiries enable row level security;

create policy "public can read published products" on public.products
  for select using (published = true);

create policy "public can read product translations for published products" on public.product_translations
  for select using (
    exists (
      select 1 from public.products
      where products.id = product_translations.product_id
      and products.published = true
    )
  );

create policy "public can read product images for published products" on public.product_images
  for select using (
    exists (
      select 1 from public.products
      where products.id = product_images.product_id
      and products.published = true
    )
  );

create policy "public can read assets" on public.assets
  for select using (true);

create policy "public can read landing pages" on public.landing_pages
  for select using (published = true);

create policy "public can read published landing blocks" on public.landing_blocks
  for select using (published = true);

create policy "public can read company settings" on public.company_settings
  for select using (true);

create policy "public can read company translations" on public.company_translations
  for select using (true);

create policy "public can insert inquiries" on public.inquiries
  for insert with check (true);

create or replace function public.current_profile_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.can_manage_content()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() in ('admin', 'editor'), false)
$$;

create policy "users can read own profile" on public.profiles
  for select using (id = auth.uid());

create policy "admins can manage profiles" on public.profiles
  for all using (public.current_profile_role() = 'admin')
  with check (public.current_profile_role() = 'admin');

create policy "admins and editors can manage assets" on public.assets
  for all using (public.can_manage_content())
  with check (public.can_manage_content());

create policy "admins and editors can manage products" on public.products
  for all using (public.can_manage_content())
  with check (public.can_manage_content());

create policy "admins and editors can manage product translations" on public.product_translations
  for all using (public.can_manage_content())
  with check (public.can_manage_content());

create policy "admins and editors can manage product images" on public.product_images
  for all using (public.can_manage_content())
  with check (public.can_manage_content());

create policy "admins and editors can manage landing pages" on public.landing_pages
  for all using (public.can_manage_content())
  with check (public.can_manage_content());

create policy "admins and editors can manage landing blocks" on public.landing_blocks
  for all using (public.can_manage_content())
  with check (public.can_manage_content());

create policy "admins and editors can manage company settings" on public.company_settings
  for all using (public.can_manage_content())
  with check (public.can_manage_content());

create policy "admins and editors can manage company translations" on public.company_translations
  for all using (public.can_manage_content())
  with check (public.can_manage_content());

create policy "admins and editors can read inquiries" on public.inquiries
  for select using (public.can_manage_content());

create policy "admins and editors can update inquiries" on public.inquiries
  for update using (public.can_manage_content())
  with check (public.can_manage_content());
