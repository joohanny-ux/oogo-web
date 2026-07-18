# Admin Files Upload Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the smallest useful OOGO coding pilot by wiring the existing `/admin/files` upload form to a server-side Supabase Storage upload flow.

**Architecture:** Keep the pilot inside the current Next.js App Router admin surface. Add focused asset-upload helpers, expose one server action from `src/app/admin/files/actions.ts`, and connect the existing files page form without changing unrelated admin screens.

**Tech Stack:** Next.js App Router, React Server Components, Server Actions, Supabase Storage/Postgres, Vitest, Testing Library.

## Global Constraints

- Work only in `C:\dev\oogo-web`.
- Do not commit, push, merge, deploy, migrate, or publish without explicit authorization.
- Keep the change on a feature branch named `feature/admin-files-upload-pilot` or equivalent.
- Do not modify `.env`, `.env.local`, API keys, Supabase keys, Vercel tokens, or private credentials.
- Keep changes small and focused.
- Use English for code comments, commit messages, and technical file names.
- Preserve the clean, premium, minimal, card-based admin direction.
- Verification for this pilot is targeted unit tests plus `npm run build` if the local app dependencies are installed.

---

## Repository Inspection Notes

- `README.md` identifies the app as an OOGO sunglasses homepage and admin dashboard using Next.js App Router, React, Supabase Auth/Postgres/RLS, Vercel, Vitest, and Playwright.
- `package.json` exposes `npm run test`, `npm run build`, and `npm run test:e2e`.
- `/admin/files` already renders a file upload form and `AssetLibrary`, but the form has no action and its button is `type="button"`.
- `src/lib/assets.ts` already contains a browser-only `uploadAsset(file, kind, alt)` helper, but the files page is a server component and does not call it.
- `src/app/admin/files/actions.ts` already contains `deleteUnusedAssetAction`, usage protection, Supabase env checks, and `/admin/files` revalidation.
- `src/app/api/admin/archive/upload/route.ts` shows the repo pattern for authenticated raw Storage uploads, safe file names, public URL lookup, `assets` inserts, and user-facing Korean error messages.
- `tests/unit/assets.test.ts` currently checks asset helper behavior with source-level assertions, so this pilot should add helper-level unit tests and one source assertion for the form action wiring.

## Pilot Scope

In scope:
- Validate a single uploaded image file from the existing `/admin/files` form.
- Store the image in the `oogo-assets` bucket under `<kind>/<timestamp>-<uuid>-<safe-name>`.
- Insert one row into `assets` with `bucket`, `path`, `public_url`, `kind`, and nullable `alt`.
- Revalidate `/admin/files` after success.
- Keep deletion behavior unchanged.

Out of scope:
- Multi-file uploads.
- Drag-and-drop UI.
- Progress bars.
- Asset editing after upload.
- New Supabase migrations.
- Changes to public pages.

## File Structure

- Create: `src/lib/asset-upload.ts`
  - Owns generic admin asset upload validation, safe file naming, and FormData extraction.
- Modify: `src/app/admin/files/actions.ts`
  - Adds `uploadAssetAction(formData: FormData)` beside the existing delete action.
- Modify: `src/app/admin/files/page.tsx`
  - Connects the existing form to `uploadAssetAction`, changes the submit button to submit, and keeps Supabase-disabled behavior.
- Modify: `tests/unit/assets.test.ts`
  - Adds tests for upload validation helpers and source-level action/form wiring.

---

### Task 1: Asset Upload Helpers

**Files:**
- Create: `src/lib/asset-upload.ts`
- Modify: `tests/unit/assets.test.ts`

**Interfaces:**
- Consumes: `normalizeAssetKind(value: string): AssetKind` from `src/lib/asset-kinds.ts`.
- Produces:
  - `assetImageMaxBytes: number`
  - `getAssetUploadFile(formData: FormData, fieldName?: string): File | null`
  - `requireAssetUploadFile(formData: FormData, fieldName?: string): File`
  - `validateAssetImage(file: File): { ok: true } | { ok: false; message: string }`
  - `safeAssetFileName(name: string): string`
  - `readAssetUploadFields(formData: FormData): { file: File; kind: AssetKind; alt: string }`

- [ ] **Step 1: Write failing tests**

Append these tests inside the existing `describe("asset helpers", () => { ... })` block in `tests/unit/assets.test.ts`.

