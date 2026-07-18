# OOGO Homepage Handoff

이 문서는 `oogo-web` GitHub repo에서 Codex와 GitHub 공동작업자가 OOGO Homepage 프로젝트의 현재 방향과 구현 상태를 빠르게 이해하기 위한 인수인계 문서입니다.

## 1. Project Overview

OOGO Homepage는 프리미엄 한국 아이웨어 브랜드 OOGO의 공개 브랜드 사이트와 관리자 대시보드를 함께 제공하는 Next.js App Router 프로젝트입니다.

- Public site: 브랜드 인상, 컬렉션, 제품 상세, 스페셜 에디션, 아카이브, 문의 흐름을 제공한다.
- Admin dashboard: `/admin` 아래에서 제품, 랜딩 콘텐츠, 문의, 회사 정보, 파일 자산을 관리한다.
- Backend: Supabase Auth, Postgres, RLS, Storage를 전제로 한다.
- Deployment target: Vercel, production domain은 `www.oogolaps.com`.
- Local fallback: `NEXT_PUBLIC_SUPABASE_URL` 또는 `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 없으면 공개 제품 데이터는 `src/lib/seed-data.ts`의 fallback content를 사용한다.

현재 repo의 기본 stack은 다음과 같다.

- `Next.js`
- `React`
- `TypeScript`
- `Supabase`
- `Vitest`
- `Playwright`

## 2. Brand Direction

OOGO는 loud luxury보다 조용하고 정제된 프리미엄 브랜드 인상을 목표로 한다. 핵심 감각은 빛, 그림자, 시선, 기억, 프레임, 균형이다.

핵심 메시지:

- `Light & Shadow Gallery`
- `Quiet confidence begins with attitude.`
- `OOGO frames a way of seeing - clear, balanced, and quietly confident.`
- `OOGO는 조용하지만 분명한 존재감과 정제된 시선을 제안하는 한국 아이웨어 브랜드입니다.`

시각 방향:

- 어두운 갤러리 톤, 명확한 빛의 방향, 건축적인 그림자, 절제된 typography를 사용한다.
- 과도한 luxury 장식, 금색 중심의 과시형 표현, stock-like hero 이미지는 피한다.
- 제품은 object 자체보다 얼굴 위에서의 인상, 착용 균형, 렌즈가 만드는 분위기를 중심으로 보여준다.
- 홈페이지는 `A-type brand gallery` 감각을, 컬렉션과 상세는 `B-type catalog showroom` 감각을 섞는다.

Source materials:

- `00 OOGO_BrandBook_2026_v3.0.pdf`
- `00 OOGO_Catalog_2026_v2.0.pdf`
- `00 OOGO_SpecialEdition_2026_v1.0.pdf`
- Brand image folder: `G:\다른 컴퓨터\내 PC\Google Sharing\ZOVA\OOGO\Documents\Brandbook images`
- Catalog image folder: `G:\다른 컴퓨터\내 PC\Google Sharing\ZOVA\OOGO\Documents\Brandbook images\catalog`

Needs confirmation:

- 최종 hero image와 bridge image의 실제 production asset 경로.
- OOGO 법인명, 사업자 정보, privacy/terms 링크.
- 최종 contact channels: email, phone, KakaoTalk, Instagram, Facebook, TikTok 중 실제 공개할 항목.

## 3. Website Structure

공개 사이트는 현재 다음 흐름을 기준으로 구성되어 있다.

- Header: OOGO logo, primary navigation, language selector UI.
- Home: hero, collection preview, special edition preview, archive preview.
- Brand: 브랜드 스토리용 subpage.
- Collection / Products: 제품 카탈로그, category filter, product cards.
- Product Detail: 제품 이미지, model code, localized name, colorway, materials, size, lens features, design note.
- Projects: collaborations, editions, image studies.
- Youngbin Edition: 현재 featured special edition detail.
- Archive: campaign images, social cuts, visual notes.
- Inquiry: public inquiry form.
- Footer: brand/company/contact information.

Admin dashboard는 다음 흐름을 목표로 한다.

- Dashboard summary.
- Product library, create/edit, publish, featured state, image slots.
- Landing page block editor with draft/publish workflow.
- Inquiry list and status changes.
- Company and brand settings.
- Files/assets view.

## 4. Pages and Routes

현재 구현 또는 계획된 public routes:

- `/`: public homepage. `src/app/page.tsx`
- `/brand`: brand story subpage. `src/app/brand/page.tsx`
- `/collection`: canonical collection catalog route. `src/app/collection/page.tsx`
- `/products`: legacy catalog alias that redirects to `/collection`. `src/app/products/page.tsx`
- `/products/[slug]`: product detail route. `src/app/products/[slug]/page.tsx`
- `/projects`: special projects list. `src/app/projects/page.tsx`
- `/projects/youngbin-edition`: Youngbin Edition detail. `src/app/projects/youngbin-edition/page.tsx`
- `/archive`: visual archive route. `src/app/archive/page.tsx`
- `/inquiry`: inquiry page. `src/app/inquiry/page.tsx`

현재 구현 또는 계획된 admin routes:

- `/admin/login`: Supabase Auth login page.
- `/admin`: dashboard shell and summary cards.
- `/admin/products`: product library.
- `/admin/products/new`: product create screen.
- `/admin/products/[id]`: product edit screen.
- `/admin/landing`: landing page block editor.
- `/admin/inquiries`: inquiry management.
- `/admin/files`: file/asset management view.
- `/admin/company`: company and brand settings.

Route decisions:

- `/collection` is the canonical public catalog route.
- `/products/[slug]` remains the canonical product detail route.
- `/products` redirects to `/collection` so old catalog links continue to work.

Needs confirmation:

- Header navigation은 현재 `/collection`, `/projects`, `/archive`, `/inquiry`를 사용한다. `Brand` link를 primary nav에 다시 넣을지 확인 필요.
- Multilingual route 구조가 아직 확정되지 않았다. 예: `?locale=en`, `/en/...`, cookie/session 기반 중 선택 필요.

## 5. Design System

전체 visual language는 dark gallery + quiet catalog showroom이다.

현재 CSS entry:

- `src/app/globals.css`
- `src/app/public-final.css`

공개 사이트 component group:

- `src/components/public/SiteHeader.tsx`
- `src/components/public/HeroSection.tsx`
- `src/components/public/CollectionPreview.tsx`
- `src/components/public/ProductCatalog.tsx`
- `src/components/public/SpecialEditionSection.tsx`
- `src/components/public/ArchiveSection.tsx`
- `src/components/public/InquirySection.tsx`
- `src/components/public/SiteFooter.tsx`

Admin component group:

- `src/components/admin/AdminSidebar.tsx`
- `src/components/admin/AdminTopbar.tsx`
- `src/components/admin/AdminCard.tsx`
- `src/components/admin/ProductForm.tsx`
- `src/components/admin/LandingEditor.tsx`
- `src/components/admin/LoginForm.tsx`

Design rules:

- 프리미엄하지만 조용한 인상을 우선한다.
- 넓은 여백, restrained typography, high-contrast image treatment를 사용한다.
- 제품 영역은 model code, product name, category badges, material specs를 빠르게 scanning할 수 있어야 한다.
- Admin UI는 운영자가 반복적으로 쓰는 도구이므로 과한 hero/marketing layout보다 dense, predictable, work-focused layout을 유지한다.
- Cards는 반복 item, modal, framed tool에만 사용한다.
- Text는 모바일과 데스크톱 모두에서 overflow 또는 overlap이 없어야 한다.

Current assets:

- `public/images/oogo-logo-white.png`
- `public/images/oogo-hero.png`
- `public/images/oogo-gallery.png`
- `public/images/oogo-product-angle.png`
- `public/images/oogo-product-front.png`
- `public/images/oogo-product-side.png`

## 6. Content Rules

Supported locales:

- `ko`
- `en`
- `zh`

Locale helpers:

- `src/lib/i18n.ts`
- `LOCALES = ["ko", "en", "zh"]`
- Unknown locale는 `ko`로 normalize한다.

Content modeling:

- 제품의 shared technical fields는 `products`에 한 번만 저장한다.
- 제품의 localized name, colorway, description은 `product_translations`에 locale별로 저장한다.
- Landing/editor content는 `landing_blocks`에 `draft_content`와 `published_content`로 관리한다.
- Public site는 published products와 published landing blocks만 읽어야 한다.

Product image roles:

- `angle`
- `wearing`
- `front`
- `side`

Initial product examples:

- `OG26001C2`: `황혼의 산책` / `Sunset Stroll` / `夕光漫步`
- `OG26002C1`: `블랙 문` / `Black Moon` / `黑月`
- `OG26003C4`: `실버 미스트` / `Silver Mist` / `银雾`

Additional catalog products referenced in the design spec:

- `OG26001C3`: `안개 속 산책` / `Misty Walk`
- `OG26002C3`: `화이트 클라우드` / `White Cloud`
- `OG26003C3`: `포레스트 딥` / `Forest Deep`
- `OG26012C2`: `앰버 글로우` / `Amber Glow`

Needs confirmation:

- 전체 2026 catalog의 최종 product list와 product copy.
- Chinese locale label을 URL/content에서는 `zh`, UI에서는 `CN`으로 유지할지 확인.
- Special Edition content를 Supabase-managed content로 옮길지, 당분간 `src/lib/special-editions.ts` static content로 유지할지 결정.

## 7. Development Rules

Local setup:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Current `dev` script:

```powershell
npm run dev
```

The app runs at:

```text
http://127.0.0.1:3100
```

Environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://www.oogolaps.com
```

