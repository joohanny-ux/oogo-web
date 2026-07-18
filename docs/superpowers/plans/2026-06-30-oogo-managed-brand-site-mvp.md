# OOGO Managed Brand Site MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working OOGO managed brand site with a public KR/EN/CN homepage, product catalog, inquiry flow, Supabase-backed content, and a basic `/admin` dashboard for products, landing blocks, files, inquiries, and company settings.

**Architecture:** Use Next.js App Router with Supabase for Auth, Postgres, and Storage. Public routes read only published content through typed data access modules, while `/admin` routes require an authenticated admin and write to Supabase tables. Seed scripts import initial OOGO brand content and catalog data from the approved design spec and source PDFs.

**Tech Stack:** Next.js, TypeScript, React, Supabase JS, Supabase SQL migrations, CSS Modules or global CSS, Vitest for unit tests, Playwright for smoke tests.

---

## Scope Notes

This plan implements the MVP from `docs/superpowers/specs/2026-06-30-oogo-managed-brand-site-design.md`.

Deferred after MVP:

- Activity log.
- Advanced role granularity beyond admin.
- SEO editor for every route.
- Version history beyond draft/published landing blocks.
- Ecommerce checkout.

## File Structure

Create the project at the repository root.

- `package.json`: scripts and dependencies.
- `next.config.ts`: Next.js config.
- `tsconfig.json`: TypeScript config.
- `vitest.config.ts`: unit test config.
- `playwright.config.ts`: browser smoke test config.
- `.env.example`: required Supabase and app variables.
- `src/app/layout.tsx`: root HTML shell.
- `src/app/page.tsx`: public homepage.
- `src/app/products/page.tsx`: product listing.
- `src/app/products/[slug]/page.tsx`: product detail.
- `src/app/inquiry/page.tsx`: inquiry form route.
- `src/app/admin/layout.tsx`: admin shell.
- `src/app/admin/page.tsx`: admin dashboard.
- `src/app/admin/login/page.tsx`: login page.
- `src/app/admin/products/page.tsx`: product library.
- `src/app/admin/products/new/page.tsx`: product create screen.
- `src/app/admin/products/[id]/page.tsx`: product edit screen.
- `src/app/admin/landing/page.tsx`: landing block editor.
- `src/app/admin/files/page.tsx`: asset manager.
- `src/app/admin/inquiries/page.tsx`: inquiry list.
- `src/app/admin/company/page.tsx`: company and brand settings.
- `src/components/public/*`: public page components.
- `src/components/admin/*`: admin UI components.
- `src/lib/supabase/browser.ts`: browser Supabase client.
- `src/lib/supabase/server.ts`: server Supabase client.
- `src/lib/i18n.ts`: locale types and helpers.
- `src/lib/public-content.ts`: public content queries.
- `src/lib/admin-content.ts`: admin content mutations and queries.
- `src/lib/products.ts`: product data helpers.
- `src/lib/inquiries.ts`: inquiry helpers.
- `src/lib/assets.ts`: asset helpers.
- `src/types/content.ts`: shared content types.
- `supabase/migrations/0001_initial_schema.sql`: schema, storage bucket notes, RLS policies.
- `supabase/seed/seed-oogo-content.sql`: initial landing/company/product content.
- `tests/unit/*.test.ts`: unit tests.
- `tests/e2e/public.spec.ts`: public smoke tests.
- `tests/e2e/admin.spec.ts`: admin smoke tests.

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.env.example`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `tests/unit/smoke.test.ts`

- [ ] **Step 1: Create package scripts and dependencies**

Write `package.json`:

```json
{
  "name": "oogo-homepage",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@supabase/ssr": "^0.6.1",
    "@supabase/supabase-js": "^2.45.4",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "@testing-library/react": "^16.1.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create base config files**

Write `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co"
      }
    ]
  }
};

export default nextConfig;
```

Write `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

Write `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 3: Add test config**

Write `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"]
  }
});
```

Write `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ],
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true
  }
});
```

- [ ] **Step 4: Add minimal app shell**

Write `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OOGO",
  description: "OOGO frames a way of seeing - clear, balanced, and quietly confident."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

Write `src/app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main>
      <h1>OOGO</h1>
      <p>Light & Shadow Gallery</p>
    </main>
  );
}
```

Write `src/app/globals.css`:

```css
:root {
  color: #f4f0e8;
  background: #11100e;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #11100e;
}

