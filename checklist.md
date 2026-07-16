# EN/CN public locale checklist

- [x] Add locale path helpers and request locale reader
- [x] Middleware: rewrite `/en/*` and `/zh/*`, leave `ko` at `/`
- [x] Fix rewrite re-entry overwriting locale back to `ko`
- [x] Public pages/header/footer use request locale
- [x] Locale switcher links between KR/EN/CN
- [x] Root `html lang` follows locale
- [x] EN/CN copy dictionaries + Hangul scrub on CMS values
- [x] Product names resolve EN/CN via DB or seed fallback
- [x] Youngbin / legal / a11y strings locale-aware
- [x] Tests + build pass

# Dashboard landing editor / public page matching

- [x] Inventory each public page section order, block key, and consumed field
- [x] Match LandingEditor page tabs, section order, labels, and fields to the public pages
- [x] Preserve KO/EN/ZH locale tabs and existing landing block data
- [x] Ensure every editor field is persisted by the landing save action
- [x] Add regression tests for the public/editor content contract
- [x] Run focused tests, full tests, and production build
