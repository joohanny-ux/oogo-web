import { describe, expect, it } from "vitest";
import {
  getLandingDraftWritePayload,
  getLandingEditorPages,
  getLandingPageRecord,
  landingPageOptions
} from "@/lib/admin-content";
import { getProductImageSlots, getProductThumbnailUrl, parseProductImageInputs } from "@/lib/product-images";
import { parseProductLensText } from "@/lib/products";

describe("admin content helpers", () => {
  it("parses the first lens line as material and the remaining lines as features", () => {
    expect(parseProductLensText("PA12 Nylon\nUV400\nAnti-impact\n\nLow haze <1.5%")).toEqual({
      material: "PA12 Nylon",
      features: ["UV400", "Anti-impact", "Low haze <1.5%"]
    });
  });

  it("exposes editable landing page options", () => {
    expect(landingPageOptions.map((option) => option.key)).toEqual([
      "header",
      "home",
      "brand-story",
      "collection",
      "projects",
      "product-detail",
      "special-edition",
      "archive",
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
      "/products/og26001c2"
    );
    expect(getLandingEditorPages().find((page) => page.key === "home")).toMatchObject({
      surface: "Homepage",
      routeLabel: "/"
    });
    expect(getLandingEditorPages().find((page) => page.key === "special-edition")).toMatchObject({
      surface: "Project detail",
      routeLabel: "/projects/youngbin-edition"
    });
    expect(getLandingEditorPages().find((page) => page.key === "projects")?.publicHref).toBe("/projects");
    expect(getLandingEditorPages().find((page) => page.key === "archive")?.publicHref).toBe("/archive");
  });

  it("provides a parent landing page record before saving new Archive blocks", () => {
    expect(getLandingPageRecord("archive")).toEqual({
      page_key: "archive",
      title: "Archive",
      published: true,
      sort_order: 80
    });
  });

  it("preserves published content when saving a draft for an existing landing block", () => {
    const input = {
      pageKey: "home",
      blockKey: "hero",
      locale: "ko" as const,
      content: { heading: "Updated" }
    };

    expect(getLandingDraftWritePayload(input, "2026-07-14T00:00:00.000Z", "block-id")).toEqual({
      draft_content: input.content,
      updated_at: "2026-07-14T00:00:00.000Z"
    });
  });

  it("creates new landing drafts as unpublished", () => {
    const input = {
      pageKey: "home",
      blockKey: "hero",
      locale: "ko" as const,
      content: { heading: "Draft" }
    };

    expect(getLandingDraftWritePayload(input, "2026-07-14T00:00:00.000Z")).toEqual({
      page_key: "home",
      block_key: "hero",
      locale: "ko",
      draft_content: input.content,
      published_content: {},
      published: false,
      updated_at: "2026-07-14T00:00:00.000Z"
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

  it("uses the front image for product library thumbnails", () => {
    expect(
      getProductThumbnailUrl([
        { role: "angle", assets: { public_url: "https://cdn.example.com/angle.png" } },
        { role: "front", assets: { public_url: "https://cdn.example.com/front.png" } }
      ])
    ).toBe("https://cdn.example.com/front.png");
  });
});