```ts
it("validates admin asset upload files", async () => {
  const { validateAssetImage } = await import("@/lib/asset-upload");

  expect(validateAssetImage(new File(["image"], "image.webp", { type: "image/webp" }))).toEqual({ ok: true });
  expect(validateAssetImage(new File(["text"], "notes.txt", { type: "text/plain" }))).toEqual({
    ok: false,
    message: "JPG, PNG, WebP 이미지만 업로드할 수 있습니다."
  });

  const oversized = new File([new Uint8Array(8 * 1024 * 1024 + 1)], "large.jpg", { type: "image/jpeg" });
  expect(validateAssetImage(oversized)).toEqual({
    ok: false,
    message: "이미지당 최대 용량은 8MB입니다."
  });
});

it("reads and normalizes admin asset upload form fields", async () => {
  const { readAssetUploadFields, safeAssetFileName } = await import("@/lib/asset-upload");
  const formData = new FormData();
  formData.set("file", new File(["image"], "OOGO 제품 01.JPG", { type: "image/jpeg" }));
  formData.set("kind", "unexpected-kind");
  formData.set("alt", "  Main product image  ");

  expect(safeAssetFileName("OOGO 제품 01.JPG")).toBe("oogo-01.jpg");
  expect(readAssetUploadFields(formData)).toMatchObject({
    kind: "general",
    alt: "Main product image"
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm run test -- tests/unit/assets.test.ts
```

Expected: FAIL because `src/lib/asset-upload.ts` does not exist.

- [ ] **Step 3: Create helper implementation**

Create `src/lib/asset-upload.ts`.

```ts
import { normalizeAssetKind, type AssetKind } from "@/lib/asset-kinds";

const assetImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
export const assetImageMaxBytes = 8 * 1024 * 1024;

export function getAssetUploadFile(formData: FormData, fieldName = "file") {
  const value = formData.get(fieldName);
  return value instanceof File && value.size > 0 ? value : null;
}

export function requireAssetUploadFile(formData: FormData, fieldName = "file") {
  const file = getAssetUploadFile(formData, fieldName);
  if (!file) {
    throw new Error("업로드할 파일을 선택해 주세요.");
  }
  return file;
}

export function validateAssetImage(file: File) {
  if (!assetImageTypes.has(file.type)) {
    return { ok: false as const, message: "JPG, PNG, WebP 이미지만 업로드할 수 있습니다." };
  }

  if (file.size > assetImageMaxBytes) {
    return { ok: false as const, message: "이미지당 최대 용량은 8MB입니다." };
  }

  return { ok: true as const };
}

export function safeAssetFileName(name: string) {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "asset-image.jpg"
  );
}

export function readAssetUploadFields(formData: FormData): { file: File; kind: AssetKind; alt: string } {
  const file = requireAssetUploadFile(formData);
  const kind = normalizeAssetKind(String(formData.get("kind") ?? ""));
  const alt = String(formData.get("alt") ?? "").trim();
  return { file, kind, alt };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npm run test -- tests/unit/assets.test.ts
```

Expected: PASS for `tests/unit/assets.test.ts`.

- [ ] **Step 5: Commit checkpoint only if authorized**

Do not commit unless explicitly approved. If approved, use:

```powershell
git add src/lib/asset-upload.ts tests/unit/assets.test.ts
git commit -m "feat: add admin asset upload helpers"
```

---

### Task 2: Server Action for Files Upload

**Files:**
- Modify: `src/app/admin/files/actions.ts`
- Modify: `tests/unit/assets.test.ts`

**Interfaces:**
- Consumes:
  - `readAssetUploadFields(formData): { file: File; kind: AssetKind; alt: string }`
  - `validateAssetImage(file): { ok: true } | { ok: false; message: string }`
  - `safeAssetFileName(name): string`
  - `hasSupabaseEnv(): boolean`
  - `requireAdminSession(): Promise<SupabaseClient>`
- Produces:
  - `uploadAssetAction(formData: FormData): Promise<void>`

- [ ] **Step 1: Write failing source-level test**

Append this test inside `describe("asset helpers", () => { ... })` in `tests/unit/assets.test.ts`.

```ts
it("wires Files upload through an authenticated server action", () => {
  const fileActionsSource = readFileSync(join(process.cwd(), "src/app/admin/files/actions.ts"), "utf8");

  expect(fileActionsSource).toContain("export async function uploadAssetAction(formData: FormData)");
  expect(fileActionsSource).toContain("requireAdminSession()");
  expect(fileActionsSource).toContain('storage.from("oogo-assets").upload');
  expect(fileActionsSource).toContain('.from("assets")');
  expect(fileActionsSource).toContain('revalidatePath("/admin/files")');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm run test -- tests/unit/assets.test.ts
```

Expected: FAIL because `uploadAssetAction` is not implemented.

- [ ] **Step 3: Add server action imports**

In `src/app/admin/files/actions.ts`, add these imports.

```ts
import { randomUUID } from "node:crypto";
import { requireAdminSession } from "@/lib/admin-auth";
import { readAssetUploadFields, safeAssetFileName, validateAssetImage } from "@/lib/asset-upload";
```

- [ ] **Step 4: Add upload action**

Add this function above `deleteUnusedAssetAction` in `src/app/admin/files/actions.ts`.

