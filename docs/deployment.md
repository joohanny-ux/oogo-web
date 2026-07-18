# OOGO Deployment Guide

이 문서는 `www.oogolabs.com`에 OOGO 홈페이지를 배포하기 위한 운영 체크리스트입니다.

## 1. Supabase

1. OOGO Supabase 프로젝트를 엽니다.
2. Project Settings > API에서 Project URL과 anon public key를 복사합니다.
3. SQL editor에서 아래 순서로 실행합니다.

```text
supabase/reset-oogo-content.sql   # 기존 홈페이지 DB가 섞여 있을 때만 실행
supabase/migrations/0001_initial_schema.sql
supabase/migrations/0002_manageable_content.sql
supabase/migrations/0003_unique_product_image_roles.sql
supabase/migrations/0004_storage_upload_policies.sql
supabase/migrations/0005_add_press_inquiry_type.sql
supabase/migrations/0006_create_oogo_assets_bucket.sql
supabase/seed/seed-oogo-content.sql
supabase/verify-oogo-setup.sql     # read-only 확인용
```

`reset-oogo-content.sql`은 OOGO CMS public tables, helper functions, `oogo-assets` bucket만 정리하고 `auth.users`는 보존합니다. 기존 프로젝트를 재사용하지 않는 신규 프로젝트라면 reset SQL은 건너뜁니다.
`verify-oogo-setup.sql`은 데이터를 변경하지 않는 확인용 쿼리입니다. 모든 table check와 `bucket:oogo-assets`가 `ok`이고 `admin_profiles`가 1 이상이면 관리자 테스트를 진행합니다.

4. Authentication > Users에서 관리자 계정을 만들거나 기존 관리자 계정을 확인합니다.
5. 생성된 User UID를 사용해 프로필을 추가합니다.

```sql
insert into public.profiles (id, email, role)
values ('AUTH_USER_ID', 'admin@oogolabs.com', 'admin');
```

## 2. Vercel

1. GitHub 저장소를 Vercel에 연결합니다.
2. Framework Preset은 Next.js를 선택합니다.
3. Environment Variables를 설정합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=Supabase anon public key
NEXT_PUBLIC_SITE_URL=https://www.oogolabs.com
SUPABASE_SERVICE_ROLE_KEY=Supabase service role key
```

4. Build Command는 기본값 `next build`를 사용합니다.
5. 배포 후 Vercel Domains에서 `www.oogolabs.com`을 추가합니다.

## 3. DNS

도메인 공급자에서 Vercel이 안내하는 DNS 레코드를 추가합니다. 보통 `www`는 CNAME으로 Vercel 대상에 연결하고, 루트 도메인도 사용할 경우 Vercel 안내에 따라 A 레코드 또는 ALIAS/ANAME을 설정합니다.

## 4. First Admin Check

1. `https://www.oogolabs.com`에서 공개 홈페이지를 확인합니다.
2. `https://www.oogolabs.com/collection`에서 상품 카탈로그를 확인합니다.
3. `https://www.oogolabs.com/admin/login`에서 로그인합니다.
4. `/admin`의 Setup Status에서 Supabase env, migrations, storage, admin auth 준비 상태를 확인합니다.
5. `/admin/products`에서 테스트 상품을 추가하거나 seed 상품을 수정한 뒤 `Public on site`를 체크하고 저장합니다.
6. `/collection`과 `/products/[slug]`에서 상품 반영을 확인합니다.
7. `/admin/landing`에서 Home 또는 Collection 섹션 텍스트를 수정하고 초안 저장 후 게시합니다.
8. 해당 public route에서 랜딩 콘텐츠 반영을 확인합니다.
9. `/admin/inquiries`에서 문의가 들어오는지 확인합니다.

## 5. Content Operations

- 상품 추가/변경: `/admin/products`
- 홈페이지 문구 변경: `/admin/landing`
- 문의 확인/상태 변경: `/admin/inquiries`
- 회사 연락처/푸터 문구 변경: `/admin/company`
- 브랜드 이미지 확인: `/admin/files`

파일 업로드와 상품/랜딩 이미지 연결은 Supabase Storage bucket `oogo-assets`와 storage policy 적용 후 사용할 수 있습니다.

## 6. Pre-Release Checks

배포 전 로컬에서 아래 명령을 순서대로 실행합니다.

```powershell
npm run test
npm run build
npm run test:e2e -- tests/e2e/public.spec.ts
```

`npm install` 후 취약점 경고가 보이면 운영 배포 전 `npm audit` 결과를 검토합니다. 강제 자동 수정은 Next/React 버전을 바꿀 수 있으므로 별도 브랜치에서 확인합니다.
