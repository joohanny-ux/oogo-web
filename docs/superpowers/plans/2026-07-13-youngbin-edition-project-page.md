# Youngbin Edition Project Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Youngbin Edition project page as a six-section collaboration and limited-edition story, with a concise photographer profile and a direct link to the separate photo archive.

**Architecture:** Keep Supabase landing blocks as optional CMS overrides while moving the complete editorial fallback model into `src/lib/special-editions.ts`. The public route renders six explicit semantic sections, and the Landing Page > Special editor exposes the same six keys and fields in the same order. Approved editorial images are extracted from the supplied PDF into packaged project assets so the route remains complete when CMS content is missing.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Supabase landing blocks, CSS, Vitest, Playwright.

## Global Constraints

- Preserve the existing site header, footer, `/inquiry`, `/projects`, and `/archive/youngbin-edition` routes.
- Keep the complete Ji Youngbin photography portfolio only in the Youngbin Edition archive.
- Use only approved images extracted from `00 OOGO_SpecialEdition_2026_v1.0.pdf` for the new packaged fallbacks.
- Missing CMS text and media must fall back to packaged edition content without blank sections.
- Optional gallery images must be omitted without leaving empty tiles.
- Desktop, tablet, and mobile must preserve the same narrative order and avoid layout shift.
- Do not modify unrelated dirty-worktree changes or commit credentials.

---

### Task 1: Editorial Assets And Fallback Model

**Files:**
- Create: `public/images/projects/youngbin-edition/collaboration-hero.jpg`
- Create: `public/images/projects/youngbin-edition/limited-edition.jpg`
- Create: `public/images/projects/youngbin-edition/light-hands.jpg`
- Create: `public/images/projects/youngbin-edition/photographer-at-work.jpg`
- Create: `public/images/projects/youngbin-edition/photographer-profile.jpg`
- Modify: `src/lib/special-editions.ts`
- Test: `tests/unit/special-editions.test.ts`

**Interfaces:**
- Consumes: the supplied PDF and existing `getSpecialEditionBySlug(slug)` lookup.
- Produces: `YoungbinEditionContent`, semantic `images`, and complete fallback copy for all six public sections.

- [ ] **Step 1: Extend the unit test with the semantic fallback contract**

```ts
it("provides the complete Youngbin editorial fallback", () => {
  const edition = getFeaturedSpecialEdition();

  expect(edition.images.collaborationHero).toContain("youngbin-edition");
  expect(edition.statement.themes).toEqual(["Light", "Gaze", "Memory"]);
  expect(edition.limited.features).toHaveLength(3);
  expect(edition.profile.archiveHref).toBe("/archive/youngbin-edition");
  expect(edition.gallery).toHaveLength(5);
});
```

- [ ] **Step 2: Run the focused test and verify the old generic model fails**

Run: `npm test -- tests/unit/special-editions.test.ts`

Expected: FAIL because `statement`, `limited`, `profile`, and semantic image keys do not exist.

- [ ] **Step 3: Extract the five approved PDF images into stable project paths**

Use PyMuPDF to extract xrefs `6`, `26`, `32`, `33`, and `36` from the supplied PDF. Save the exact files listed above as JPEGs, preserving source pixels and removing no embedded product or photographer content.

- [ ] **Step 4: Replace the generic editorial array with a semantic typed model**

```ts
export type YoungbinEditionContent = {
  hero: { eyebrow: string; heading: string; subtitle: string; body: string };
  statement: { statementEn: string; bodyKo: string; themes: [string, string, string] };
  limited: {
    eyebrow: string;
    heading: string;
    body: string;
    features: Array<{ title: string; body: string }>;
  };
  gallery: Array<{ key: string; src: string; fit: "cover" | "contain" }>;
  profile: {
    eyebrow: string;
    name: string;
    role: string;
    quoteKo: string;
    quoteEn: string;
    body: string;
    credentials: [string, string, string];
    archiveLabel: string;
    archiveHref: string;
  };
};
```

Populate the fallback with the approved `Light · Gaze · Memory`, limited-edition attributes, short profile, three credentials, and `/archive/youngbin-edition` CTA.

- [ ] **Step 5: Run the focused test**

