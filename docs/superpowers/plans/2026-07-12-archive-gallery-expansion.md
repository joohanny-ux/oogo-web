# Archive Gallery Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fixed 12-image Archive block with an expandable, newest-first gallery and a compact multi-upload admin workflow.

**Architecture:** A dedicated `archive_items` table stores individual Archive entries and publication state while optionally linking each entry to an asset. Public and admin data helpers isolate Supabase reads and legacy fallback; focused public and admin components render the two workflows independently.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Supabase Postgres/Storage/RLS, Vitest, CSS.

## Global Constraints

- Keep existing Archive images visible throughout migration.
- Public order is newest published first.
- Admin order is newest created first.
- Public grid is five columns on wide desktop, three on tablet, and two on mobile.
- Admin grid is compact, four columns by default and five on wide displays.
- Visible editorial image names are removed; alt text remains available to assistive technology.
- New uploads are drafts until published.
- Do not expose Supabase credentials or modify unrelated worktree changes.

---

### Task 1: Archive Schema And Legacy Migration

**Files:**
- Create: `supabase/migrations/20260712090000_create_archive_items.sql`
- Test: `tests/unit/schema.test.ts`

**Interfaces:**
- Produces: `public.archive_items(id, asset_id, image_url, alt_text, published, created_at, published_at)`.
- Produces: public read and admin/editor management RLS policies.

- [ ] **Step 1: Add failing schema assertions**

Assert that the migration creates `archive_items`, includes `published_at`, orders migration input from the legacy gallery block, enables RLS, and defines public/admin policies.

- [ ] **Step 2: Run the schema test and confirm failure**

Run: `npm test -- --run tests/unit/schema.test.ts`

Expected: FAIL because the Archive migration does not exist.

- [ ] **Step 3: Implement the migration**

Create the table and indexes, enable RLS, add policies, and import non-empty `mediaUrl` through `image12Url` values from the published or draft Korean Archive gallery block. Preserve legacy order by assigning deterministic timestamps while keeping the first legacy image newest.

- [ ] **Step 4: Run the schema test**

Run: `npm test -- --run tests/unit/schema.test.ts`

Expected: PASS.

### Task 2: Archive Data Helpers

**Files:**
- Create: `src/lib/archive-content.ts`
- Test: `tests/unit/archive-content.test.ts`

**Interfaces:**
- Produces: `ArchiveItem` type.
- Produces: `getPublicArchiveItems(): Promise<ArchiveItem[]>`.
- Produces: `getAdminArchiveItems(): Promise<ArchiveItem[]>`.
- Produces: `mergeArchiveItems(rows, fallback): ArchiveGridItem[]`.

- [ ] **Step 1: Write failing helper tests**

Cover newest-first sorting, omission of unpublished rows from public mapping, URL/alt mapping, and legacy fallback when rows are empty.

- [ ] **Step 2: Run the focused tests and confirm failure**

Run: `npm test -- --run tests/unit/archive-content.test.ts`

Expected: FAIL because the helper module is missing.

- [ ] **Step 3: Implement minimal helpers**

Query public rows by `published_at desc, created_at desc`, query admin rows by `created_at desc`, and catch public query failures so `mergeArchiveItems` can return the existing `archiveGridItems` fallback.

- [ ] **Step 4: Run the focused tests**

Run: `npm test -- --run tests/unit/archive-content.test.ts`

Expected: PASS.

### Task 3: Archive Admin Server Actions

**Files:**
- Modify: `src/app/admin/archive/actions.ts`
- Modify: `src/app/admin/archive/page.tsx`
- Modify: `src/app/admin/files/actions.ts`
- Test: `tests/unit/archive-actions.test.ts`

**Interfaces:**
- Produces: `saveArchiveDraftAction(formData)` for multi-file draft creation.
- Produces: `saveAndPublishArchiveAction(formData)` for multi-file creation plus publishing all drafts.
- Produces: `deleteArchiveItemAction(formData)` for removing a gallery item.

