import { describe, expect, it } from "vitest";
import { assetKindOptions, normalizeAssetKind } from "@/lib/assets";

describe("asset helpers", () => {
  it("normalizes known and unknown asset kinds", () => {
    expect(normalizeAssetKind("brand")).toBe("brand");
    expect(normalizeAssetKind("product")).toBe("product");
    expect(normalizeAssetKind("unknown")).toBe("general");
  });

  it("exposes the asset kind options used by the admin UI", () => {
    expect(assetKindOptions.map((option) => option.value)).toEqual(["brand", "product", "special", "general"]);
  });
});
