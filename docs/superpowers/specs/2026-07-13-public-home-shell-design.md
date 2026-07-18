# Public Home Shell Design

## Scope

Improve the public Header, Footer, and Home page as one focused batch. Image subject matter is out of scope; existing images remain as temporary content.

## Header

- Preserve the OOGO logo, five primary links, and locale control.
- Keep the Header transparent over the Home hero and readable over light public pages.
- Use one consistent spacing and typography rule across all public routes.
- Prepare responsive behavior without performing the full mobile optimization pass yet.

## Home Hero

- Replace the single-image implementation with a full-bleed horizontal slider.
- Support one to five slides and preserve the current image as the first fallback slide.
- Move slides to the left, support pointer drag and touch swipe, and expose clickable progress indicators.
- Do not show arrow buttons.
- Pause automatic movement while the user hovers, focuses, drags, or prefers reduced motion.
- Accept the autoplay interval as input and use 6 seconds only as the public fallback.
- Dashboard controls for slide media, ordering, autoplay, and interval are deferred to the Dashboard phase.

## Home Sections

- Keep the current order: Hero, Collection, Project, Archive.
- Normalize section headings, route links, horizontal margins, and vertical rhythm.
- Preserve existing content and images while improving hierarchy and consistency.

## Footer

- Keep the three-column brand, navigation, and contact structure.
- Improve text readability and spacing without increasing overall footer height excessively.
- Preserve social and legal links.

## Data Boundary

- The public component accepts a slide array and timing value independent of the current database shape.
- Existing single-image landing content is converted to a one-item slide array at the page boundary.
- The later Dashboard phase will write up to five ordered slides and the timing setting through the same interface.

## Verification

- Add focused tests for slide normalization and Hero rendering behavior.
- Verify Header, Footer, and Home together on desktop once at the end of this batch.
- Defer full mobile QA, full test suite, and production build to their planned batch checkpoints unless a focused check exposes a blocker.
