# Context notes — public locale work

## Decision
- Use URL prefixes `/en` and `/zh` for English/Chinese.
- Keep Korean at unprefixed routes (`/`, `/brand`, …) to avoid breaking existing URLs.
- Middleware rewrites prefixed paths to the same page files and sets `x-oogo-locale` + cookie.
- Admin routes stay outside locale prefixes.

## Why not full `[locale]` folder move
- Existing public/admin route tree is already large; rewrite keeps the change surgical for 1차 follow-up.

## Home media sharing (2026-07-15)
- EN/CN Home CMS still had old hero/project media while KO had the latest uploads.
- Home page now keeps locale copy but applies KO `home` media (`hero`, `special-preview`, etc.) via `applyHomeMediaFromSource`.
- Archive preview on Home already used shared local assets.

## Landing editor matching (2026-07-16)
- Public page markup, section order, copy fallbacks, and locale behavior are the source of truth.
- Do not change public pages while matching the dashboard Landing Page editor.
- Keep the existing `page_key`, `block_key`, and KO/EN/ZH rows compatible so saved content is not orphaned.
- Update only the admin editor contract, persistence whitelist, tests, and supporting documentation needed to make every public-consumed field editable.
- Removed editor controls that the current public pages do not consume, including fixed Brand/Home Archive media and unused Youngbin copy.
- Added the missing `youngbin-archive` editor block and the fourth visible Youngbin gallery URL (`image5Url`).
- EN/CN Home media controls now point editors to KO because public Home intentionally shares KO media.
- Draft saves now update submitted fields only and merge them into existing JSON, preserving hero slide arrays and other existing content.
- Public preview links now open the selected locale route.
- Publishing landing content also revalidates `/archive/youngbin-edition`, so its new intro block updates immediately.

## Home Hero media slider (2026-07-16)
- Keep the current public Hero layout and carousel interaction.
- Let KO Home manage up to five ordered Hero media items; EN/CN continue sharing the KO media sequence.
- Each slide supports an image or muted looping video, an optional video poster, and alt text.
- Global Hero eyebrow, heading, and line remain locale-specific and apply to every slide.
- Preserve legacy single `mediaUrl` content as the first editable slide when no `slides` array exists.

## Dashboard editor UX (2026-07-18)
- Keep block-level draft storage because `landing_blocks` are independently versioned and published.
- Show both `초안 저장` and `저장 후 게시` inside every section, including newly created blocks.
- The top page action must submit the current unsaved form values for every section before publishing; it must not publish stale drafts.
- Replace the wide page-card navigation with a native page selector and retain locale-specific URLs.
- Start every section collapsed and use one named details group per page so only one section can be open.
- Store Footer social links as an ordered `socialLinks` array while accepting the existing fixed URL fields as a migration fallback.
- Keep DB/Vercel/Supabase production verification as the next phase after this UI work.

## Home Archive media (2026-07-18)
- Preserve the existing four-card public Archive layout and its local images as fallback values.
- Let KO Home edit each Archive image using a Files URL or direct JPG/PNG/WebP upload.
- Store the ordered slots as `image1Url` through `image4Url` in the existing `home.archive-preview` block.
- EN/CN Home keeps localized Archive copy but shares the four KO Archive images.

## Editable fixed media (2026-07-18)
- Keep every public layout unchanged while replacing hardcoded visual sources with CMS values and local fallbacks.
- Brand uses one Hero image, one Statement background, five Design Philosophy images, and six Brand Experience images.
- Use the reusable horizontal gallery editor for fixed ordered image groups up to six slots.
- Youngbin Edition exposes the four gallery images rendered from fields `image2Url` through `image5Url`.
- Header and Footer logos are independently editable through their existing landing blocks.
- Product images remain in Products, while Archive gallery images remain in the dedicated Archive manager rather than duplicating those controls in Landing Editor.
- Product Detail Template controls the default wearing image used only when a product has no assigned wearing asset.
- Keep both Brand Closing CTA links in one centered, wrapping action row.

## Brand Essence cards (2026-07-18)
- Restore the six localized Essence descriptions that were resolved in code but not rendered.
- Present the values as a three-by-two dark card grid over an editable campaign background.
- Use `item1Body` through `item6Body` for CMS overrides and keep `publicCopy.brand.essenceBodies` as locale fallbacks.

## Landing Editor public text defaults (2026-07-18)
- Initial editor values must mirror the current public fallback copy for KO, EN, and ZH.
- Showing defaults must not create or update any Supabase row; persistence still requires an explicit save action.
- Preserve non-empty `draft_content`, but replace empty text values with the same fallback shown on the public page.
- Keep the fallback map independent from media defaults and include only fields rendered by each editor block.
