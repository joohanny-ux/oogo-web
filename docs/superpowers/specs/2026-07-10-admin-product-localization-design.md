# OOGO Admin Product Localization And UI Design

Date: 2026-07-10

## Goal

Make product editing feel compact, intuitive, and premium while ensuring that every product-detail text field can be managed in Korean, English, and Chinese.

The dashboard keeps English for navigation, page titles, field names, and commands. Korean is used for helper text, workflow explanations, validation feedback, and status descriptions.

## Chosen Approach

Use an additive, migration-safe translation model.

Alternatives considered:

1. Add localized specification fields while retaining the current shared fields as fallbacks. This preserves existing products and is the selected approach.
2. Move all specification fields out of `products` immediately. This is cleaner but creates avoidable migration and rollback risk.
3. Store localized specifications in a JSON document. This is flexible but weakens validation, querying, and editor clarity.

## Product Data Model

Keep these shared fields in `products`:

- `model_code`
- `slug`
- `size`
- publish and featured state
- sort order

Add these locale-specific fields to `product_translations`:

- `size_note`
- `frame_material`
- `lens_material`
- `lens_features` as a text array

Existing localized fields remain:

- `name`
- `colorway`
- `description`

The current shared `products.frame_material`, `products.lens_material`, and `products.lens_features` columns remain temporarily as compatibility fallbacks. The migration backfills each translation row from those shared values when a localized value is missing.

Public product queries prefer the active locale's translated specification and fall back to the existing shared value. The shared `size` value is always displayed, followed by the localized `size_note` when present.

## Product Editor

The Add/Edit Product page uses three clear zones.

### Shared Product

One compact section contains fields that do not change by language:

- Model code
- Slug
- Size
- Featured
- Public on site

Field names remain English. Each helper line explains the public-page result in Korean.

### Localized Content

A segmented `KR / EN / CN` control shows one language at a time. Each language panel contains:

- Name
- Colorway
- Description
- Size note
- Frame material
- Lens material
- Lens features

This replaces the current three simultaneous fieldsets, substantially reducing page height and making omissions easier to notice. KR name remains required. Missing optional translations are visibly marked in the locale control without blocking draft work.

### Detail Gallery

The right-side gallery remains visible on wide screens and moves below content on narrow screens. Each image role keeps its public display order and Korean guidance. Upload controls and previews become denser without reducing preview clarity.

## Actions And Status

Replace the full-width `Save product` CTA with a compact action bar at the bottom of the editor.

- Primary command: `Save changes` or `Create product`
- Secondary command: `Cancel`
- Publish and featured controls stay close to the action area
- The primary button has a stable compact width instead of spanning the page
- Saving, validation, and Supabase errors use concise Korean feedback

Landing Page actions follow the same size and hierarchy: `초안 저장` is secondary and `게시하기` is primary, both compact and aligned to the right.

## Dashboard Language And Visual System

Apply the following conventions across Dashboard, Products, Landing Page, Files, Inquiries, Company & Brand, and Users & Roles:

- English: navigation, page titles, section titles, field names, button commands
- Korean: page descriptions, helper copy, empty states, warnings, validation, and workflow guidance
- Status chips: concise Korean states such as `게시됨`, `초안`, and `설정 필요`
- Buttons: compact command-sized controls with consistent height
- Cards: restrained borders, 6-8px radius, tighter internal spacing, and no nested decorative cards
- Headings: smaller operational scale with clearer section hierarchy
- Form fields: labels separated from Korean helper text and consistent vertical rhythm

This is a consistency pass, not a dashboard navigation redesign. Existing routes and information architecture remain unchanged.

## Dashboard Home

The dashboard home is an operational summary, not a setup guide or a second landing-page editor.

- Remove the one-time `Setup Status` panel.
- Remove the duplicated `Landing Pages` route-card grid.
- Remove the `Landing drafts` summary card until draft counts are reliable and actionable.
- Show live counts for Products, Public on site, and Open inquiries.
- Keep compact shortcuts for Add product, Landing Page, and Files.
- Use Korean helper text beneath the English page title and metric labels.

Setup instructions remain in project documentation. Landing-page route selection remains inside `/admin/landing`.

## Data Flow

1. The admin loads the shared product record and all three translation rows.
2. The form displays shared fields once and locale-specific fields through tabs.
3. Save parses each locale into a structured translation payload.
4. Supabase upserts the shared product row, translation rows, assets, and image relations.
5. Public loaders select the active locale and resolve localized specification fallbacks.
6. Published products revalidate the collection and product-detail routes.

## Error Handling

- Prevent save when Model code, Slug, or KR Name is missing.
- Preserve user-entered values when a save fails where the current server-action architecture allows it.
- Return Korean messages for duplicate slug, unsupported images, oversized uploads, missing Supabase configuration, and database failures.
- Do not publish incomplete required Korean content.
- Optional EN/CN omissions show a visible locale warning but do not block saving.

## Migration And Rollback

- Add the new translation columns in a forward-only migration.
- Backfill translation rows from existing shared specification fields.
- Keep existing shared specification columns during this phase.
- Do not reset or delete existing product, translation, asset, or image data.
- Apply and verify the migration against the connected Supabase project before testing editor writes.

## Testing

Automated coverage includes:

- migration contains localized specification columns and safe backfill logic
- product form exposes one locale panel at a time
- shared Size remains outside locale-specific panels
- each locale saves Size note, Frame material, Lens material, and Lens features
- public product mapping prefers translated specifications and falls back to shared values
- compact action labels and Supabase-disabled state render correctly
- existing product creation, image roles, publish state, and collection behavior remain intact

Browser verification covers:

- Add Product and Edit Product at desktop and mobile widths
- KR/EN/CN tab switching without layout shift or lost values
- compact Save and Landing Page action layouts
- saving a reversible test edit in admin and confirming it on the public product page
- dashboard pages use the agreed English/Korean copy hierarchy consistently

## Out Of Scope

- Automatic machine translation
- Per-language images
- Product version history
- New dashboard navigation routes
- Removing legacy shared specification columns
