import { describe, expect, it } from "vitest";
import { filterProductsByCategory, getProductBadges, getProductDetailSections, mapProductRow } from "@/lib/products";

describe("product mapping", () => {
  it("maps Supabase product rows to public product cards", () => {
    const product = mapProductRow(
      {
        id: "p1",
        slug: "og26001c2-sunset-stroll",
        model_code: "OG26001C2",
        size: "63-17-145",
        frame_material: "PC",
        lens_material: "PA12",
        lens_features: ["UV400"],
        published: true,
        featured: true,
        sort_order: 1,
        product_translations: [{ locale: "en", name: "Sunset Stroll", colorway: null, description: "Desc" }]
      },
      "en"
    );

    expect(product.name).toBe("Sunset Stroll");
    expect(product.modelCode).toBe("OG26001C2");
  });

  it("maps managed product images by role", () => {
    const product = mapProductRow(
      {
        id: "p1",
        slug: "og26001c2-sunset-stroll",
        model_code: "OG26001C2",
        size: "63-17-145",
        frame_material: "PC",
        lens_material: "PA12",
        lens_features: ["UV400"],
        published: true,
        featured: true,
        sort_order: 1,
        product_translations: [{ locale: "en", name: "Sunset Stroll", colorway: null, description: "Desc" }],
        product_images: [
          { role: "angle", assets: { public_url: "https://cdn.example.com/angle.png", alt: "Angle view" } },
          { role: "wearing", assets: [{ public_url: "https://cdn.example.com/wearing.png", alt: "Wearing" }] },
          { role: "front", assets: { public_url: "https://cdn.example.com/front.png", alt: "Front" } },
          { role: "side", assets: { public_url: "https://cdn.example.com/side.png", alt: "Side" } }
        ]
      },
      "en"
    );

    expect(product.images).toEqual({
      angle: "https://cdn.example.com/angle.png",
      wearing: "https://cdn.example.com/wearing.png",
      front: "https://cdn.example.com/front.png",
      side: "https://cdn.example.com/side.png"
    });
  });

  it("falls back to Korean translation when requested locale is missing", () => {
    const product = mapProductRow(
      {
        id: "p1",
        slug: "og26001c2-sunset-stroll",
        model_code: "OG26001C2",
        size: "63-17-145",
        frame_material: "PC",
        lens_material: "PA12",
        lens_features: ["UV400"],
        published: true,
        featured: true,
        sort_order: 1,
        product_translations: [{ locale: "ko", name: "황혼의 산책", colorway: null, description: null }]
      },
      "zh"
    );

    expect(product.name).toBe("황혼의 산책");
  });

  it("builds catalog badges from product order and featured state", () => {
    expect(getProductBadges({ featured: true, sortOrder: 0 })).toEqual(["New", "Best", "Sunglasses"]);
    expect(getProductBadges({ featured: false, sortOrder: 2 })).toEqual(["Special Edition", "Sunglasses"]);
  });

  it("builds catalog-led product detail sections without duplicate protection rows", () => {
    const sections = getProductDetailSections({
      frameMaterial: "PC Frame",
      lensMaterial: "PA12 Nylon",
      size: "63-17-145",
      lensFeatures: ["UV400", "Anti-impact", "Low haze"]
    });

    expect(sections).toEqual([
      {
        title: "Frame",
        eyebrow: "프레임 / Frame",
        primary: "고품질 PC 폴리카보네이트 프레임",
        secondary: "PC Frame"
      },
      {
        title: "Lens",
        eyebrow: "렌즈 / Lens",
        primary: "광학급 PA12 나일론 렌즈",
        secondary: "PA12 Nylon",
        detail: "UV400 / Anti-impact / Low haze"
      },
      { title: "Size", eyebrow: "Size", primary: "63-17-145" }
    ]);
  });

  it("uses full catalog lens details when imported lens data is too short", () => {
    const sections = getProductDetailSections({
      frameMaterial: "PC Frame",
      lensMaterial: "PA12 Nylon",
      size: "63-17-145",
      lensFeatures: ["UV400 100% protection"]
    });

    expect(sections[1]).toMatchObject({
      title: "Lens",
      detail: "UV400 100% protection / Anti-impact / Anti-reflective coating / Low haze <1.5% / 1.0g/cm³"
    });
  });

  it("filters products by catalog category", () => {
    const products = [
      { slug: "new-best", featured: true, sortOrder: 0 },
      { slug: "new-only", featured: false, sortOrder: 1 },
      { slug: "special", featured: false, sortOrder: 2 }
    ];

    expect(filterProductsByCategory(products, "new").map((product) => product.slug)).toEqual(["new-best", "new-only"]);
    expect(filterProductsByCategory(products, "best").map((product) => product.slug)).toEqual(["new-best"]);
    expect(filterProductsByCategory(products, "special-edition").map((product) => product.slug)).toEqual(["special"]);
    expect(filterProductsByCategory(products, "all").map((product) => product.slug)).toEqual([
      "new-best",
      "new-only",
      "special"
    ]);
  });
});
