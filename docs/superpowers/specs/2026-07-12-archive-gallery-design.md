# Archive Gallery Expansion Design

## Goal

Replace the fixed 12-image Archive landing block with an expandable Archive collection that displays published images newest first and gives administrators a compact multi-upload workflow.

## Data Model

Create `public.archive_items` with:

- `id uuid primary key`
- `asset_id uuid null references public.assets(id)`
- `image_url text not null`
- `alt_text text not null default 'OOGO archive image'`
- `published boolean not null default false`
- `created_at timestamptz not null default now()`
- `published_at timestamptz null`

The public read policy exposes only published rows. Admins and editors can create, update, publish, and delete rows. Newest order is `published_at desc, created_at desc` for public content and `created_at desc` for admin content.

`image_url` remains present even when `asset_id` is null so the existing static and landing-block URLs can migrate without creating fake storage records. New uploads link to their `assets` row.

## Legacy Compatibility

The migration imports the current Archive gallery URLs from the Korean `landing_blocks` row into `archive_items`, preserving all existing images. The public page falls back to the current 12-item block/static data only when `archive_items` is unavailable or empty, preventing a blank Archive during deployment.

The fixed `landing_blocks.archive.gallery` editor is retired after migration. Archive intro copy remains managed in Landing Page > Archive.

## Public Archive

- Use a centered gallery container with a maximum width around 1320px.
- Use five columns on wide desktop, three on tablet, and two on mobile.
- Add 24-30px gaps and generous outer padding.
- Keep a consistent 4:5 visual tile ratio with cover cropping.
- Remove visible image names from tiles and the lightbox toolbar.
- Preserve keyboard-accessible lightbox navigation, close behavior, and focus restoration.
- Use hidden alt text for accessibility.
- Display published images newest first, left to right and top to bottom.

## Admin Archive

- Place `Add images`, `Save draft`, `Publish`, and `View public` in the page header/tool area.
- Support selecting multiple JPG, PNG, or WebP images in one action, maximum 8MB per image.
- Use a compact four-column grid, expanding to five columns on wide displays and collapsing responsively.
- Remove fixed editorial names such as `Campaign light` and `Wearing cut`.
- Show only sequence, published/draft status, preview, replace, and delete controls.
- Saving creates draft items. Publishing saves selected files and publishes all current drafts in one action.
- New uploads appear first automatically; manual reordering is intentionally omitted.
- Deleting an item removes its Archive relationship. Storage assets remain managed through Files.

## Error Handling

- Reject unsupported files and files over 8MB before database insertion.
- If any upload fails, report the failure and do not publish the batch.
- Public reads fall back to legacy content on transient Supabase errors.
- Empty Archive state renders a quiet empty state in admin and legacy fallback in public.

## Verification

- Unit-test newest-first mapping, legacy fallback, and public filtering.
- Component-test multi-file input, removed labels, and top action controls.
- Verify migration SQL includes RLS policies and legacy import.
- Run the complete Vitest suite and production build.
- Verify `/archive` and `/admin/archive` return HTTP 200 from the local server.