a {
  color: inherit;
  text-decoration: none;
}
```

- [ ] **Step 5: Add scaffold smoke test**

Write `tests/unit/smoke.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("project scaffold", () => {
  it("runs unit tests", () => {
    expect("OOGO").toBe("OOGO");
  });
});
```

- [ ] **Step 6: Install dependencies**

Run: `npm install`

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 7: Verify scaffold**

Run: `npm run test`

Expected: PASS for `tests/unit/smoke.test.ts`.

Run: `npm run build`

Expected: Next.js production build succeeds.

- [ ] **Step 8: Commit scaffold**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json vitest.config.ts playwright.config.ts .env.example src tests
git commit -m "feat: scaffold OOGO Next app"
```

---

### Task 2: Add Supabase Schema And Type Contracts

**Files:**
- Create: `supabase/migrations/0001_initial_schema.sql`
- Create: `src/types/content.ts`
- Create: `src/lib/i18n.ts`
- Create: `tests/unit/i18n.test.ts`

- [ ] **Step 1: Write locale helper tests**

Write `tests/unit/i18n.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { isLocale, normalizeLocale, LOCALES } from "@/lib/i18n";

describe("i18n helpers", () => {
  it("defines supported locales in display order", () => {
    expect(LOCALES).toEqual(["ko", "en", "zh"]);
  });

  it("accepts known locales", () => {
    expect(isLocale("ko")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("zh")).toBe(true);
  });

  it("normalizes unknown locales to Korean", () => {
    expect(normalizeLocale("fr")).toBe("ko");
    expect(normalizeLocale(undefined)).toBe("ko");
  });
});
```

- [ ] **Step 2: Run locale tests and verify failure**

Run: `npm run test -- tests/unit/i18n.test.ts`

Expected: FAIL because `src/lib/i18n.ts` does not exist.

- [ ] **Step 3: Implement locale helpers**

Write `src/lib/i18n.ts`:

```ts
export const LOCALES = ["ko", "en", "zh"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: "KR",
  en: "EN",
  zh: "CN"
};

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function normalizeLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : "ko";
}
```

- [ ] **Step 4: Define shared content types**

Write `src/types/content.ts`:

```ts
import type { Locale } from "@/lib/i18n";

export type PublishStatus = "draft" | "published";
export type InquiryStatus = "open" | "in_progress" | "closed";
export type InquiryType = "general" | "buyer" | "retail" | "collaboration" | "other";

export type Asset = {
  id: string;
  bucket: string;
  path: string;
  url: string;
  alt: string | null;
  kind: "brand" | "product" | "special" | "general";
};

export type Product = {
  id: string;
  slug: string;
  modelCode: string;
  size: string | null;
  frameMaterial: string | null;
  lensMaterial: string | null;
  lensFeatures: string[];
  published: boolean;
  featured: boolean;
  sortOrder: number;
};

export type ProductTranslation = {
  productId: string;
  locale: Locale;
  name: string;
  colorway: string | null;
  description: string | null;
};

export type LandingBlock = {
  pageKey: string;
  blockKey: string;
  locale: Locale;
  status: PublishStatus;
  content: Record<string, unknown>;
};
```

- [ ] **Step 5: Create Supabase initial schema**

Write `supabase/migrations/0001_initial_schema.sql`:

```sql
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
```

- [ ] **Step 6: Run unit tests**

Run: `npm run test`

Expected: all unit tests pass.

- [ ] **Step 7: Commit schema and types**

```bash
git add supabase src/lib/i18n.ts src/types/content.ts tests/unit/i18n.test.ts
git commit -m "feat: define Supabase content schema"
```

---

### Task 3: Seed OOGO Content

**Files:**
- Create: `supabase/seed/seed-oogo-content.sql`
- Create: `src/lib/seed-data.ts`
- Create: `tests/unit/seed-data.test.ts`

- [ ] **Step 1: Write seed data tests**

