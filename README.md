# OOGO Homepage

OOGO 선글래스 브랜드 홈페이지와 관리자 대시보드입니다. 공개 사이트는 브랜드 스토리, 컬렉션, 스페셜 에디션, 문의 흐름을 보여주고, `/admin`에서는 상품, 랜딩 페이지 문구, 문의, 회사 정보, 파일 자산을 관리합니다.

## Stack

- Next.js App Router
- React
- Supabase Auth, Postgres, RLS
- Vercel deployment
- Vitest and Playwright

## Local Setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

`http://127.0.0.1:3100`에서 공개 사이트를 확인합니다. Supabase 환경 변수가 비어 있으면 공개 사이트는 내장된 OOGO 초기 콘텐츠로 표시됩니다. 관리자 저장 기능은 Supabase 연결 후 사용할 수 있습니다.

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://www.oogolaps.com
```

현재 앱은 브라우저/서버 Supabase 세션에 `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 사용합니다. `SUPABASE_SERVICE_ROLE_KEY`는 운영 자동화나 향후 서버 전용 관리 기능을 위해 예약되어 있으며, 클라이언트에 노출하면 안 됩니다.

## Supabase Setup

1. Supabase 프로젝트를 생성하거나 OOGO 프로젝트를 엽니다.
2. Project Settings > API에서 Project URL과 anon public key를 복사합니다.
3. `.env.local`에 아래 값을 입력한 뒤 dev server를 재시작합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

4. SQL editor에서 아래 파일을 순서대로 실행합니다.

```text
supabase/migrations/0001_initial_schema.sql
supabase/migrations/0002_manageable_content.sql
supabase/migrations/0003_unique_product_image_roles.sql
supabase/migrations/0004_storage_upload_policies.sql
supabase/migrations/0005_add_press_inquiry_type.sql
supabase/migrations/0006_create_oogo_assets_bucket.sql
supabase/seed/seed-oogo-content.sql
```

5. Authentication에서 관리자 계정을 생성합니다.
6. 생성된 auth user id로 `profiles` 행을 추가합니다.

```sql
insert into public.profiles (id, email, role)
values ('AUTH_USER_ID', 'admin@example.com', 'admin');
```

`admin`과 `editor`는 상품, 랜딩 콘텐츠, 회사 정보, 문의 상태를 관리할 수 있습니다. `viewer`는 추후 읽기 전용 운영 계정으로 확장할 수 있습니다.

### Existing Project Reset

기존 홈페이지와 연결되어 있던 Supabase 프로젝트를 깨끗하게 다시 시작하려면 전체 프로젝트 reset 대신 OOGO CMS 영역만 정리합니다. SQL editor에서 아래 순서로 실행합니다.

1. `supabase/reset-oogo-content.sql`
2. `supabase/migrations/0001_initial_schema.sql`
3. `supabase/migrations/0002_manageable_content.sql`
4. `supabase/migrations/0003_unique_product_image_roles.sql`
5. `supabase/migrations/0004_storage_upload_policies.sql`
6. `supabase/migrations/0005_add_press_inquiry_type.sql`
7. `supabase/migrations/0006_create_oogo_assets_bucket.sql`
8. `supabase/seed/seed-oogo-content.sql`

`reset-oogo-content.sql`은 `auth.users`를 삭제하지 않습니다. 다만 `public.profiles`는 재생성되므로, reset 후 관리자 auth user id를 다시 `profiles`에 추가해야 합니다.

reset, migrations, seed, profile 추가가 끝나면 SQL editor에서 `supabase/verify-oogo-setup.sql`을 실행합니다. 모든 table check가 `ok`이고 `bucket:oogo-assets`가 `ok`, `admin_profiles`가 `1` 이상이면 admin에서 public page 반영 테스트를 시작할 수 있습니다.

## Admin to Public Test Point

아래 준비가 끝난 뒤 dashboard에서 작업한 내용이 public page에 반영되는지 테스트합니다.

1. `.env.local`에 Supabase Project URL과 anon public key 입력
2. dev server 재시작
3. 모든 migration과 seed 실행
4. Supabase Auth 관리자 계정 생성
5. `profiles`에 해당 auth user id와 `admin` role 추가
6. `/admin/login` 로그인 성공 확인

이 시점부터 `/admin/products`에서 `Public on site`를 체크해 상품을 저장하면 `/collection`과 `/products/[slug]`에 반영됩니다. `/admin/landing`에서 초안 저장 후 게시하면 해당 public route에 반영됩니다.

## Main Routes

- `/` 공개 홈페이지
- `/products` 공개 상품 카탈로그
- `/products/[slug]` 공개 상품 상세
- `/admin/login` 관리자 로그인
- `/admin` 관리자 대시보드
- `/admin/products` 상품 관리
- `/admin/landing` 랜딩 페이지 텍스트 관리
- `/admin/inquiries` 문의 관리
- `/admin/files` 파일 자산 보기
- `/admin/company` 회사/브랜드 정보 관리

## Checks

```powershell
npm run test
npm run build
npm run test:e2e -- tests/e2e/public.spec.ts
```

빌드와 e2e는 같은 `.next` 캐시를 쓰므로 동시에 실행하지 말고 순서대로 실행합니다.
