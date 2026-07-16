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
