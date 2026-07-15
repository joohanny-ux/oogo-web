# Context notes — public locale work

## Decision
- Use URL prefixes `/en` and `/zh` for English/Chinese.
- Keep Korean at unprefixed routes (`/`, `/brand`, …) to avoid breaking existing URLs.
- Middleware rewrites prefixed paths to the same page files and sets `x-oogo-locale` + cookie.
- Admin routes stay outside locale prefixes.

## Why not full `[locale]` folder move
- Existing public/admin route tree is already large; rewrite keeps the change surgical for 1차 follow-up.