Run: `npm test -- tests/unit/special-editions.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit the fallback model and assets**

```bash
git add src/lib/special-editions.ts tests/unit/special-editions.test.ts public/images/projects/youngbin-edition
git commit -m "feat: add youngbin edition editorial content"
```

---

### Task 2: Six-Section Landing Editor Mapping

**Files:**
- Modify: `src/components/admin/LandingEditor.tsx`
- Modify: `tests/unit/landing-editor.test.tsx`

**Interfaces:**
- Consumes: the existing `SectionDefinition`, media upload controls, draft action, and publish action.
- Produces: block keys `special-hero`, `collaboration-statement`, `limited-edition`, `edition-gallery`, `photographer-profile`, and `footer-cta`.

- [ ] **Step 1: Update the expected public section order**

```ts
["special-edition", [
  "Collaboration Hero",
  "Light, Gaze, Memory",
  "Limited Edition",
  "Edition Gallery",
  "Photographer Profile",
  "Footer CTA"
]]
```

Add assertions that the rendered editor includes `statementEn`, `feature1Title`, `image5Url`, `quoteKo`, and `archiveHref` field names.

- [ ] **Step 2: Run the editor test and verify the old section list fails**

Run: `npm test -- tests/unit/landing-editor.test.tsx`

Expected: FAIL with the old `Project Hero`, `Editorial Copy`, and `Project Gallery` titles.

- [ ] **Step 3: Replace Special definitions with six matching section definitions**

Use these exact block contracts:

```ts
[
  { key: "special-hero", fields: ["eyebrow", "heading", "subtitle", "body", "primaryLabel", "primaryHref", "secondaryLabel", "secondaryHref"], media: true },
  { key: "collaboration-statement", fields: ["statementEn", "bodyKo", "theme1", "theme2", "theme3", "image2Url"], media: true },
  { key: "limited-edition", fields: ["eyebrow", "heading", "body", "feature1Title", "feature1Body", "feature2Title", "feature2Body", "feature3Title", "feature3Body"], media: true },
  { key: "edition-gallery", fields: ["image2Url", "image3Url", "image4Url", "image5Url"], media: true },
  { key: "photographer-profile", fields: ["eyebrow", "name", "role", "quoteKo", "quoteEn", "body", "credential1", "credential2", "credential3", "archiveLabel", "archiveHref"], media: true },
  { key: "footer-cta", fields: ["primaryLabel", "primaryHref", "secondaryLabel", "secondaryHref"] }
]
```

Use Korean notes that identify each field's public placement and recommended media role. Remove the obsolete `editorial-copy`, `project-gallery`, and `youngbin-archive` definitions from this page key.

- [ ] **Step 4: Run the editor test**

Run: `npm test -- tests/unit/landing-editor.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit the admin mapping**

```bash
git add src/components/admin/LandingEditor.tsx tests/unit/landing-editor.test.tsx
git commit -m "feat: align special editor with project story"
```

---

### Task 3: Semantic Public Project Page

**Files:**
- Modify: `src/app/projects/youngbin-edition/page.tsx`
- Create: `tests/unit/youngbin-edition-page.test.ts`

**Interfaces:**
- Consumes: `getLandingPageContent`, `landingText`, `landingMediaUrl`, and the Task 1 fallback model.
- Produces: an explicit six-section server-rendered page and permanent archive CTA.

- [ ] **Step 1: Write the route contract test**

```ts
it("maps all six CMS blocks and keeps the photo archive separate", () => {
  const source = readFileSync("src/app/projects/youngbin-edition/page.tsx", "utf8");

  for (const key of [
    "special-hero",
    "collaboration-statement",
    "limited-edition",
    "edition-gallery",
    "photographer-profile",
    "footer-cta"
  ]) expect(source).toContain(`content[\"${key}\"]`);

  expect(source).toContain("/archive/youngbin-edition");
  expect(source).not.toContain("edition.editorial.map");
});
```

- [ ] **Step 2: Run the route contract test and verify failure**

Run: `npm test -- tests/unit/youngbin-edition-page.test.ts`

Expected: FAIL because only four generic block keys are read.

- [ ] **Step 3: Rewrite the route into six explicit sections**

Read all six block keys once. For each text value use `landingText(block, field, fallback)` and for each primary image use `landingMediaUrl(block, fallback)`. Build the optional gallery array and filter empty URLs before rendering. Render sections in this exact order:

```tsx
<main className="youngbin-project-page">
  <section className="youngbin-project-hero" />
  <section className="youngbin-project-statement" />
  <section className="youngbin-project-limited" />
  <section className="youngbin-project-gallery" />
  <section className="youngbin-project-profile" />
  <section className="youngbin-project-footer-cta" />
