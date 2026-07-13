# Public Home Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a polished public Header, Footer, and Home page with a dashboard-ready, full-bleed Hero slider supporting up to five slides.

**Architecture:** Keep Supabase reads in existing server components and normalize the current single Hero content into a slide-array boundary in `home-landing.ts`. Add focused client components only for slider interaction and Header scroll state. Keep Dashboard writes out of scope while accepting autoplay settings through component props.

**Tech Stack:** Next.js 15, React 19, TypeScript, CSS, Vitest, Testing Library

---

### Task 1: Normalize Hero slides and timing

**Files:**
- Modify: `src/lib/home-landing.ts`
- Modify: `tests/unit/home-landing.test.ts`

- [ ] **Step 1: Write failing normalization tests**

Add tests proving that a saved `slides` array is filtered to valid objects, limited to five entries, and that existing single-image content becomes one fallback slide. Add a timing test proving values are clamped between 3 and 15 seconds.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `npm test -- --run tests/unit/home-landing.test.ts`

Expected: FAIL because `getHomeHeroSettings` is not exported.

- [ ] **Step 3: Implement the normalized boundary**

Export `HomeHeroSlide`, `HomeHeroSettings`, and `getHomeHeroSettings(content)` from `home-landing.ts`. Return `{ slides, autoplay, intervalMs }`, retain a one-slide fallback from existing keys, and cap the list at five.

- [ ] **Step 4: Re-run the focused test**

Run: `npm test -- --run tests/unit/home-landing.test.ts`

Expected: PASS.

### Task 2: Build the full-bleed Hero slider

**Files:**
- Create: `src/components/public/HomeHeroSlider.tsx`
- Modify: `src/components/public/HeroSection.tsx`
- Create: `tests/unit/home-hero-slider.test.tsx`

- [ ] **Step 1: Write failing rendering tests**

Cover one-slide rendering without controls, five-slide rendering with five progress buttons, accessible carousel labels, and the supplied interval value.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `npm test -- --run tests/unit/home-hero-slider.test.tsx`

Expected: FAIL because `HomeHeroSlider` does not exist.

- [ ] **Step 3: Implement slider behavior**

Create a client component that moves a transform-based track left, auto-advances with an injected interval, pauses on hover/focus/drag/reduced-motion, supports pointer swipe, and renders clickable progress buttons without arrows. Make `HeroSection` normalize content and delegate rendering.

- [ ] **Step 4: Re-run slider and landing tests**

Run: `npm test -- --run tests/unit/home-hero-slider.test.tsx tests/unit/home-landing.test.ts`

Expected: PASS.

### Task 3: Improve Header scroll state and Footer hierarchy

**Files:**
- Create: `src/components/public/SiteHeaderFrame.tsx`
- Modify: `src/components/public/SiteHeader.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/public-final.css`
- Modify: `tests/unit/site-header.test.tsx`
- Modify: `tests/unit/public-home-styles.test.ts`

- [ ] **Step 1: Add failing shell tests**

Assert that Home requests the overlay Header, the Header frame exposes overlay state, Footer text uses the new readable size, and Hero controls have stable dimensions.

- [ ] **Step 2: Run the focused shell tests and confirm failure**

Run: `npm test -- --run tests/unit/site-header.test.tsx tests/unit/public-home-styles.test.ts`

Expected: FAIL on missing overlay frame and new CSS rules.

- [ ] **Step 3: Implement Header and Footer polish**

Wrap Header markup in a client frame that adds `is-scrolled` after leaving the Hero top. Pass `overlay` only from Home. Add final CSS for transparent/solid Header states, slider viewport/track/slides/progress, normalized Home section spacing, and a modest Footer type increase.

- [ ] **Step 4: Re-run all focused tests**

Run: `npm test -- --run tests/unit/home-landing.test.ts tests/unit/home-hero-slider.test.tsx tests/unit/site-header.test.tsx tests/unit/public-home-styles.test.ts`

Expected: PASS.

### Task 4: Desktop verification

**Files:**
- Verify: `src/app/page.tsx`
- Verify: `src/app/public-final.css`

- [ ] **Step 1: Run a focused TypeScript check**

Run: `npx tsc --noEmit`

Expected: PASS with no TypeScript errors.

- [ ] **Step 2: Verify the Home page in the browser**

Check a desktop viewport for nonblank Hero rendering, leftward slide movement when multiple test slides are supplied, readable Header before and after scroll, consistent section rhythm, and readable Footer. Confirm no console errors or horizontal overflow.

- [ ] **Step 3: Record deferred work**

Leave Dashboard slide editing, final translations, full mobile QA, full test suite, and production build for their approved batch checkpoints.
