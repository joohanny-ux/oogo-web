import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const landingActionsSource = readFileSync(join(process.cwd(), "src/app/admin/landing/actions.ts"), "utf8");
const landingUploadRoutePath = join(process.cwd(), "src/app/api/admin/landing/upload/route.ts");
const landingUploadRouteSource = existsSync(landingUploadRoutePath) ? readFileSync(landingUploadRoutePath, "utf8") : "";
const landingEditorSource = readFileSync(join(process.cwd(), "src/components/admin/LandingEditor.tsx"), "utf8");
const landingBlockFormSource = readFileSync(join(process.cwd(), "src/components/admin/LandingBlockForm.tsx"), "utf8");
const assetsSource = readFileSync(join(process.cwd(), "src/lib/assets.ts"), "utf8");
const filesPageSource = readFileSync(join(process.cwd(), "src/app/admin/files/page.tsx"), "utf8");

describe("Landing upload pipeline", () => {
  it("keeps landing save actions URL-only without sharp in server actions", () => {
    expect(landingActionsSource).not.toContain("optimizeWebImage");
    expect(landingActionsSource).not.toContain("uploadLandingMediaFile");
    expect(landingActionsSource).toContain("readLandingContentFields");
  });

  it("uploads landing media through a Node API route with webp optimization", () => {
    expect(landingUploadRouteSource).toContain('export const runtime = "nodejs"');
    expect(landingUploadRouteSource).toContain("uploadLandingMediaAsset");
    expect(landingUploadRouteSource).toContain("getAdminSupabaseClient");
  });

  it("pre-uploads landing files on the client before save", () => {
    expect(landingBlockFormSource).toContain("buildLandingSubmitFormData");
    expect(landingEditorSource).toContain("LandingBlockForm");
    expect(landingEditorSource).not.toContain("formAction={savePublishAction}");
  });

  it("tracks landing block URLs as asset usage in Files", () => {
    expect(assetsSource).toContain("collectLandingContentUrls");
    expect(assetsSource).toContain("Landing published");
  });

  it("positions Files as storage cleanup instead of primary upload", () => {
    expect(filesPageSource).toContain("사용하지 않는 파일 정리");
    expect(filesPageSource).not.toContain('name="file"');
  });
});
