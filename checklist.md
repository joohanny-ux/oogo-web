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

# Home Hero media slider

- [x] Add an admin Hero slide editor with up to five media items
- [x] Support image/video URLs and uploads per slide
- [x] Preserve shared KO media behavior for EN/CN
- [x] Render video slides in the existing public Hero carousel
- [x] Keep legacy single Hero media as a fallback
- [x] Add unit and editor contract tests
- [x] Run full tests, build, and public E2E checks

# Dashboard editor UX

- [x] Add editable Footer social links with add/remove controls
- [x] Replace Landing page cards with a compact page dropdown
- [x] Keep all sections collapsed and allow only one open section
- [x] Add reliable section and page-level save/publish actions
- [x] Improve Dashboard hierarchy, density, metrics, and shortcuts
- [x] Add a working admin log-out action
- [x] Add regression tests and run tests and production build

# Home Archive media

- [x] Add four editable Archive image slots in the Home editor
- [x] Support URL selection and direct image upload for every slot
- [x] Render saved images without changing the public Archive layout
- [x] Share KO Archive media with EN/CN Home pages
- [x] Add regression tests and run tests and production build

# Editable fixed media

- [x] Add upload controls for Brand Hero and Statement backgrounds
- [x] Match five Design Philosophy and six Brand Experience image slots
- [x] Add upload controls for all four Youngbin Edition gallery images
- [x] Make the Footer logo editable
- [x] Align the Brand Closing CTA links
- [x] Add an editable default wearing image to the Product Detail template
- [x] Verify all Landing Editor public surfaces have editable media or a dedicated media manager
- [x] Run the complete test suite and production build

# Brand Essence cards

- [x] Render all six localized Essence descriptions
- [x] Match the dark image-backed card layout from the reference
- [x] Add editable Essence body fields and background media
- [x] Run regression tests and production build

# Landing Editor public text defaults

- [x] Map every public fallback field for Header, Home, Brand, Collection, Projects, Product Detail, Special Edition, Archive, Inquiry, and Footer
- [x] Provide KO, EN, and ZH initial editor values without writing to the database
- [x] Preserve non-empty draft values and replace blank text with public fallback copy
- [x] Add contract tests for all pages, blocks, locales, and editable text fields
- [x] Run the complete test suite and production build

# Landing save and publish workflow

- [x] Keep per-section draft save and save-and-publish actions
- [x] Keep page-level save-and-publish-all without redirecting mid-batch
- [x] Show success status after save/publish
- [x] Prefill public media defaults so first publish keeps current visuals
- [x] Revalidate KO/EN/ZH public routes after publish
- [ ] User QA: save and publish Header → Home → Brand in KO, then EN/ZH text
- [ ] Confirm public pages reflect published drafts
