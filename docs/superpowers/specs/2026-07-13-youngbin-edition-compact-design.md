# Youngbin Edition Compact Page Design

## Goal

Shorten the Youngbin Edition project page by roughly 35% while preserving its premium editorial character and making the journey from project story to photo archive and buyer inquiry clearer.

## Public Page Structure

### 1. Collaboration Hero

- Use a shorter, approximately 70svh hero.
- Keep one primary `Buyer inquiry` button.
- Present `View Photo Archive` as a secondary text link.
- Limit the introduction to two concise lines.

### 2. Story & Limited Edition

- Combine the previous collaboration statement and limited-edition sections into one chapter.
- Use one package or edition image instead of repeating photographer imagery.
- Show a concise statement, three creative themes, and three edition features.
- Preserve the existing content keys internally for backward compatibility.

### 3. Edition Gallery

- Display four images in a compact 2x2 editorial grid.
- Prefer distinct roles: product detail, package, wearing or campaign, and photographer-at-work.
- Avoid repeating the hero image.
- Link the section to the complete Youngbin photo archive.

### 4. Photographer Profile

- Use a compact horizontal profile section of approximately 520px on desktop.
- Keep the profile to a short biography, one quote, and concise credentials.
- Make `View Photo Archive` the primary final CTA.
- Integrate `Buyer inquiry` and `All projects` as secondary links.
- Remove the separate footer CTA section.

## Dashboard Editing

- Present four editor groups matching the public page: Hero, Story & Edition, Gallery, Photographer.
- Keep the current six database block keys so already-published content remains valid.
- Group `collaboration-statement` with `limited-edition` in the Dashboard UI.
- Group `footer-cta` controls into the Photographer section for the final links.

## Responsive Behavior

- Desktop uses two-column story and profile compositions.
- Tablet and mobile stack content in narrative order.
- Mobile CTAs remain full-width only for the primary action.
- No horizontal overflow is allowed.

## Verification

- Unit tests verify four public chapters and four Dashboard editor groups.
- Existing content fallback tests remain valid.
- Run the full Vitest suite and Next.js production build.
- Verify desktop and mobile layouts in the browser, including archive links and console errors.