Write `tests/unit/seed-data.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { initialProducts, landingPageKeys } from "@/lib/seed-data";

describe("OOGO seed data", () => {
  it("includes required landing pages", () => {
    expect(landingPageKeys).toEqual([
      "header",
      "home",
      "brand-story",
      "collection",
      "product-detail",
      "special-edition",
      "inquiry",
      "footer"
    ]);
  });

  it("includes catalog products with multilingual names", () => {
    const sunset = initialProducts.find((product) => product.modelCode === "OG26001C2");
    expect(sunset?.translations.ko.name).toBe("황혼의 산책");
    expect(sunset?.translations.en.name).toBe("Sunset Stroll");
    expect(sunset?.translations.zh.name).toBe("夕光漫步");
  });
});
```

- [ ] **Step 2: Run seed tests and verify failure**

Run: `npm run test -- tests/unit/seed-data.test.ts`

Expected: FAIL because `src/lib/seed-data.ts` does not exist.

- [ ] **Step 3: Add typed seed data**

Write `src/lib/seed-data.ts`:

```ts
import type { Locale } from "@/lib/i18n";

export const landingPageKeys = [
  "header",
  "home",
  "brand-story",
  "collection",
  "product-detail",
  "special-edition",
  "inquiry",
  "footer"
] as const;

type SeedTranslation = Record<Locale, { name: string; colorway: string | null; description: string | null }>;

export const initialProducts: Array<{
  modelCode: string;
  slug: string;
  size: string;
  frameMaterial: string;
  lensMaterial: string;
  lensFeatures: string[];
  translations: SeedTranslation;
}> = [
  {
    modelCode: "OG26001C2",
    slug: "og26001c2-sunset-stroll",
    size: "63-17-145",
    frameMaterial: "High-quality PC Frame (Polycarbonate)",
    lensMaterial: "PA12 Nylon (Swiss EMS Grilamid TR90 LXS)",
    lensFeatures: ["UV400 100% protection", "Anti-impact", "Anti-reflective coating", "Low haze <1.5%", "1.0g/cm3"],
    translations: {
      ko: { name: "황혼의 산책", colorway: null, description: "빛과 그림자의 균형을 담은 OOGO 프레임입니다." },
      en: { name: "Sunset Stroll", colorway: null, description: "An OOGO frame shaped by the balance of light and shadow." },
      zh: { name: "夕光漫步", colorway: null, description: "以光影平衡塑造的 OOGO 镜框。" }
    }
  },
  {
    modelCode: "OG26002C1",
    slug: "og26002c1-black-moon",
    size: "53-22-142",
    frameMaterial: "High-quality PC Frame (Polycarbonate)",
    lensMaterial: "PA12 Nylon (Swiss EMS Grilamid TR90 LXS)",
    lensFeatures: ["UV400 100% protection", "Anti-impact", "Anti-reflective coating", "Low haze <1.5%", "1.0g/cm3"],
    translations: {
      ko: { name: "블랙 문", colorway: null, description: "조용한 존재감을 선명하게 만드는 블랙 프레임입니다." },
      en: { name: "Black Moon", colorway: null, description: "A black frame with quiet and distinct presence." },
      zh: { name: "黑月", colorway: null, description: "呈现安静而鲜明存在感的黑色镜框。" }
    }
  },
  {
    modelCode: "OG26003C4",
    slug: "og26003c4-silver-mist",
    size: "62-20-145",
    frameMaterial: "High-quality PC Frame (Polycarbonate)",
    lensMaterial: "PA12 Nylon (Swiss EMS Grilamid TR90 LXS)",
    lensFeatures: ["UV400 100% protection", "Anti-impact", "Anti-reflective coating", "Low haze <1.5%", "1.0g/cm3"],
    translations: {
      ko: { name: "실버 미스트", colorway: null, description: "빛의 결을 부드럽게 정리하는 실버 톤 프레임입니다." },
      en: { name: "Silver Mist", colorway: null, description: "A silver-toned frame that softens the texture of light." },
      zh: { name: "银雾", colorway: null, description: "柔和整理光线质感的银色调镜框。" }
    }
  }
];
```

- [ ] **Step 4: Add SQL seed**

