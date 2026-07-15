import { describe, expect, it } from "vitest";
import {
  filterProductsByCategory,
  getProductBadges,
  getProductCatalogHref,
  getProductDetailHref,
  getProductDetailSections,
  formatProductLensText,
  mapProductRow,
  parseProductLensText
} from "@/lib/products";

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

  it("uses seed EN/CN names when DB only has Hangul translations", () => {
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

    expect(product.name).toBe("夕光漫步");
  });

  it("uses seed English name for EN when DB translation is missing", () => {
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
        product_translations: [{ locale: "ko", name: "황혼의 산책", colorway: null, description: "한글 설명" }]
      },
      "en"
    );

    expect(product.name).toBe("Sunset Stroll");
    expect(product.description).toBe("An OOGO frame shaped by the balance of light and shadow.");
  });

  it("maps localized detail specifications for the active locale", () => {
    const product = mapProductRow(
      {
        id: "p1",
        slug: "og26001c2-sunset-stroll",
        model_code: "OG26001C2",
        size: "63-17-145",
        frame_material: "Shared frame",
        lens_material: "Shared lens",
        lens_features: ["Shared feature"],
        published: true,
        featured: true,
        sort_order: 1,
        product_translations: [
          {
            locale: "en",
            name: "Sunset Stroll",
            colorway: "Brown",
            description: "Desc",
            size_note: "Temple length in millimeters",
            frame_material: "High-quality PC frame",
            lens_material: "PA12 nylon lens",
            lens_features: ["UV400", "Anti-impact"]
          }
        ]
      },
      "en"
    );

    expect(product).toMatchObject({
      size: "63-17-145",
      sizeNote: "Temple length in millimeters",
      frameMaterial: "High-quality PC frame",
      lensMaterial: "PA12 nylon lens",
      lensFeatures: ["UV400", "Anti-impact"]
    });
  });

  it("uses localized frame size and color on public product pages", () => {
    const product = mapProductRow(
      {
        id: "p1",
        slug: "og26001c2",
        model_code: "OG26001C2",
        size: "63-17-145",
        reference_color_name: "Transparent tea frame / tea lens",
        frame_material: null,
        lens_material: null,
        lens_features: [],
        published: true,
        featured: false,
        sort_order: 1,
        product_translations: [
          {
            locale: "ko",
            name: "황혼의 산책",
            colorway: "투명 브라운 프레임 + 브라운 렌즈",
            description: null,
            frame_size: "63□17-145",
            size_note: "렌즈 63mm / 브리지 17mm / 다리 145mm"
          }
        ]
      },
      "ko"
    );

    expect(product.colorway).toBe("투명 브라운 프레임 + 브라운 렌즈");
    expect(product.size).toBe("63□17-145");
    expect(product.sizeNote).toBe("렌즈 63mm / 브리지 17mm / 다리 145mm");
  });

  it("splits one lens field into the public primary line and feature details", () => {
    expect(
      parseProductLensText(
        "광학급 PA12 나일론 렌즈 | UV400 100% 자외선 차단 | 반사 방지 코팅 | 저헤이즈 <1.5%"
      )
    ).toEqual({
      material: "광학급 PA12 나일론 렌즈",
      features: ["UV400 100% 자외선 차단", "반사 방지 코팅", "저헤이즈 <1.5%"]
    });
  });

  it("formats legacy lens data without duplicate material or nested separators", () => {
    expect(
      formatProductLensText("PA12 Nylon", [
        "PA12 Nylon",
        "UV400 protection | Anti-impact",
        "Low haze <1.5%"
      ])
    ).toBe("PA12 Nylon | UV400 protection | Anti-impact | Low haze <1.5%");
  });

  it("normalizes legacy lens data while mapping a public product", () => {
    const product = mapProductRow(
      {
        id: "p1",
        slug: "og26001c3",
        model_code: "OG26001C3",
        size: "63-17-145",
        frame_material: "PC Frame",
        lens_material: "PA12 Nylon",
        lens_features: ["PA12 Nylon", "UV400 | Anti-impact"],
        published: true,
        featured: false,
        sort_order: 1,
        product_translations: [
          {
            locale: "ko",
            name: "안개 속 산책",
            colorway: "Gray",
            description: null,
            lens_material: "PA12 Nylon",
            lens_features: ["PA12 Nylon", "UV400 | Anti-impact"]
          }
        ]
      },
      "ko"
    );

    expect(product.lensMaterial).toBe("PA12 Nylon");
    expect(product.lensFeatures).toEqual(["UV400", "Anti-impact"]);
  });

  it("falls back to shared detail specifications when localized values are empty", () => {
    const product = mapProductRow(
      {
        id: "p1",
        slug: "og26001c2-sunset-stroll",
        model_code: "OG26001C2",
        size: "63-17-145",
        frame_material: "Shared frame",
        lens_material: "Shared lens",
        lens_features: ["Shared feature"],
        published: true,
        featured: false,
        sort_order: 2,
        product_translations: [
          {
            locale: "en",
            name: "Sunset Stroll",
            colorway: null,
            description: null,
            size_note: null,
            frame_material: null,
            lens_material: null,
            lens_features: []
          }
        ]
      },
      "en"
    );

    expect(product).toMatchObject({
      sizeNote: null,
      frameMaterial: "Shared frame",
      lensMaterial: "Shared lens",
      lensFeatures: ["Shared feature"]
    });
  });

  it("builds catalog badges from product order and featured state", () => {
    expect(getProductBadges({ featured: true, sortOrder: 0 })).toEqual(["New", "Best", "Sunglasses"]);
    expect(getProductBadges({ featured: false, sortOrder: 2 })).toEqual(["Special Edition", "Sunglasses"]);
  });

  it("builds catalog-led product detail sections without duplicate protection rows", () => {
    const sections = getProductDetailSections({
      frameMaterial: "고품질 PC 폴리카보네이트 프레임",
      frameMaterialNote: "High-quality PC Frame (Polycarbonate)",
      lensMaterial: "광학급 PA12 나일론 렌즈",
      lensMaterialNote: "PA12 Nylon",
      size: "63-17-145",
      sizeNote: "렌즈 63mm · 브리지 17mm · 템플 145mm",
      lensFeatures: ["UV400", "Anti-impact", "Low haze"]
    });

    expect(sections).toEqual([
      {
        title: "Frame",
        eyebrow: "프레임 / Frame",
        primary: "고품질 PC 폴리카보네이트 프레임",
        secondary: "High-quality PC Frame (Polycarbonate)"
      },
      {
        title: "Lens",
        eyebrow: "렌즈 / Lens",
        primary: "광학급 PA12 나일론 렌즈",
        secondary: "PA12 Nylon",
        detail: "UV400 / Anti-impact / Low haze"
      },
      {
        title: "Frame Size",
        eyebrow: "Frame Size",
        primary: "63-17-145",
        secondary: "렌즈 63mm · 브리지 17mm · 템플 145mm"
      }
    ]);
  });

  it("uses catalog fallback lens details only when localized lens data is empty", () => {
    const sections = getProductDetailSections({
      frameMaterial: "PC Frame",
      lensMaterial: "PA12 Nylon",
      size: "63-17-145",
      lensFeatures: []
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

  it("builds canonical public product routes", () => {
    expect(getProductCatalogHref()).toBe("/collection");
    expect(getProductCatalogHref("new")).toBe("/collection?category=new");
    expect(getProductDetailHref("og26001c2-sunset-stroll")).toBe("/products/og26001c2-sunset-stroll");
  });
});
