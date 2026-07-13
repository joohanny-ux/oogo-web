# Youngbin Edition Compact Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the Youngbin Edition project page to four concise chapters and align the Dashboard Special editor with the same information architecture.

**Architecture:** Keep the existing six Supabase block keys for content compatibility, but compose them into four public chapters and four Dashboard editor groups. The public page remains server-rendered and uses the existing fallback helpers, while scoped CSS controls the more compact editorial layout.

**Tech Stack:** Next.js 15 App Router, React, TypeScript, Supabase-backed landing blocks, Vitest, CSS.

## Global Constraints

- Preserve existing published block keys and fallback behavior.
- Reduce the desktop page length by roughly 35%.
- Use four public chapters: Hero, Story & Edition, Gallery, Photographer.
- Keep desktop and mobile free of horizontal overflow.
- Keep code comments and technical names in English.

---

### Task 1: Lock the Four-Chapter Contract

**Files:**
- Modify: `tests/unit/youngbin-edition-page.test.ts`
- Modify: `tests/unit/landing-editor.test.tsx`
- Modify: `tests/unit/public-home-styles.test.ts`

**Interfaces:**
- Consumes: current project page source, editor source, and scoped CSS.
- Produces: failing tests that describe the approved four-chapter structure.

- [ ] **Step 1: Add assertions for four public sections, one archive-focused final CTA, and no separate footer CTA**
- [ ] **Step 2: Add assertions for four Dashboard group labels while preserving all six block keys**
- [ ] **Step 3: Add assertions for compact height constraints and a 2x2 gallery**
- [ ] **Step 4: Run the three focused test files and confirm the new assertions fail for the expected old structure**

Run: `npm test -- --run tests/unit/youngbin-edition-page.test.ts tests/unit/landing-editor.test.tsx tests/unit/public-home-styles.test.ts`

Expected: FAIL on the new compact-layout assertions.

### Task 2: Compose Four Public Chapters

**Files:**
- Modify: `src/app/projects/youngbin-edition/page.tsx`
- Test: `tests/unit/youngbin-edition-page.test.ts`

**Interfaces:**
- Consumes: `special-hero`, `collaboration-statement`, `limited-edition`, `edition-gallery`, `photographer-profile`, and `footer-cta` content blocks.
- Produces: four rendered sections without changing stored content keys.

- [ ] **Step 1: Keep Hero and convert the archive action to a text link**
- [ ] **Step 2: Merge statement and limited-edition markup into `youngbin-project-story-edition`**
- [ ] **Step 3: Limit the Edition Gallery to four distinct image roles and add its archive link**
- [ ] **Step 4: Integrate footer CTA links into the photographer profile and remove the standalone footer CTA section**
- [ ] **Step 5: Run `tests/unit/youngbin-edition-page.test.ts` and confirm it passes**

### Task 3: Group the Dashboard Editor

**Files:**
- Modify: `src/components/admin/LandingEditor.tsx`
- Test: `tests/unit/landing-editor.test.tsx`

**Interfaces:**
- Consumes: the existing six block definitions and save/publish actions.
- Produces: four visually grouped editing chapters with all current block keys still editable.

- [ ] **Step 1: Label and order the editor as Hero, Story & Edition, Gallery, and Photographer & Links**
- [ ] **Step 2: Group statement with limited-edition controls and profile with footer-link controls**
- [ ] **Step 3: Preserve existing form field names and save/publish behavior**
- [ ] **Step 4: Run `tests/unit/landing-editor.test.tsx` and confirm it passes**

### Task 4: Apply Compact Editorial Styling

**Files:**
- Modify: `src/app/public-final.css`
- Test: `tests/unit/public-home-styles.test.ts`

**Interfaces:**
- Consumes: the four public chapter class names from Task 2.
- Produces: a shorter desktop and mobile layout with consistent typography and CTA hierarchy.

- [ ] **Step 1: Reduce Hero height to approximately 70svh and tighten typography**
- [ ] **Step 2: Style the merged story chapter as a balanced two-column section**
- [ ] **Step 3: Convert the gallery to a compact 2x2 grid**
- [ ] **Step 4: Reduce profile height to approximately 520px and clarify CTA hierarchy**
- [ ] **Step 5: Add tablet and mobile rules with no horizontal overflow**
- [ ] **Step 6: Run `tests/unit/public-home-styles.test.ts` and confirm it passes**

### Task 5: Verify the Integrated Experience

**Files:**
- Verify: `src/app/projects/youngbin-edition/page.tsx`
- Verify: `src/components/admin/LandingEditor.tsx`
- Verify: `src/app/public-final.css`

**Interfaces:**
- Consumes: the completed public and Dashboard changes.
- Produces: verified desktop/mobile behavior and a production-ready build.

- [ ] **Step 1: Run all unit tests with `npm test -- --run`**
- [ ] **Step 2: Run `npm run build`**
- [ ] **Step 3: Inspect `/projects/youngbin-edition` at desktop and 390x844 mobile widths**
- [ ] **Step 4: Confirm four chapters, working inquiry/archive/project links, no horizontal overflow, and no browser console errors**
