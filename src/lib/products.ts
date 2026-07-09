import type { Locale } from "@/lib/i18n";

export type ProductImageAsset = {
  public_url?: string | null;
  alt?: string | null;
};

export type ProductImageRow = {
  role: string | null;
  assets: ProductImageAsset | ProductImageAsset[] | null;
};

export type ProductRow = {
  id: string;
  slug: string;
  model_code: string;
  size: string | null;
  frame_material: string | null;
  lens_material: string | null;
  lens_features: string[];
  published: boolean;
  featured: boolean;
  sort_order: number;
  product_translations: Array<{
    locale: string;
    name: string;
    colorway: string | null;
    description: string | null;
  }>;
  product_images?: ProductImageRow[];
};

export type ProductImages = Partial<Record<"angle" | "wearing" | "front" | "side", string>>;

function assetPublicUrl(asset: ProductImageRow["assets"]) {
  if (Array.isArray(asset)) {
    return asset[0]?.public_url ?? null;
  }

  return asset?.public_url ?? null;
}

export function mapProductImages(productImages: ProductRow["product_images"] = []): ProductImages {
  return productImages.reduce<ProductImages>((images, image) => {
    if (
      image.role === "angle" ||
      image.role === "wearing" ||
      image.role === "front" ||
      image.role === "side"
    ) {
      const url = assetPublicUrl(image.assets);

      if (url) {
        images[image.role] = url;
      }
    }

    return images;
  }, {});
}

export function mapProductRow(row: ProductRow, locale: Locale) {
  const translation =
    row.product_translations.find((item) => item.locale === locale) ??
    row.product_translations.find((item) => item.locale === "ko") ??
    row.product_translations[0];
  const translations = row.product_translations.reduce<
    Partial<Record<Locale, { name: string; colorway: string | null; description: string | null }>>
  >((items, item) => {
    if (item.locale === "ko" || item.locale === "en" || item.locale === "zh") {
      items[item.locale] = {
        name: item.name,
        colorway: item.colorway,
        description: item.description
      };
    }

    return items;
  }, {});

  return {
    id: row.id,
    slug: row.slug,
    modelCode: row.model_code,
    name: translation?.name ?? row.model_code,
    colorway: translation?.colorway ?? null,
    description: translation?.description ?? null,
    translations,
    size: row.size,
    frameMaterial: row.frame_material,
    lensMaterial: row.lens_material,
    lensFeatures: row.lens_features,
    featured: row.featured,
    sortOrder: row.sort_order,
    images: mapProductImages(row.product_images)
  };
}

export function getProductBadges(product: { featured: boolean; sortOrder: number }) {
  const badges: string[] = [];

  if (product.sortOrder <= 1) {
    badges.push("New");
  }

  if (product.featured) {
    badges.push("Best");
  }

  if (product.sortOrder >= 2) {
    badges.push("Special Edition");
  }

  badges.push("Sunglasses");

  return badges;
}

export type CatalogCategory = "all" | "new" | "best" | "sunglasses" | "special-edition";

export function normalizeCatalogCategory(value: string | undefined): CatalogCategory {
  if (value === "new" || value === "best" || value === "sunglasses" || value === "special-edition") {
    return value;
  }

  return "all";
}

export function filterProductsByCategory<T extends { featured: boolean; sortOrder: number }>(
  products: T[],
  category: CatalogCategory
) {
  if (category === "new") {
    return products.filter((product) => product.sortOrder <= 1);
  }

  if (category === "best") {
    return products.filter((product) => product.featured);
  }

  if (category === "special-edition") {
    return products.filter((product) => product.sortOrder >= 2);
  }

  return products;
}

export function getProductDetailSections(product: {
  frameMaterial: string | null;
  lensMaterial: string | null;
  size: string | null;
  lensFeatures: string[];
}) {
  const defaultLensFeatures = [
    "UV400 100% protection",
    "Anti-impact",
    "Anti-reflective coating",
    "Low haze <1.5%",
    "1.0g/cm³"
  ];
  const lensDetails = product.lensFeatures.length >= 3 ? product.lensFeatures : defaultLensFeatures;

  return [
    {
      title: "Frame",
      eyebrow: "프레임 / Frame",
      primary: "고품질 PC 폴리카보네이트 프레임",
      secondary: product.frameMaterial ?? "High-quality PC Frame (Polycarbonate)"
    },
    {
      title: "Lens",
      eyebrow: "렌즈 / Lens",
      primary: "광학급 PA12 나일론 렌즈",
      secondary: product.lensMaterial ?? "PA12 Nylon (Swiss EMS Grilamid TR90 LXS)",
      detail: lensDetails.join(" / ")
    },
    {
      title: "Size",
      eyebrow: "Size",
      primary: product.size ?? "One size"
    }
  ];
}