Write `supabase/seed/seed-oogo-content.sql`:

```sql
insert into public.landing_pages (page_key, title, published, sort_order) values
  ('header', 'Header', true, 10),
  ('home', 'Home', true, 20),
  ('brand-story', 'Brand Story', true, 30),
  ('collection', 'Collection', true, 40),
  ('product-detail', 'Product Detail', true, 50),
  ('special-edition', 'Special Edition', true, 60),
  ('inquiry', 'Inquiry', true, 70),
  ('footer', 'Footer', true, 80)
on conflict (page_key) do update set
  title = excluded.title,
  published = excluded.published,
  sort_order = excluded.sort_order;

insert into public.company_settings (id, email, phone, kakao, instagram, address)
values (true, null, null, null, null, null)
on conflict (id) do nothing;

insert into public.company_translations (locale, brand_description, footer_note) values
  ('ko', 'OOGO는 조용하지만 분명한 존재감과 정제된 시선을 제안하는 한국 아이웨어 브랜드입니다.', 'OOGO frames a way of seeing.'),
  ('en', 'OOGO is a Korean eyewear brand for quiet confidence and a refined way of seeing.', 'OOGO frames a way of seeing.'),
  ('zh', 'OOGO 是一个以安静自信与精致视角为核心的韩国眼镜品牌。', 'OOGO frames a way of seeing.')
on conflict (locale) do update set
  brand_description = excluded.brand_description,
  footer_note = excluded.footer_note;
```

- [ ] **Step 5: Run seed tests**

Run: `npm run test -- tests/unit/seed-data.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit seed data**

```bash
git add src/lib/seed-data.ts supabase/seed/seed-oogo-content.sql tests/unit/seed-data.test.ts
git commit -m "feat: add initial OOGO seed content"
```

---

### Task 4: Implement Supabase Clients And Public Data Access

**Files:**
- Create: `src/lib/supabase/browser.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/public-content.ts`
- Create: `src/lib/products.ts`
- Create: `tests/unit/products.test.ts`

- [ ] **Step 1: Write product mapping tests**

Write `tests/unit/products.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { mapProductRow } from "@/lib/products";

describe("product mapping", () => {
  it("maps Supabase product rows to public product cards", () => {
    const product = mapProductRow({
      id: "p1",
      slug: "og26001c2-sunset-stroll",
      model_code: "OG26001C2",
      size: "63-17-145",
      frame_material: "PC",
      lens_material: "PA12",
      lens_features: ["UV400"],
      published: true,
      featured: true,
      sort_order: 1,
      product_translations: [{ locale: "en", name: "Sunset Stroll", colorway: null, description: "Desc" }]
    }, "en");

    expect(product.name).toBe("Sunset Stroll");
    expect(product.modelCode).toBe("OG26001C2");
  });
});
```

- [ ] **Step 2: Run test and verify failure**

Run: `npm run test -- tests/unit/products.test.ts`

Expected: FAIL because `src/lib/products.ts` does not exist.

- [ ] **Step 3: Implement product mapper**

Write `src/lib/products.ts`:

```ts
import type { Locale } from "@/lib/i18n";

type ProductRow = {
  id: string;
  slug: string;
  model_code: string;
  size: string | null;
  frame_material: string | null;
  lens_material: string | null;
  lens_features: string[];
  published: boolean;
  featured: boolean;
  sort_order: number;
  product_translations: Array<{
    locale: string;
    name: string;
    colorway: string | null;
    description: string | null;
  }>;
};

export function mapProductRow(row: ProductRow, locale: Locale) {
  const translation =
    row.product_translations.find((item) => item.locale === locale) ??
    row.product_translations.find((item) => item.locale === "ko") ??
    row.product_translations[0];

  return {
    id: row.id,
    slug: row.slug,
    modelCode: row.model_code,
    name: translation?.name ?? row.model_code,
    colorway: translation?.colorway ?? null,
    description: translation?.description ?? null,
    size: row.size,
    frameMaterial: row.frame_material,
    lensMaterial: row.lens_material,
    lensFeatures: row.lens_features,
    featured: row.featured,
    sortOrder: row.sort_order
  };
}
```

- [ ] **Step 4: Add Supabase clients**

Write `src/lib/supabase/browser.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

