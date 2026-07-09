import { describe, expect, it } from "vitest";
import { initialProducts, landingPageKeys } from "@/lib/seed-data";

describe("OOGO seed data", () => {
  it("includes required landing pages", () => {
    expect(landingPageKeys).toEqual([
      "header",
      "home",
      "brand-story",
      "collection",
      "product-detail",
      "special-edition",
      "inquiry",
      "footer"
    ]);
  });

  it("includes catalog products with multilingual names", () => {
    const sunset = initialProducts.find((product) => product.modelCode === "OG26001C2");

    expect(sunset?.translations.ko.name).toBe("황혼의 산책");
    expect(sunset?.translations.en.name).toBe("Sunset Stroll");
    expect(sunset?.translations.zh.name).toBe("夕光漫步");
  });
});
