# OOGO Admin Product Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Localize product-detail specifications, compact the product and landing actions, and simplify Dashboard Home around live operational data.

**Architecture:** Extend `product_translations` with localized specification fields while retaining shared product fields as fallbacks. Keep one shared product form submission, switch locale panels on the client, and map the active locale at the public-content boundary. Fetch dashboard metrics server-side from Supabase.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Supabase Postgres/SSR, Vitest, CSS.

## Global Constraints

- Preserve existing products, translations, assets, and images.
- Keep `model_code`, `slug`, and `size` shared.
- Store `size_note`, `frame_material`, `lens_material`, and `lens_features` per locale.
- Keep English for navigation, headings, field labels, and commands; use Korean for explanations, helper text, warnings, validation, and status.
- Keep controls compact and preserve existing admin routes.

---

### Task 1: Localized Product Specification Schema

**Files:**
- Create: `supabase/migrations/0007_localized_product_specs.sql`
- Modify: `tests/unit/schema.test.ts`

**Interfaces:**
- Produces: `product_translations.size_note`, `frame_material`, `lens_material`, and `lens_features`.

- [ ] Add a failing schema test asserting the four translation columns and backfill update exist.
- [ ] Run `npm run test -- tests/unit/schema.test.ts` and confirm failure.
- [ ] Add nullable text columns plus `lens_features text[] not null default '{}'` and backfill existing translation rows from `products`.
- [ ] Re-run the schema test and confirm it passes.
- [ ] Apply the migration to Supabase project `gyvubeeotdytzigrhmdc` and verify columns and preserved row counts with read-only SQL.

### Task 2: Product Mapping And Persistence

**Files:**
- Modify: `src/lib/products.ts`
- Modify: `src/lib/public-content.ts`
- Modify: `src/lib/admin-content.ts`
- Modify: `src/app/admin/products/actions.ts`
- Modify: `tests/unit/products.test.ts`

**Interfaces:**
- Consumes: localized columns from Task 1.
- Produces: `sizeNote`, localized specification fallbacks, and locale-specific save payloads.

- [ ] Add failing mapper tests proving the active locale wins and shared product specs are fallback values.
- [ ] Run `npm run test -- tests/unit/products.test.ts` and confirm failure.
- [ ] Extend product row types and Supabase selects with localized specification fields.
- [ ] Parse each locale's `sizeNote`, `frameMaterial`, `lensMaterial`, and newline-delimited `lensFeaturesText` in the product action.
- [ ] Upsert localized values into `product_translations` without removing legacy shared columns.
- [ ] Re-run product tests and confirm they pass.

### Task 3: Compact Locale-Tabbed Product Editor

**Files:**
- Modify: `src/components/admin/ProductForm.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/admin/products/new/page.tsx`
- Modify: `src/app/admin/products/[id]/page.tsx`
- Modify: `tests/unit/product-form.test.tsx`

**Interfaces:**
- Consumes: localized product translation data from Task 2.
- Produces: one shared field section, `KR / EN / CN` locale panels, compact actions, and Korean helper copy.

- [ ] Add failing form tests for shared Size, locale-specific specification inputs, locale tabs, `Create product`/`Save changes`, and compact action markup.
- [ ] Run `npm run test -- tests/unit/product-form.test.tsx` and confirm failure.
- [ ] Convert `ProductForm` to a client component with one active locale and hidden mounted panels so all values submit together.
- [ ] Move Feature/Public controls beside a compact action bar and add a Cancel command.
- [ ] Keep the detail gallery on the right at desktop widths and stack it below content on mobile.
- [ ] Replace English helper sentences with concise Korean copy.
- [ ] Re-run product form tests and confirm they pass.

### Task 4: Public Product Detail Localization

**Files:**
- Modify: `src/lib/products.ts`
- Modify: `src/app/products/[slug]/page.tsx` only if rendering needs an additional field.
- Modify: `tests/unit/products.test.ts`

**Interfaces:**
- Consumes: `sizeNote`, localized frame/lens values, and localized lens features.
- Produces: localized public detail sections with shared Size plus translated Size note.

- [ ] Add a failing detail-section test for Size primary value and localized secondary note.
- [ ] Update `getProductDetailSections` to use localized values without hard-coded Korean primary copy.
- [ ] Run product tests and confirm they pass.

### Task 5: Simplified Dashboard Home With Live Counts

**Files:**
- Modify: `src/lib/admin-content.ts`
- Modify: `src/app/admin/page.tsx`
- Modify: `tests/unit/admin-dashboard.test.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: `getAdminDashboardSummary(): Promise<{ products: number; publishedProducts: number; openInquiries: number }>`.

- [ ] Replace the old dashboard tests with failing assertions that Setup Status, Landing Pages, and Landing drafts are absent and live summary values render.
- [ ] Add count-only Supabase queries for all products, published products, and non-closed inquiries.
- [ ] Make the dashboard page async and render only the title, Korean description, three metrics, and compact shortcuts.
- [ ] Remove unused setup and landing-card CSS.
- [ ] Run dashboard tests and confirm they pass.

### Task 6: Dashboard Copy And Action Consistency

**Files:**
- Modify: `src/app/admin/landing/page.tsx`
- Modify: `src/components/admin/LandingEditor.tsx`
- Modify: `src/app/admin/products/page.tsx`
- Modify: `src/app/admin/files/page.tsx`
- Modify: `src/app/admin/inquiries/page.tsx`
- Modify: `src/app/admin/company/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: consistent English labels/commands and Korean explanatory copy across admin pages.

- [ ] Add or update focused copy assertions where unit tests already exist.
- [ ] Translate page descriptions, helper copy, empty states, and operational guidance into Korean.
- [ ] Reduce Landing Page draft/publish buttons to command width and align them in one action row.
- [ ] Normalize admin button heights, section spacing, border radii, and heading scale.
- [ ] Run focused admin unit tests and confirm they pass.

### Task 7: Full Verification

**Files:**
- Verify only.

- [ ] Run `npm run test` and confirm all tests pass.
- [ ] Run `npm run build` and confirm compilation, lint, and type checks pass.
- [ ] Restart the dev server after the build.
- [ ] Verify `/admin`, `/admin/products/new`, `/admin/products/[id]`, `/admin/landing`, `/collection`, and `/products/[slug]` in the browser at desktop and mobile widths.
- [ ] Confirm there is no error overlay, text overlap, blank content, or unstable layout.
- [ ] Confirm a reversible localized product edit appears on the public product page, then restore the original content.