Write `src/lib/supabase/server.ts`:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        }
      }
    }
  );
}
```

- [ ] **Step 5: Add public content access**

Write `src/lib/public-content.ts`:

```ts
import type { Locale } from "@/lib/i18n";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapProductRow } from "@/lib/products";

export async function getFeaturedProducts(locale: Locale) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, model_code, size, frame_material, lens_material, lens_features, published, featured, sort_order, product_translations(locale, name, colorway, description)")
    .eq("published", true)
    .eq("featured", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapProductRow(row, locale));
}

export async function getLandingBlocks(locale: Locale) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("landing_blocks")
    .select("page_key, block_key, locale, published_content")
    .eq("locale", locale)
    .eq("published", true);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
```

- [ ] **Step 6: Run unit tests**

Run: `npm run test`

Expected: all unit tests pass.

- [ ] **Step 7: Commit data access**

```bash
git add src/lib/supabase src/lib/public-content.ts src/lib/products.ts tests/unit/products.test.ts
git commit -m "feat: add Supabase public data access"
```

---

### Task 5: Build Public Homepage Components

**Files:**
- Create: `src/components/public/SiteHeader.tsx`
- Create: `src/components/public/HeroSection.tsx`
- Create: `src/components/public/BrandStorySection.tsx`
- Create: `src/components/public/CollectionPreview.tsx`
- Create: `src/components/public/SpecialEditionSection.tsx`
- Create: `src/components/public/InquirySection.tsx`
- Create: `src/components/public/SiteFooter.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Create: `tests/e2e/public.spec.ts`

- [ ] **Step 1: Write public smoke test**

Write `tests/e2e/public.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("homepage shows OOGO brand story", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "OOGO" })).toBeVisible();
  await expect(page.getByText("Light & Shadow Gallery")).toBeVisible();
  await expect(page.getByText("Quiet confidence")).toBeVisible();
});
```

- [ ] **Step 2: Run e2e and verify failure**

Run: `npm run test:e2e -- tests/e2e/public.spec.ts`

Expected: FAIL until homepage components are implemented.

- [ ] **Step 3: Implement public components with static fallback content**

Write `src/components/public/HeroSection.tsx`:

```tsx
export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Light & Shadow Gallery</p>
        <h1>OOGO</h1>
        <p className="hero-line">Quiet confidence begins with attitude.</p>
        <p className="hero-description">
          OOGO는 조용하지만 분명한 존재감과 정제된 시선을 제안하는 한국 아이웨어 브랜드입니다.
        </p>
      </div>
    </section>
  );
}
```

Write the remaining public components with focused static fallback markup:

```tsx
export function BrandStorySection() {
  return (
    <section className="section-block" id="brand">
      <p className="eyebrow">Brand Essence</p>
      <h2>과시하지 않는 존재감, 빛을 바라보는 감각.</h2>
      <div className="essence-grid">
        {["Quiet", "Human", "Light", "Shadow", "Memory", "Frame"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}
```

Create similar small files for `SiteHeader`, `CollectionPreview`, `SpecialEditionSection`, `InquirySection`, and `SiteFooter`. Keep each under 120 lines.

- [ ] **Step 4: Wire homepage**

Write `src/app/page.tsx`:

```tsx
import { BrandStorySection } from "@/components/public/BrandStorySection";
import { CollectionPreview } from "@/components/public/CollectionPreview";
import { HeroSection } from "@/components/public/HeroSection";
import { InquirySection } from "@/components/public/InquirySection";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SpecialEditionSection } from "@/components/public/SpecialEditionSection";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <BrandStorySection />
        <CollectionPreview />
        <SpecialEditionSection />
        <InquirySection />
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 5: Add public styling**

Extend `src/app/globals.css` with:

```css
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 5vw;
  color: #f4f0e8;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  padding: 18vh 5vw 10vh;
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.76), rgba(0, 0, 0, 0.16)),
    #171411;
}

.hero-copy {
  max-width: 720px;
}