```ts
export async function uploadAssetAction(formData: FormData) {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase environment variables are not configured. Connect Supabase before uploading files.");
  }

  const { file, kind, alt } = readAssetUploadFields(formData);
  const validation = validateAssetImage(file);
  if (!validation.ok) {
    throw new Error(validation.message);
  }

  const supabase = await requireAdminSession();
  const path = `${kind}/${Date.now()}-${randomUUID()}-${safeAssetFileName(file.name)}`;
  const { error: uploadError } = await supabase.storage.from("oogo-assets").upload(path, file, {
    contentType: file.type,
    upsert: false
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from("oogo-assets").getPublicUrl(path);
  const { error: insertError } = await supabase.from("assets").insert({
    bucket: "oogo-assets",
    path,
    public_url: data.publicUrl,
    kind,
    alt: alt || null
  });

  if (insertError) {
    await supabase.storage.from("oogo-assets").remove([path]);
    throw new Error(insertError.message);
  }

  revalidatePath("/admin/files");
}
```

- [ ] **Step 5: Run test to verify it passes**

Run:

```powershell
npm run test -- tests/unit/assets.test.ts
```

Expected: PASS for `tests/unit/assets.test.ts`.

- [ ] **Step 6: Commit checkpoint only if authorized**

Do not commit unless explicitly approved. If approved, use:

```powershell
git add src/app/admin/files/actions.ts tests/unit/assets.test.ts
git commit -m "feat: upload admin file assets"
```

---

### Task 3: Connect Existing Files Form

**Files:**
- Modify: `src/app/admin/files/page.tsx`
- Modify: `tests/unit/assets.test.ts`

**Interfaces:**
- Consumes: `uploadAssetAction(formData: FormData): Promise<void>` from `src/app/admin/files/actions.ts`.
- Produces: Existing `/admin/files` form submits to the upload server action when Supabase is configured.

- [ ] **Step 1: Write failing source-level test**

Append this test inside `describe("asset helpers", () => { ... })` in `tests/unit/assets.test.ts`.

```ts
it("connects the Files page upload form to the upload action", () => {
  const filesPageSource = readFileSync(join(process.cwd(), "src/app/admin/files/page.tsx"), "utf8");

  expect(filesPageSource).toContain("uploadAssetAction");
  expect(filesPageSource).toContain('action={uploadAssetAction}');
  expect(filesPageSource).toContain('type="submit"');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm run test -- tests/unit/assets.test.ts
```

Expected: FAIL because the page imports only `deleteUnusedAssetAction` and the button is `type="button"`.

- [ ] **Step 3: Import the upload action**

In `src/app/admin/files/page.tsx`, replace the actions import with:

```ts
import { deleteUnusedAssetAction, uploadAssetAction } from "@/app/admin/files/actions";
```

- [ ] **Step 4: Wire the form and submit button**

Change the opening form tag and button in `src/app/admin/files/page.tsx`.

```tsx
<form className="admin-form" action={uploadAssetAction}>
```

```tsx
<button type="submit" disabled={!supabaseConfigured}>
  {supabaseConfigured ? "Upload file" : "Upload requires Supabase connection"}
</button>
```

- [ ] **Step 5: Run test to verify it passes**

Run:

```powershell
npm run test -- tests/unit/assets.test.ts
```

Expected: PASS for `tests/unit/assets.test.ts`.

- [ ] **Step 6: Commit checkpoint only if authorized**

Do not commit unless explicitly approved. If approved, use:

```powershell
git add src/app/admin/files/page.tsx tests/unit/assets.test.ts
git commit -m "feat: connect admin files upload form"
```

---

### Task 4: Targeted Verification and Handoff

**Files:**
- No production file changes.

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: Verification evidence for the pilot PR.

- [ ] **Step 1: Run targeted unit tests**

Run:

```powershell
npm run test -- tests/unit/assets.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run build if dependencies are installed**

Run:

```powershell
npm run build
```

Expected: PASS. If the command fails because dependencies are missing, run `npm install` only if approved by the task owner; otherwise report the blocker.

- [ ] **Step 3: Inspect final diff**

Run:

```powershell
git diff -- src/lib/asset-upload.ts src/app/admin/files/actions.ts src/app/admin/files/page.tsx tests/unit/assets.test.ts
```

Expected: Diff is limited to the four pilot files.

- [ ] **Step 4: Prepare completion report in Korean**

Use this structure:

```text
완료한 작업:
- /admin/files 업로드 폼을 서버 액션에 연결했습니다.

변경 파일:
- src/lib/asset-upload.ts
- src/app/admin/files/actions.ts
- src/app/admin/files/page.tsx
- tests/unit/assets.test.ts

검증:
- npm run test -- tests/unit/assets.test.ts: PASS
- npm run build: PASS

남은 위험:
- 실제 Supabase Storage 업로드는 연결된 프로젝트와 관리자 세션에서 최종 확인이 필요합니다.
```

## Self-Review

- Spec coverage: The plan covers repository inspection, the smallest first coding pilot, exact files, implementation steps, tests, and verification.
- Placeholder scan: No blocked placeholder terms or unspecified implementation steps remain.
- Type consistency: The helper names in Task 1 match the imports and action code in Task 2; the action name in Task 2 matches the page wiring in Task 3.
