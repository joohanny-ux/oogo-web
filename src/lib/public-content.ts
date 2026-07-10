import type { Locale } from "@/lib/i18n";
import { mapProductRow, type ProductImages, type ProductRow, type PublicProduct } from "@/lib/products";
import { initialProducts } from "@/lib/seed-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function fallbackProducts(locale: Locale): PublicProduct[] {
  return initialProducts.map((product, index) => ({
    id: product.modelCode,
    slug: product.slug,
    modelCode: product.modelCode,
    name: product.translations[locale]?.name ?? product.translations.ko.name,
    colorway: product.translations[locale]?.colorway ?? null,
    description: product.translations[locale]?.description ?? product.translations.ko.description,
    translations: product.translations,
    size: product.size,
    sizeNote: null,
    frameMaterial: product.frameMaterial,
    frameMaterialNote: null,
    lensMaterial: product.lensMaterial,
    lensMaterialNote: null,
    lensFeatures: product.lensFeatures,
    sharedFrameMaterial: product.frameMaterial,
    sharedLensMaterial: product.lensMaterial,
    featured: index < 3,
    sortOrder: index,
    images: {} as ProductImages
  }));
}

const productSelect =
  "id, slug, model_code, size, frame_material, lens_material, lens_features, published, featured, sort_order, product_translations(locale, name, colorway, description, size_note, frame_material, lens_material, lens_features), product_images(role, assets(public_url, alt))";

export async function getFeaturedProducts(locale: Locale) {
  if (!hasSupabaseEnv()) {
    return fallbackProducts(locale).filter((product) => product.featured);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("published", true)
    .eq("featured", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ProductRow[]).map((row) => mapProductRow(row, locale));
}

export async function getPublishedProducts(locale: Locale) {
  if (!hasSupabaseEnv()) {
    return fallbackProducts(locale);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ProductRow[]).map((row) => mapProductRow(row, locale));
}

export async function getProductBySlug(slug: string, locale: Locale) {
  if (!hasSupabaseEnv()) {
    return fallbackProducts(locale).find((product) => product.slug === slug) ?? null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("published", true)
    .eq("slug", slug)
    .single();

  if (error) {
    return null;
  }

  return mapProductRow(data as ProductRow, locale);
}

export async function getLandingBlocks(locale: Locale) {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("landing_blocks")
    .select("page_key, block_key, locale, published_content")
    .eq("locale", locale)
    .eq("published", true);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