.eyebrow {
  margin: 0 0 18px;
  color: #c8b8a2;
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

h1,
h2 {
  margin: 0;
  letter-spacing: 0;
  font-weight: 500;
}

h1 {
  font-size: clamp(4rem, 13vw, 11rem);
  line-height: 0.86;
}

h2 {
  font-size: clamp(2rem, 5vw, 4.5rem);
  line-height: 1.04;
}

.hero-line {
  margin: 24px 0 0;
  font-size: clamp(1.4rem, 3vw, 3rem);
}

.hero-description {
  max-width: 540px;
  color: #d8d0c6;
  line-height: 1.8;
}

.section-block {
  padding: 120px 5vw;
  background: #f2eee6;
  color: #171411;
}

.essence-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin-top: 42px;
  border: 1px solid #d8d0c6;
}

.essence-grid span {
  padding: 24px;
  background: #f8f5ef;
}
```

- [ ] **Step 6: Verify public route**

Run: `npm run test:e2e -- tests/e2e/public.spec.ts`

Expected: PASS.

Run: `npm run build`

Expected: build succeeds.

- [ ] **Step 7: Commit public homepage**

```bash
git add src/app src/components/public tests/e2e/public.spec.ts
git commit -m "feat: build OOGO public homepage"
```

---

### Task 6: Add Inquiry Submission Flow

**Files:**
- Create: `src/lib/inquiries.ts`
- Create: `src/app/inquiry/actions.ts`
- Modify: `src/components/public/InquirySection.tsx`
- Create: `tests/unit/inquiries.test.ts`

- [ ] **Step 1: Write inquiry validation tests**

Write `tests/unit/inquiries.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { validateInquiryInput } from "@/lib/inquiries";

