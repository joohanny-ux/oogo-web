import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assetKindOptions, normalizeAssetKind } from "@/lib/assets";

const assetsSource = readFileSync(join(process.cwd(), "src/lib/assets.ts"), "utf8");

describe("asset helpers", () => {
  it("normalizes known and unknown asset kinds", () => {
    expect(normalizeAssetKind("brand")).toBe("brand");
    expect(normalizeAssetKind("product")).toBe("product");
    expect(normalizeAssetKind("unknown")).toBe("general");
  });

  it("exposes the asset kind options used by the admin UI", () => {
    expect(assetKindOptions.map((option) => option.value)).toEqual(["brand", "product", "special", "general"]);
  });

  it("shows Archive usage in the Files library", () => {
    expect(assetsSource).toContain('from("archive_items")');
    expect(assetsSource).toContain("Archive gallery");
  });
});
