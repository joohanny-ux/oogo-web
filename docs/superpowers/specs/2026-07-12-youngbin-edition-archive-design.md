# Youngbin Edition Archive Design

## Goal

Separate OOGO's brand archive from photographer Youngbin Ji's collaboration and personal photographic works. The two collections must remain visually and operationally distinct while linking the Youngbin project story to its complete photo archive.

## Public Information Architecture

### OOGO Archive

- Keep `/archive` as the main brand archive.
- Show only images assigned to the `oogo` collection.
- Preserve the current newest-published-first ordering and image lightbox.
- Keep the global header `Archive` link pointed at `/archive`.
- Do not provide an `All` view that mixes OOGO and Youngbin images.

### Youngbin Edition Archive

- Add `/archive/youngbin-edition` as an independent gallery.
- Include both OOGO collaboration photography and Youngbin Ji's personal photographic works.
- Use a concise project header with localized title, introduction, artist credit, and a `View Project` link.
- Use the same responsive gallery and original-image lightbox behavior as the OOGO Archive.
- Display published images by newest publication date.

### Project Connection

- Add a `View Photo Archive` CTA to `/projects/youngbin-edition`.
- Link the Youngbin Archive back to `/projects/youngbin-edition`.
- Keep responsibilities separate: the project page explains the collaboration, while the archive page focuses on viewing the work.

## Data Model

Extend `archive_items` with a required collection key:

- `collection_key text not null default 'oogo'`
- Allowed values: `oogo`, `youngbin-edition`
- Add an index covering `collection_key`, `published`, and publication/creation dates.
- Existing records remain in the `oogo` collection after migration.
- Public and admin queries must always request a specific collection. No mixed collection query is used in the UI.

The current fields for asset, URL, alt text, publication state, and timestamps remain unchanged. This keeps files reusable without duplicating Storage objects.

## Admin Experience

Keep one `Archive` sidebar destination at `/admin/archive`. Inside the page, add a clear two-option segmented control:

- `OOGO Archive`
- `Youngbin Edition`

Each selection has an independent count, upload control, draft action, publish action, and image list. Uploads inherit the currently selected collection automatically; the user does not choose a collection again inside each image card.

Use query-string state (`?collection=oogo` or `?collection=youngbin-edition`) so the selected collection is linkable and survives reloads. Default to `oogo` for missing or invalid values.

Publishing affects only the selected collection's drafts. Replacing or deleting an image is scoped by item ID and preserves its collection assignment. Cards remain compact and omit arbitrary visible image names.

## Content Management

The Youngbin Archive introduction should be editable through the existing Landing Page system under the Special/Project Detail content group. Add localized fields for:

- Eyebrow
- Heading
- Artist credit
- Introductory body
- Project CTA label

The gallery itself remains in the dedicated Archive manager, not the Landing Page editor.

## Error Handling

- Invalid collection query values fall back to `oogo`.
- Upload, publish, replace, and delete actions reject unknown collection keys.
- A failed multi-file upload reports the failure without moving successful existing items to another collection.
- Public pages use the current fallback gallery only for the OOGO archive. The Youngbin archive shows a restrained empty state when no Youngbin images are published.
- Database migration absence continues to produce the existing admin setup notice rather than a runtime error.

## Accessibility And Responsive Behavior

- Preserve keyboard-accessible gallery buttons, focus trapping, Escape dismissal, and meaningful image alt text.
- Use five columns on wide desktop, three on tablet, and two on mobile for both archives.
- Keep visible project and archive links descriptive in Korean, English, and Chinese content variants.

## Testing

- Migration/schema tests for `collection_key`, allowed values, and indexes.
- Unit tests for collection parsing and collection-scoped newest-first sorting.
- Action tests confirming uploads and publishing affect only the selected collection.
- Admin tests for segmented navigation, counts, and collection-specific cards.
- Public tests confirming `/archive` excludes Youngbin items and `/archive/youngbin-edition` excludes OOGO items.
- Project-page test for the `View Photo Archive` link and archive-page test for the return link.
- Full lint/type/build and responsive browser verification after implementation.

## Scope Boundaries

- No mixed `All` gallery.
- No nested project or artist CMS in this iteration.
- No manual drag ordering; newest published items remain first.
- No separate Storage bucket is needed. Collection ownership is stored in the database.