describe("inquiry validation", () => {
  it("accepts valid inquiry data", () => {
    const result = validateInquiryInput({
      type: "buyer",
      name: "Jane",
      email: "jane@example.com",
      message: "I want to discuss wholesale.",
      company: "Studio",
      country: "Korea",
      phone: ""
    });

    expect(result.ok).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = validateInquiryInput({
      type: "buyer",
      name: "Jane",
      email: "bad",
      message: "Hello"
    });

    expect(result.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Implement validation**

Write `src/lib/inquiries.ts`:

```ts
import type { InquiryType } from "@/types/content";

const inquiryTypes: InquiryType[] = ["general", "buyer", "retail", "collaboration", "other"];

type InquiryInput = {
  type: string;
  name: string;
  email: string;
  message: string;
  company?: string;
  country?: string;
  phone?: string;
};

export function validateInquiryInput(input: InquiryInput):
  | { ok: true; value: InquiryInput & { type: InquiryType } }
  | { ok: false; message: string } {
  if (!inquiryTypes.includes(input.type as InquiryType)) {
    return { ok: false, message: "Invalid inquiry type." };
  }

  if (input.name.trim().length < 2) {
    return { ok: false, message: "Name is required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { ok: false, message: "Valid email is required." };
  }

  if (input.message.trim().length < 10) {
    return { ok: false, message: "Message must be at least 10 characters." };
  }

  return { ok: true, value: { ...input, type: input.type as InquiryType } };
}
```

- [ ] **Step 3: Add server action**

Write `src/app/inquiry/actions.ts`:

```ts
"use server";

import { validateInquiryInput } from "@/lib/inquiries";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function submitInquiry(formData: FormData) {
  const input = {
    type: String(formData.get("type") ?? "general"),
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    company: String(formData.get("company") ?? ""),
    country: String(formData.get("country") ?? ""),
    phone: String(formData.get("phone") ?? "")
  };

  const validation = validateInquiryInput(input);
  if (!validation.ok) {
    return { ok: false, message: validation.message };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("inquiries").insert({
    type: validation.value.type,
    name: validation.value.name,
    email: validation.value.email,
    message: validation.value.message,
    company: validation.value.company || null,
    country: validation.value.country || null,
    phone: validation.value.phone || null
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Inquiry submitted." };
}
```

- [ ] **Step 4: Wire inquiry form**

Update `src/components/public/InquirySection.tsx` to render a form using `submitInquiry`.

- [ ] **Step 5: Verify**

Run: `npm run test -- tests/unit/inquiries.test.ts`

Expected: PASS.

Run: `npm run build`

Expected: build succeeds.

- [ ] **Step 6: Commit inquiry flow**

```bash
git add src/lib/inquiries.ts src/app/inquiry/actions.ts src/components/public/InquirySection.tsx tests/unit/inquiries.test.ts
git commit -m "feat: add inquiry submission flow"
```

---

### Task 7: Add Admin Authentication And Shell

**Files:**
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/AdminSidebar.tsx`
- Create: `src/components/admin/AdminTopbar.tsx`
- Create: `src/components/admin/AdminCard.tsx`

- [ ] **Step 1: Implement login page**

Write `src/app/admin/login/page.tsx` with an email/password form and Supabase browser login.

- [ ] **Step 2: Implement admin layout**

Write `src/app/admin/layout.tsx` to check Supabase session on the server. If no user exists, redirect to `/admin/login`.

- [ ] **Step 3: Implement admin shell components**

Create sidebar links:

- Dashboard
- Products
- Landing Page
- Files
- Inquiries
- Company & Brand
- Users & Roles

- [ ] **Step 4: Implement dashboard route**

Write `src/app/admin/page.tsx` with summary cards for products, published products, open inquiries, and landing drafts. Use placeholder zero states until live queries are added in the next tasks.

- [ ] **Step 5: Verify**

Run: `npm run build`

Expected: build succeeds and `/admin` route compiles.

- [ ] **Step 6: Commit admin shell**

```bash
git add src/app/admin src/components/admin
git commit -m "feat: add admin dashboard shell"
```

---

### Task 8: Add Product Admin MVP

**Files:**
- Create: `src/lib/admin-content.ts`
- Create: `src/app/admin/products/page.tsx`
- Create: `src/app/admin/products/new/page.tsx`
- Create: `src/app/admin/products/[id]/page.tsx`
- Create: `src/components/admin/ProductForm.tsx`

- [ ] **Step 1: Add admin product query and mutation helpers**

Write functions in `src/lib/admin-content.ts`:

- `getAdminProducts()`
- `getAdminProduct(id: string)`
- `saveProduct(input)`
- `setProductPublished(id: string, published: boolean)`

- [ ] **Step 2: Build product library page**

Show model code, KR name, published status, featured status, and edit link.

- [ ] **Step 3: Build product form**

Fields:

- model code
- slug
- size
- frame material
- lens material
- lens features
- featured
- published
- KR / EN / CN name, colorway, description

- [ ] **Step 4: Verify**

Run: `npm run build`

Expected: build succeeds.

- [ ] **Step 5: Commit product admin**

```bash
git add src/lib/admin-content.ts src/app/admin/products src/components/admin/ProductForm.tsx
git commit -m "feat: add product admin MVP"
```

---

### Task 9: Add Landing Page Editor MVP

**Files:**
- Create: `src/app/admin/landing/page.tsx`
- Create: `src/components/admin/LandingEditor.tsx`
- Modify: `src/lib/admin-content.ts`

- [ ] **Step 1: Add landing block admin helpers**

Add to `src/lib/admin-content.ts`:

- `getLandingBlocksForPage(pageKey: string, locale: Locale)`
- `saveLandingBlockDraft(input)`
- `publishLandingBlock(id: string)`

- [ ] **Step 2: Build page and locale selector**

Use page keys:

- Header
- Home
- Brand Story
- Collection
- Product Detail
- Special Edition
- Inquiry
- Footer

Use locale tabs:

- KR
- EN
- CN

- [ ] **Step 3: Build JSON-backed block editor**

For MVP, render editable fields based on known block keys. Store the result in `draft_content`.

- [ ] **Step 4: Add save and publish controls**

Save updates draft content. Publish copies draft content into `published_content`.

- [ ] **Step 5: Verify**

Run: `npm run build`

Expected: build succeeds.

- [ ] **Step 6: Commit landing editor**

```bash
git add src/app/admin/landing src/components/admin/LandingEditor.tsx src/lib/admin-content.ts
git commit -m "feat: add landing page editor MVP"
```

---

### Task 10: Add Files, Inquiries, And Company Admin

**Files:**
- Create: `src/lib/assets.ts`
- Create: `src/app/admin/files/page.tsx`
- Create: `src/app/admin/inquiries/page.tsx`
- Create: `src/app/admin/company/page.tsx`
- Modify: `src/lib/admin-content.ts`

- [ ] **Step 1: Add asset helpers**

Write `src/lib/assets.ts` with upload and list helpers for Supabase Storage bucket `oogo-assets`.

- [ ] **Step 2: Build files page**

Show upload input, asset type selector, and asset grid.

- [ ] **Step 3: Build inquiries page**

Show inquiry list and status selector. Status values are `open`, `in_progress`, and `closed`.

- [ ] **Step 4: Build company page**

Fields:

- email
- phone
- KakaoTalk
- Instagram
- address
- KR / EN / CN brand description
- KR / EN / CN footer note

- [ ] **Step 5: Verify**

Run: `npm run build`

Expected: build succeeds.

- [ ] **Step 6: Commit admin support modules**

```bash
git add src/lib/assets.ts src/app/admin/files src/app/admin/inquiries src/app/admin/company src/lib/admin-content.ts
git commit -m "feat: add files inquiries and company admin"
```

---

### Task 11: Connect Public Site To Managed Content

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/public/*.tsx`
- Create: `src/app/products/page.tsx`
- Create: `src/app/products/[slug]/page.tsx`

- [ ] **Step 1: Load landing blocks and featured products**

Update `src/app/page.tsx` to call `getLandingBlocks(locale)` and `getFeaturedProducts(locale)`. Keep static fallback content when Supabase variables are missing in local development.

- [ ] **Step 2: Pass managed content into public components**

Update public components to accept props instead of using only hard-coded copy.

- [ ] **Step 3: Build product listing**

Create `src/app/products/page.tsx` using published products from Supabase.

- [ ] **Step 4: Build product detail**

Create `src/app/products/[slug]/page.tsx` using slug lookup. Show product specs and images.

- [ ] **Step 5: Verify**

Run: `npm run build`

Expected: build succeeds.

Run: `npm run test:e2e -- tests/e2e/public.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit managed public content**

```bash
git add src/app/page.tsx src/app/products src/components/public src/lib/public-content.ts
git commit -m "feat: connect public site to managed content"
```

---

### Task 12: Final MVP Verification

**Files:**
- Modify: `README.md`
- Create: `docs/deployment.md`

- [ ] **Step 1: Write README**

Document local setup:

```md
# OOGO Homepage

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Fill Supabase variables.
3. Run `npm install`.
4. Run `npm run dev`.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run test`
- `npm run test:e2e`
```

- [ ] **Step 2: Write deployment notes**

Create `docs/deployment.md` with Vercel and Supabase environment variable setup, Supabase migration instructions, and domain notes for `www.oogolaps.com`.

- [ ] **Step 3: Run full verification**

Run: `npm run test`

Expected: all unit tests pass.

Run: `npm run build`

Expected: production build succeeds.

Run: `npm run test:e2e`

Expected: public smoke tests pass. Admin tests may require seeded local Supabase; document any skipped admin login tests.

- [ ] **Step 4: Commit docs and verification**

```bash
git add README.md docs/deployment.md
git commit -m "docs: add OOGO setup and deployment notes"
```

---

## Self-Review

Spec coverage:

- Public homepage: covered by Tasks 5 and 11.
- KR / EN / CN switching and locale model: covered by Tasks 2, 3, 9, and 11.
- Supabase schema and RLS baseline: covered by Task 2.
- Product admin and catalog display: covered by Tasks 8 and 11.
- Landing Page editor: covered by Task 9.
- Files admin: covered by Task 10.
- Inquiry submission and admin visibility: covered by Tasks 6 and 10.
- Company & Brand settings: covered by Task 10.
- Vercel deployment documentation: covered by Task 12.

Placeholder scan:

- No unresolved placeholder markers remain in the task instructions.
- MVP tasks include exact files, commands, and expected verification outcomes.

Type consistency:

- Locale uses `ko | en | zh` throughout.
- Inquiry statuses use `open | in_progress | closed` throughout.
- Publish behavior uses public `published` flags and landing-block `draft_content` / `published_content`.