- [ ] **Step 1: Write failing action-source tests**

Assert multi-file parsing, per-file 8MB validation, draft insertion, bulk publication timestamping, route revalidation, and Archive usage checks before asset deletion.

- [ ] **Step 2: Run the focused tests and confirm failure**

Run: `npm test -- --run tests/unit/archive-actions.test.ts`

Expected: FAIL because the new actions are missing.

- [ ] **Step 3: Implement actions and page data loading**

Upload each selected image under `archive/<timestamp>-<safe-name>`, insert/reuse its `assets` row, insert an unpublished `archive_items` row, publish all drafts when requested, and revalidate `/archive`, `/admin/archive`, and `/admin/files`.

- [ ] **Step 4: Run focused action tests**

Run: `npm test -- --run tests/unit/archive-actions.test.ts`

Expected: PASS.

### Task 4: Compact Admin Archive UI

**Files:**
- Modify: `src/components/admin/ArchiveGalleryEditor.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/unit/archive-gallery-editor.test.tsx`

**Interfaces:**
- Consumes: `ArchiveItem[]` and the three Archive actions.
- Produces: multi-file form with `archiveFiles` input and header actions.

- [ ] **Step 1: Update component tests to describe the approved UI**

Assert that the editor has a multiple file input, top `초안 저장` and `게시하기` actions, status indicators, compact image cards, and no fixed labels such as `Campaign light`.

- [ ] **Step 2: Run the component test and confirm failure**

Run: `npm test -- --run tests/unit/archive-gallery-editor.test.tsx`

Expected: FAIL against the fixed 12-card editor.

- [ ] **Step 3: Implement the compact editor**

Render a header action bar, multiple file input, empty state, newest-first compact cards, accessible replace/delete icon controls with tooltips, and draft/public counts. Use four columns by default, five on wide screens, two on tablet, and one on narrow mobile.

- [ ] **Step 4: Run the component test**

Run: `npm test -- --run tests/unit/archive-gallery-editor.test.tsx`

Expected: PASS.

### Task 5: Public Five-Column Archive

**Files:**
- Modify: `src/app/archive/page.tsx`
- Modify: `src/components/public/ArchiveGallery.tsx`
- Modify: `src/app/public-final.css`
- Modify: `tests/unit/archive-gallery.test.tsx`

**Interfaces:**
- Consumes: `getPublicArchiveItems()` and legacy `archiveGridItems`.
- Produces: accessible newest-first public gallery and lightbox without visible image names.

- [ ] **Step 1: Update public gallery tests**

Assert that card and toolbar labels are not visibly rendered, accessible labels remain, and the page consumes dynamic Archive items with fallback.

- [ ] **Step 2: Run focused tests and confirm failure**

Run: `npm test -- --run tests/unit/archive-gallery.test.tsx`

Expected: FAIL while visible `<strong>` labels and fixed 12-item mapping remain.

- [ ] **Step 3: Implement the public gallery and styling**

Use a centered maximum-width container, five/three/two responsive columns, 24-30px gaps, 4:5 tiles, newest-first data, and the existing keyboard/swipe lightbox behavior without visible titles.

- [ ] **Step 4: Run focused tests**

Run: `npm test -- --run tests/unit/archive-gallery.test.tsx tests/unit/archive-content.test.ts`

Expected: PASS.

### Task 6: Full Verification

**Files:**
- Modify only if verification reveals an Archive-specific defect.

**Interfaces:**
- Validates all prior tasks together.

- [ ] **Step 1: Run all unit tests**

Run: `npm test -- --run`

Expected: all tests pass.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: exit code 0 with `/archive` and `/admin/archive` included.

- [ ] **Step 3: Verify local HTTP responses**

Run PowerShell requests against `http://127.0.0.1:3100/archive` and `http://127.0.0.1:3100/admin/archive`.

Expected: both return HTTP 200.

- [ ] **Step 4: Review the final diff**

Confirm that no credentials, unrelated generated files, or user changes were modified.
