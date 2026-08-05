import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const actionsSource = readFileSync(join(process.cwd(), "src/app/admin/files/actions.ts"), "utf8");
const librarySource = readFileSync(join(process.cwd(), "src/components/admin/AssetLibrary.tsx"), "utf8");
const helperSource = readFileSync(join(process.cwd(), "src/lib/delete-unused-assets.ts"), "utf8");
const stateSource = readFileSync(join(process.cwd(), "src/lib/files-bulk-delete.ts"), "utf8");

describe("Files bulk unused delete", () => {
  it("exposes a bulk delete unused server action with confirmation", () => {
    expect(actionsSource).toContain("deleteAllUnusedAssetsAction");
    expect(actionsSource).toContain("listUnusedAssets");
    expect(actionsSource).toContain('confirm") ?? "") !== "delete-unused"');
    expect(actionsSource).not.toContain("initialBulkDeleteUnusedState");
  });

  it("keeps bulk delete state outside the use server module", () => {
    expect(stateSource).toContain("initialBulkDeleteUnusedState");
    expect(librarySource).toContain('from "@/lib/files-bulk-delete"');
  });

  it("protects landing-referenced assets during unused checks", () => {
    expect(helperSource).toContain("getLandingReferencedUrls");
    expect(helperSource).toContain("assertAssetIsUnused");
    expect(actionsSource).toContain("assertAssetIsUnused");
  });

  it("renders a bulk delete unused button in the Files library", () => {
    expect(librarySource).toContain("Unused 전체 삭제");
    expect(librarySource).toContain("deleteAllUnusedAssetsAction");
    expect(librarySource).toContain("window.confirm");
  });
});
