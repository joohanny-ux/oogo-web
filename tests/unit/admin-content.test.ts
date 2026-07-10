import { describe, expect, it } from "vitest";
import {
  getLandingEditorPages,
  landingPageOptions,
  parseLensFeatures
} from "@/lib/admin-content";
import { getProductImageSlots, parseProductImageInputs } from "@/lib/product-images";

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
    expect(getLandingEditorPages().find((page) => page.key === "home")).toMatchObject({
      surface: "Homepage",
      routeLabel: "/"
    });
    expect(getLandingEditorPages().find((page) => page.key === "special-edition")).toMatchObject({
      surface: "Project detail",
      routeLabel: "/projects/youngbin-edition"
    });
  });

  it("defines OOGO product image slots for admin upload", () => {
    expect(getProductImageSlots().map((slot) => slot.role)).toEqual(["front", "angle", "side", "wearing"]);
    expect(getProductImageSlots().map((slot) => slot.label)).toEqual([
      "Front balance",
      "Angle view",
      "Side profile",
      "Wearing / Lifestyle"
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
      { role: "front", url: "https://cdn.example.com/front.png" },
      { role: "angle", url: "https://cdn.example.com/angle.png" }
    ]);
  });
});
