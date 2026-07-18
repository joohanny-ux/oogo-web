# Context Notes — locale copy alignment

## Decision
- Align KO/ZH public copy with EN meaning, not leave English as KO default.
- `resolveLocaleText`: if saved text equals `copy.en` on KO/ZH, use localized copy (fixes EN leftovers in CMS).
- Custom English that differs from default (e.g. KO hero `Light & Shadow Gallery.`) is kept until Admin republishes.

## Admin paste (Production KO Home hero)
If KO still shows `Light & Shadow Gallery.`, set Home → Hero → line to:
`빛과 얼굴, 조용한 태도를 위한 프레임.`
Then save draft and publish. Collection preview primaryLabel: `전체 보기`.
