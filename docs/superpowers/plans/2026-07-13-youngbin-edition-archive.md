# Youngbin Edition Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separate OOGO and Youngbin Edition archive collections across database, admin, public gallery, and project navigation.

**Architecture:** Add a constrained `collection_key` to `archive_items` and require it at every query and mutation boundary. Reuse the existing gallery/lightbox while adding a dedicated Youngbin archive route and collection-aware admin tabs.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Supabase Postgres/Storage, Vitest.

## Global Constraints

- Existing Archive rows remain assigned to `oogo`.
- No mixed `All` gallery.
- Published items remain newest-first.
- Existing Storage objects are reused; no new bucket.
- Public copy supports the existing landing-content localization pattern.

---

### Task 1: Collection Schema And Domain Helpers

**Files:**
- Create: `supabase/migrations/20260713103000_split_archive_collections.sql`
- Create: `src/lib/archive-collections.ts`
- Modify: `src/lib/archive-content.ts`
- Test: `tests/unit/schema.test.ts`
- Test: `tests/unit/archive-content.test.ts`

- [ ] Add failing tests for the constrained collection key, default OOGO assignment, parser fallback, and collection-scoped sorting.
- [ ] Run the focused tests and confirm the expected failures.
- [ ] Add the migration and typed collection helper.
- [ ] Scope public and admin Archive queries by collection.
- [ ] Run focused tests until green.

### Task 2: Collection-Aware Archive Actions And Admin UI

**Files:**
- Modify: `src/app/admin/archive/actions.ts`
- Modify: `src/app/admin/archive/page.tsx`
- Modify: `src/components/admin/ArchiveGalleryEditor.tsx`
- Test: `tests/unit/archive-actions.test.ts`
- Test: `tests/unit/archive-gallery-editor.test.tsx`

- [ ] Add failing tests for validated collection input, collection-scoped publish, segmented links, counts, and public URLs.
- [ ] Run the focused tests and confirm the expected failures.
- [ ] Pass `collectionKey` through upload, draft, publish, replace, and delete operations.
- [ ] Add query-string collection parsing and the OOGO/Youngbin segmented control.
- [ ] Run focused tests until green.

### Task 3: Youngbin Public Archive And Project Links

**Files:**
- Create: `src/app/archive/youngbin-edition/page.tsx`
- Modify: `src/app/archive/page.tsx`
- Modify: `src/app/projects/youngbin-edition/page.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/unit/archive-gallery.test.tsx`
- Test: `tests/unit/product-detail-page.test.ts`

- [ ] Add failing source/render tests proving collection isolation and both directions of navigation.
- [ ] Run focused tests and confirm the expected failures.
- [ ] Add the Youngbin header, empty state, shared gallery, and `View Project` link.
- [ ] Add `View Photo Archive` to the project footer CTA area.
- [ ] Run focused tests until green.

### Task 4: Landing Content Contract And Remote Migration

**Files:**
- Modify: `src/lib/home-landing.ts`
- Modify: `src/lib/seed-data.ts`
- Modify: `tests/unit/home-landing.test.ts`
- Modify: `tests/unit/seed-data.test.ts`

- [ ] Add failing tests for localized Youngbin archive intro fields in the Special/Project Detail group.
- [ ] Add the landing block defaults and editor metadata.
- [ ] Apply the collection migration to Supabase project `gyvubeeotdytzigrhmdc`.
- [ ] Verify existing rows are `oogo` and collection indexes/policies are present.

### Task 5: Verification

- [ ] Run `npm test` and require all tests to pass.
- [ ] Run `npm run build` and require a successful production build.
- [ ] Verify `/admin/archive?collection=oogo`, `/admin/archive?collection=youngbin-edition`, `/archive`, `/archive/youngbin-edition`, and `/projects/youngbin-edition` at desktop and mobile widths.
- [ ] Confirm no unrelated files or credentials are included in the change summary.