</main>
```

The hero includes Buyer Inquiry and View Photo Archive. The profile repeats only View Photo Archive. The footer includes Buyer Inquiry and All Projects. Do not render the full archive gallery or technical image labels.

- [ ] **Step 4: Run the route contract test**

Run: `npm test -- tests/unit/youngbin-edition-page.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the semantic route**

```bash
git add src/app/projects/youngbin-edition/page.tsx tests/unit/youngbin-edition-page.test.ts
git commit -m "feat: rebuild youngbin edition project story"
```

---

### Task 4: Editorial Responsive Styling

**Files:**
- Modify: `src/app/public-final.css`
- Modify: `tests/unit/public-home-styles.test.ts`

**Interfaces:**
- Consumes: the `youngbin-project-*` classes from Task 3.
- Produces: stable desktop, tablet, and mobile layouts without changing other public pages.

- [ ] **Step 1: Add CSS contract assertions**

```ts
expect(css).toContain(".youngbin-project-hero");
expect(css).toContain(".youngbin-project-statement");
expect(css).toContain(".youngbin-project-gallery");
expect(css).toContain(".youngbin-project-profile");
expect(css).toContain("aspect-ratio");
```

- [ ] **Step 2: Run the style test and verify failure**

Run: `npm test -- tests/unit/public-home-styles.test.ts`

Expected: FAIL because the new classes do not exist.

- [ ] **Step 3: Add scoped editorial styles**

Implement a full-width hero with text over the collaboration image; a dark statement band with paired working images; a cream limited-edition two-column band; a restrained asymmetric gallery using explicit aspect ratios; a dark profile split; and a compact final CTA band. Use existing OOGO colors (`#16130f`, `#f1eee6`, `#f8f7f3`) and no decorative cards or image labels.

- [ ] **Step 4: Add tablet and mobile rules**

At existing tablet and mobile breakpoints, collapse all asymmetric grids to one column, keep media before supporting copy where required by the narrative, make action groups wrap without overlap, and set each media block to a stable `aspect-ratio`.

- [ ] **Step 5: Run the style test**

Run: `npm test -- tests/unit/public-home-styles.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit the responsive presentation**

```bash
git add src/app/public-final.css tests/unit/public-home-styles.test.ts
git commit -m "style: refine youngbin edition project page"
```

---

### Task 5: End-To-End Verification

**Files:**
- Verify: `src/app/projects/youngbin-edition/page.tsx`
- Verify: `src/components/admin/LandingEditor.tsx`
- Verify: `src/app/public-final.css`

**Interfaces:**
- Consumes: all prior tasks.
- Produces: verified public and admin workflows at desktop and mobile widths.

- [ ] **Step 1: Run focused unit tests**

Run:

```bash
npm test -- tests/unit/special-editions.test.ts tests/unit/landing-editor.test.tsx tests/unit/youngbin-edition-page.test.ts tests/unit/public-home-styles.test.ts
```

Expected: all focused tests PASS.

- [ ] **Step 2: Run the full test suite**

Run: `npm test`

Expected: all tests PASS with no unhandled errors.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: Next.js production build completes successfully with no type errors.

- [ ] **Step 4: Verify the public page visually**

Open `http://127.0.0.1:3100/projects/youngbin-edition` at `1440x1100` and `390x844`. Confirm the hero image is visible, the next section is hinted below the first viewport, all six sections follow the approved order, media is nonblank, text does not overlap, and both archive CTAs open `/archive/youngbin-edition`.

- [ ] **Step 5: Verify the admin mapping visually**

Open `http://127.0.0.1:3100/admin/landing`, select Special, and confirm the six cards match the public order. Save one draft text change, reload, and verify the public page uses the new value after publish while unchanged fields continue to use fallbacks.

- [ ] **Step 6: Review the final diff without touching unrelated changes**

Run: `git diff -- src/lib/special-editions.ts src/components/admin/LandingEditor.tsx src/app/projects/youngbin-edition/page.tsx src/app/public-final.css tests/unit/special-editions.test.ts tests/unit/landing-editor.test.tsx tests/unit/youngbin-edition-page.test.ts tests/unit/public-home-styles.test.ts public/images/projects/youngbin-edition`

Expected: only the approved Youngbin Edition project-page implementation is present.
