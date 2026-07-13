# Youngbin Edition Project Page Design

## Goal

Rebuild the Youngbin Edition project page around the collaboration and limited-edition product story. Keep the photographer profile concise and route the complete photography portfolio to the dedicated Youngbin Edition archive.

## Public Page Structure

### 1. Collaboration Hero

- Present `OOGO x JIYOUNGBIN` as the first-viewport signal.
- Use a wide collaboration product image as the primary visual.
- Show the Special Collaboration title, concise Korean introduction, year, and collaborator.
- Provide `Buyer Inquiry` and `View Photo Archive` actions.

### 2. Light, Gaze, Memory

- Introduce the shared idea that photography and eyewear both begin with light.
- Display the short English statement and Korean supporting copy.
- Pair the statement with two photographer-at-work images.
- Use `Light`, `Gaze`, and `Memory` as restrained thematic markers.

### 3. Limited Edition

- Explain the edition as a limited frame, special package, and campaign/exhibition story.
- Present three compact attributes: `Limited Quantity`, `Special Package`, and `Campaign & Exhibition`.
- Use the edition product and package image as the section's primary visual.

### 4. Edition Gallery

- Replace the current empty text blocks and generic image tiles with an editorial two-column gallery.
- Support product front, angle, package, campaign, and detail imagery.
- Respect each image's natural visual role instead of forcing every asset into the same crop.
- Do not show technical image labels inside the public gallery.

### 5. Photographer Profile

- Show one portrait or working photograph of Ji Youngbin.
- Include the quote `Every moment can become art` and a short introduction.
- Limit credentials to three concise highlights.
- Do not reproduce the complete portfolio on the project page.
- End with `View Photo Archive`, linked to `/archive/youngbin-edition`.

### 6. Footer CTA

- Provide `Buyer Inquiry` and `All Projects` once at the end of the narrative.
- Avoid repeating promotional actions between every section.

## Admin Editing Structure

Update `Landing Page > Special` to match the public reading order:

1. Collaboration Hero
2. Collaboration Statement
3. Limited Edition
4. Edition Gallery
5. Photographer Profile
6. Footer CTA

Each section must expose only the fields rendered by its public counterpart. Korean helper text should explain placement and recommended media role. Existing draft and publish behavior remains unchanged.

## Content And Assets

- Use the supplied `00 OOGO_SpecialEdition_2026_v1.0.pdf` as the approved editorial reference.
- Extract suitable product, package, and photographer visuals from the source PDF only when image quality is sufficient for the intended display size.
- Preserve existing site header, footer, inquiry route, archive route, and OOGO visual system.
- Keep the full Ji Youngbin portfolio exclusively in the Youngbin Edition archive.

## Responsive Behavior

- Desktop uses wide editorial bands and balanced two-column compositions.
- Tablet collapses asymmetric sections without changing narrative order.
- Mobile uses a single-column flow, full-width media, readable copy, and non-overlapping actions.
- Hero and gallery media must have stable aspect ratios to avoid layout shift.

## Error And Fallback Behavior

- Missing CMS text falls back to the edition seed content.
- Missing CMS media falls back to packaged project assets.
- Missing optional gallery images are omitted without leaving blank tiles.
- Archive CTA remains available whenever the Youngbin archive route exists.

## Verification

- Unit tests cover the six-section mapping and fallback behavior.
- Landing editor tests cover the new Special section field definitions.
- Production build and type checks must pass.
- Desktop and mobile screenshots must confirm that media crops, text, and CTAs do not overlap.
