import type { Locale } from "@/lib/i18n";
import { applyLandingMediaFromSource, getLandingPageContent, type LandingContent } from "@/lib/home-landing";
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
  "id, slug, model_code, size, reference_color_name, frame_material, lens_material, lens_features, published, featured, sort_order, product_translations(locale, name, colorway, description, frame_size, size_note, frame_material, lens_material, lens_features), product_images(role, assets(public_url, alt))";

export async function getFeaturedProducts(locale: Locale) {
  if (!hasSupabaseEnv()) {
    return fallbackProducts(locale).filter((product) => product.featured);
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select(productSelect)
      .eq("published", true)
      .eq("featured", true)
      .order("sort_order", { ascending: true });

    if (error) {
      return fallbackProducts(locale).filter((product) => product.featured);
    }

    return ((data ?? []) as ProductRow[]).map((row) => mapProductRow(row, locale));
  } catch {
    return fallbackProducts(locale).filter((product) => product.featured);
  }
}

export async function getPublishedProducts(locale: Locale) {
  if (!hasSupabaseEnv()) {
    return fallbackProducts(locale);
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select(productSelect)
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      return fallbackProducts(locale);
    }

    return ((data ?? []) as ProductRow[]).map((row) => mapProductRow(row, locale));
  } catch {
    return fallbackProducts(locale);
  }
}

export async function getProductBySlug(slug: string, locale: Locale) {
  if (!hasSupabaseEnv()) {
    return fallbackProducts(locale).find((product) => product.slug === slug) ?? null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select(productSelect)
      .eq("published", true)
      .eq("slug", slug)
      .single();

    if (error) {
      return fallbackProducts(locale).find((product) => product.slug === slug) ?? null;
    }

    return mapProductRow(data as ProductRow, locale);
  } catch {
    return fallbackProducts(locale).find((product) => product.slug === slug) ?? null;
  }
}

export async function getLandingBlocks(locale: Locale) {
  if (!hasSupabaseEnv()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("landing_blocks")
      .select("page_key, block_key, locale, published_content")
      .eq("locale", locale)
      .eq("published", true);

    return error ? [] : data ?? [];
  } catch {
    return [];
  }
}

/** Locale copy with KO shared media for EN/ZH public pages. */
export async function getLandingPageContentForLocale(pageKey: string, locale: Locale): Promise<Record<string, LandingContent>> {
  const localeContent = getLandingPageContent(await getLandingBlocks(locale), pageKey);
  if (locale === "ko") {
    return localeContent;
  }

  const koContent = getLandingPageContent(await getLandingBlocks("ko"), pageKey);
  return applyLandingMediaFromSource(localeContent, koContent);
}
