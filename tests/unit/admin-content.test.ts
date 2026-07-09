import { describe, expect, it } from "vitest";
import {
  getLandingEditorPages,
  getProductImageSlots,
  landingPageOptions,
  parseLensFeatures,
  parseProductImageInputs
} from "@/lib/admin-content";

describe("admin content helpers", () => {
  it("parses lens features from separate lines", () => {
    expect(parseLensFeatures("UV400\nAnti-impact\n\nLow haze <1.5%")).toEqual([
      "UV400",
      "Anti-impact",
      "Low haze <1.5%"
    ]);
  });

  it("exposes editable landing page options", () => {
    expect(landingPageOptions.map((option) => option.key)).toEqual([
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

  it("exposes landing editor pages for every public content surface", () => {
    expect(getLandingEditorPages().map((page) => page.key)).toEqual(
      landingPageOptions.map((option) => option.key)
    );
    expect(getLandingEditorPages().find((page) => page.key === "collection")?.publicHref).toBe("/collection");
    expect(getLandingEditorPages().find((page) => page.key === "product-detail")?.publicHref).toBe(
      "/products/og26001c2-sunset-stroll"
    );
  });

  it("defines OOGO product image slots for admin upload", () => {
    expect(getProductImageSlots().map((slot) => slot.role)).toEqual(["angle", "wearing", "front", "side"]);
    expect(getProductImageSlots().map((slot) => slot.label)).toEqual([
      "Angle / Main",
      "Wearing",
      "Front balance",
      "Side profile"
    ]);
  });

  it("parses image URL inputs by product image role", () => {
    expect(
      parseProductImageInputs({
        angle: " https://cdn.example.com/angle.png ",
        wearing: "",
        front: "https://cdn.example.com/front.png",
        side: "   "
      })
    ).toEqual([
      { role: "angle", url: "https://cdn.example.com/angle.png" },
      { role: "front", url: "https://cdn.example.com/front.png" }
    ]);
  });
});
