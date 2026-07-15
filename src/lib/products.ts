import type { Locale } from "@/lib/i18n";
import { withLocalePrefix } from "@/lib/locale-path";

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
  reference_color_name?: string | null;
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
    frame_size?: string | null;
    size_note?: string | null;
    frame_material?: string | null;
    lens_material?: string | null;
    lens_features?: string[];
  }>;
  product_images?: ProductImageRow[];
};

export type ProductImages = Partial<Record<"angle" | "wearing" | "front" | "side", string>>;

export type PublicProductTranslation = {
  name: string;
  colorway: string | null;
  description: string | null;
  frameSize?: string | null;
  sizeNote?: string | null;
  frameMaterial?: string | null;
  lensMaterial?: string | null;
  lensFeatures?: string[];
};

export type PublicProduct = {
  id: string;
  slug: string;
  modelCode: string;
  name: string;
  colorway: string | null;
  description: string | null;
  translations: Partial<Record<Locale, PublicProductTranslation>>;
  size: string | null;
  sizeNote: string | null;
  frameMaterial: string | null;
  frameMaterialNote: string | null;
  lensMaterial: string | null;
  lensMaterialNote: string | null;
  lensFeatures: string[];
  sharedFrameMaterial: string | null;
  sharedLensMaterial: string | null;
  featured: boolean;
  sortOrder: number;
  images: ProductImages;
};

export type ProductDetailSection = {
  title: string;
  eyebrow: string;
  primary: string;
  secondary?: string;
  detail?: string;
};

export const PRODUCT_CATALOG_PATH = "/collection";
export const PRODUCT_DETAIL_PATH = "/products";

export function getProductCatalogHref(category?: CatalogCategory, locale: Locale = "ko") {
  const path =
    !category || category === "all"
      ? PRODUCT_CATALOG_PATH
      : `${PRODUCT_CATALOG_PATH}?category=${encodeURIComponent(category)}`;

  return withLocalePrefix(path, locale);
}

export function getProductDetailHref(slug: string, locale: Locale = "ko") {
  return withLocalePrefix(`${PRODUCT_DETAIL_PATH}/${encodeURIComponent(slug)}`, locale);
}

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

export function mapProductRow(row: ProductRow, locale: Locale): PublicProduct {
  const translation =
    row.product_translations.find((item) => item.locale === locale) ??
    row.product_translations.find((item) => item.locale === "ko") ??
    row.product_translations[0];
  const selectedLensMaterial = translation?.lens_material || row.lens_material;
  const selectedLensFeatures = translation?.lens_features?.length
    ? translation.lens_features
    : row.lens_features;
  const normalizedLens = parseProductLensText(
    formatProductLensText(selectedLensMaterial, selectedLensFeatures)
  );
  const translations = row.product_translations.reduce<Partial<Record<Locale, PublicProductTranslation>>>((items, item) => {
    if (item.locale === "ko" || item.locale === "en" || item.locale === "zh") {
      items[item.locale] = {
        name: item.name,
        colorway: item.colorway,
        description: item.description,
        frameSize: item.frame_size,
        sizeNote: item.size_note,
        frameMaterial: item.frame_material,
        lensMaterial: item.lens_material,
        lensFeatures: item.lens_features ?? []
      };
    }

    return items;
  }, {});

  return {
    id: row.id,
    slug: row.slug,
    modelCode: row.model_code,
    name: translation?.name ?? row.model_code,
    colorway: translation?.colorway || row.reference_color_name || null,
    description: translation?.description ?? null,
    translations,
    size: translation?.frame_size || row.size,
    sizeNote: translation?.size_note ?? null,
    frameMaterial: translation?.frame_material || row.frame_material,
    frameMaterialNote:
      translation?.frame_material && row.frame_material && translation.frame_material !== row.frame_material
        ? row.frame_material
        : null,
    lensMaterial: normalizedLens.material || null,
    lensMaterialNote:
      translation?.lens_material && row.lens_material && translation.lens_material !== row.lens_material
        ? row.lens_material
        : null,
    lensFeatures: normalizedLens.features,
    sharedFrameMaterial: row.frame_material,
    sharedLensMaterial: row.lens_material,
    featured: row.featured,
    sortOrder: row.sort_order,
    images: mapProductImages(row.product_images)
  };
}

export function parseProductLensText(value: string) {
  const parts = value
    .split(/\s*(?:\||\r?\n)\s*/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    material: parts[0] ?? "",
    features: parts.slice(1)
  };
}

export function formatProductLensText(material?: string | null, features: string[] = []) {
  const parts = [material, ...features]
    .flatMap((item) => (item ? item.split(/\s*(?:\||\r?\n)\s*/) : []))
    .map((item) => item.trim())
    .filter(Boolean);

  return [...new Set(parts)].join(" | ");
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
  frameMaterialNote?: string | null;
  lensMaterial: string | null;
  lensMaterialNote?: string | null;
  size: string | null;
  sizeNote?: string | null;
  lensFeatures: string[];
}): ProductDetailSection[] {
  const defaultLensFeatures = [
    "UV400 100% protection",
    "Anti-impact",
    "Anti-reflective coating",
    "Low haze <1.5%",
    "1.0g/cm³"
  ];
  const lensDetails = product.lensFeatures.length ? product.lensFeatures : defaultLensFeatures;

  return [
    {
      title: "Frame",
      eyebrow: "프레임 / Frame",
      primary: product.frameMaterial ?? "High-quality PC Frame (Polycarbonate)",
      ...(product.frameMaterialNote ? { secondary: product.frameMaterialNote } : {})
    },
    {
      title: "Lens",
      eyebrow: "렌즈 / Lens",
      primary: product.lensMaterial ?? "PA12 Nylon (Swiss EMS Grilamid TR90 LXS)",
      ...(product.lensMaterialNote ? { secondary: product.lensMaterialNote } : {}),
      detail: lensDetails.join(" / ")
    },
    {
      title: "Frame Size",
      eyebrow: "Frame Size",
      primary: product.size ?? "One size",
      ...(product.sizeNote ? { secondary: product.sizeNote } : {})
    }
  ];
}