Checks:

```powershell
npm run test
npm run build
npm run test:e2e -- tests/e2e/public.spec.ts
```

Development conventions:

- Use TypeScript and keep `strict` compatibility.
- Use existing data helpers before adding new direct Supabase queries.
- Public data access belongs in `src/lib/public-content.ts`.
- Admin data access and mutations belong in `src/lib/admin-content.ts` or route-specific `actions.ts`.
- Keep public components under `src/components/public`.
- Keep admin components under `src/components/admin`.
- Do not hard-code final marketing copy in components when it should be managed through Supabase landing blocks.
- Keep seed/fallback data in `src/lib/seed-data.ts` aligned with Supabase seed SQL.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to client components.

Important implementation detail:

- `middleware.ts` protects `/admin/:path*` except `/admin/login` using Supabase session.
- If Supabase env vars are missing, public reads have fallback behavior, but admin writes return configuration errors.
- `saveProduct` currently stores product image URLs as `assets` rows with `bucket = "external-url"` rather than uploading files to Supabase Storage.

## 8. Current Decisions

Confirmed or already reflected in code:

- Use Next.js App Router.
- Use Supabase for Auth, Postgres, RLS, and future Storage.
- Use `ko`, `en`, `zh` as supported locales.
- Start public site in Korean by default.
- Admin lives under `/admin`.
- Product technical fields are shared; product display fields are locale-specific.
- Product image roles are `angle`, `wearing`, `front`, `side`.
- Public product queries only return `published = true`.
- Featured products drive homepage collection preview.
- Inquiry types are `general`, `buyer`, `retail`, `collaboration`, `other`.
- Inquiry statuses are `open`, `in_progress`, `closed`.
- Youngbin Edition is the first special edition concept.
- Ecommerce checkout is out of MVP scope.

