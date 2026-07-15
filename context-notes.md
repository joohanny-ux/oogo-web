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
