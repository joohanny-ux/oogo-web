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