Needs confirmation:

- Final URL strategy for multilingual public pages.
- Whether `/products` should stay as a permanent redirect or be removed after launch.
- Whether `/brand` should be restored to top navigation.
- Whether landing page copy should be fully Supabase-driven before launch.
- Whether product images must be uploaded through Supabase Storage in MVP or can remain URL-based temporarily.
- Final legal/footer/company content.
- Final production Supabase project and Vercel project names.

## 9. Pending Tasks

High priority:

- Implement real locale switching for KR / EN / CN.
- Wire public pages to locale-aware content instead of hard-coded `"ko"`.
- Complete Supabase migrations and seed data against the production project.
- Verify RLS policies for public reads and admin writes.
- Confirm admin auth role behavior for `admin`, `editor`, and `viewer`.
- Replace placeholder or static visual blocks with final OOGO production assets.
- Confirm inquiry submission UX after server action succeeds or fails.

Admin/content tasks:

- Finish landing block schemas for each editable section.
- Make public sections consume `published_content` from `landing_blocks`.
- Add product create/edit validation and user-facing error states.
- Add proper file upload flow if Supabase Storage is required.
- Populate company settings and localized footer copy.
- Add legal links or legal content pages.
- Show real dashboard summary counts.

Public site tasks:

- Confirm final homepage section order.
- Decide whether homepage needs a dedicated `BrandStorySection` again.
- Finalize product categories and filter logic. Current category logic is derived from `featured` and `sortOrder`.
- Add empty/loading/error states where Supabase content is missing.
- Make special edition hide/show admin-controlled.
- Add SEO metadata per major route.

Testing tasks:

- Expand Playwright coverage for desktop and mobile public pages.
- Add e2e coverage for language switching.
- Add tests for product publish/unpublish visibility.
- Add tests for inquiry form validation and admin visibility.
- Add tests for admin product save/edit behavior.
- Run `npm run build` before deployment.

## 10. Codex Instructions

When continuing this project, Codex should follow these instructions:

- Read this file first, then inspect current git status before editing.
- Do not revert uncommitted user changes.
- Treat code/route/file names as English and implementation notes as Korean where practical.
- Prefer updating existing helpers and components over adding parallel abstractions.
- Keep design direction quiet, refined, image-led, and product-inspection-friendly.
- For public pages, verify mobile and desktop layout after visual changes.
- For admin pages, prioritize clarity, scanability, and predictable controls.
- If a requirement is unclear, mark it as `Needs confirmation` in docs or comments instead of guessing final business content.
- When adding locale behavior, update `src/lib/i18n.ts`, route/page data fetching, header UI, tests, and documentation together.
- When changing product content schema, update Supabase migrations, seed SQL, `src/types/content.ts`, data mappers, admin forms, and tests together.
- When changing image handling, decide explicitly between external URL assets and Supabase Storage upload flow.
- Before claiming completion, run the narrow relevant tests plus `npm run build` when feasible.

Recommended first next step:

1. Choose canonical catalog route and locale URL strategy.
2. Make `SiteHeader` locale-aware.
3. Pass locale into `getFeaturedProducts`, `getPublishedProducts`, and `getProductBySlug` from route state.
4. Update public route tests for KR / EN / CN behavior.
