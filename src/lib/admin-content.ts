import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/i18n";
import { getProductCatalogHref, getProductDetailHref } from "@/lib/products";
import { getProductImageSlots, type ProductImageInput } from "@/lib/product-images";

export const landingPageOptions = [
  { key: "header", label: "Header" },
  { key: "home", label: "Home" },
  { key: "brand-story", label: "Brand Story" },
  { key: "collection", label: "Collection" },
  { key: "product-detail", label: "Product Detail" },
  { key: "special-edition", label: "Special Edition" },
  { key: "inquiry", label: "Inquiry" },
  { key: "footer", label: "Footer" }
] as const;

const sampleProductSlug = "og26001c2-sunset-stroll";

export function getLandingEditorPages(): Array<{
  key: (typeof landingPageOptions)[number]["key"];
  label: string;
  publicHref: string;
  routeLabel: string;
  surface: string;
  description: string;
}> {
  return [
    {
      key: "header",
      label: "Header",
      publicHref: "/",
      routeLabel: "Global",
      surface: "Site chrome",
      description: "로고, 메인 메뉴, 언어 선택과 주요 링크를 관리합니다."
    },
    {
      key: "home",
      label: "Home",
      publicHref: "/",
      routeLabel: "/",
      surface: "Homepage",
      description: "Hero, Collection, Project, Archive와 Inquiry 연결 영역을 관리합니다."
    },
    {
      key: "brand-story",
      label: "Brand Story",
      publicHref: "/brand",
      routeLabel: "/brand",
      surface: "Brand page",
      description: "브랜드 Hero, 철학 문구, 이미지 구성과 Collection CTA를 관리합니다."
    },
    {
      key: "collection",
      label: "Collection",
      publicHref: getProductCatalogHref(),
      routeLabel: getProductCatalogHref(),
      surface: "Collection page",
      description: "카탈로그 소개, 상품 목록 안내와 Collection CTA를 관리합니다."
    },
    {
      key: "product-detail",
      label: "Product Detail",
      publicHref: getProductDetailHref(sampleProductSlug),
      routeLabel: "/products/[slug]",
      surface: "Product detail",
      description: "상품 상세 공통 라벨, Buyer CTA와 관련 문구를 관리합니다."
    },
    {
      key: "special-edition",
      label: "Special",
      publicHref: "/projects/youngbin-edition",
      routeLabel: "/projects/youngbin-edition",
      surface: "Project detail",
      description: "프로젝트 Hero, 캠페인 이야기와 협업 안내를 관리합니다."
    },
    {
      key: "inquiry",
      label: "Inquiry",
      publicHref: "/inquiry",
      routeLabel: "/inquiry",
      surface: "Inquiry page",
      description: "문의 소개, 유형 안내와 입력 도움말을 관리합니다."
    },
    {
      key: "footer",
      label: "Footer",
      publicHref: "/",
      routeLabel: "Global",
      surface: "Site footer",
      description: "브랜드 문구, 연락처, SNS와 법적 고지 링크를 관리합니다."
    }
  ];
}

export type AdminProductInput = {
  id?: string;
  modelCode: string;
  slug: string;
  size: string;
  featured: boolean;
  published: boolean;
  images: ProductImageInput[];
  translations: Record<
    Locale,
    {
      name: string;
      colorway: string;
      description: string;
      sizeNote: string;
      frameMaterial: string;
      lensMaterial: string;
      lensFeaturesText: string;
    }
  >;
};

export function parseLensFeatures(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getAdminProducts() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, model_code, published, featured, sort_order, product_translations(locale, name), product_images(role, assets(public_url))")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export type AdminDashboardSummary = {
  products: number;
  publishedProducts: number;
  openInquiries: number;
};

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  if (!hasSupabaseEnv()) {
    return { products: 0, publishedProducts: 0, openInquiries: 0 };
  }

  const supabase = await createSupabaseServerClient();
  const [productsResult, publishedResult, inquiriesResult] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).neq("status", "closed")
  ]);

  const error = productsResult.error ?? publishedResult.error ?? inquiriesResult.error;
  if (error) {
    throw new Error(error.message);
  }

  return {
    products: productsResult.count ?? 0,
    publishedProducts: publishedResult.count ?? 0,
    openInquiries: inquiriesResult.count ?? 0
  };
}

export async function getAdminProduct(id: string) {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, model_code, size, frame_material, lens_material, lens_features, published, featured, product_translations(locale, name, colorway, description, size_note, frame_material, lens_material, lens_features), product_images(role, assets(id, public_url, path, alt))"
    )
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function saveProduct(input: AdminProductInput) {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase environment variables are not configured." };
  }

  const supabase = await createSupabaseServerClient();
  let productId = input.id;

  if (input.slug) {
    const { data: productWithSlug, error: slugReadError } = await supabase
      .from("products")
      .select("id")
      .eq("slug", input.slug)
      .maybeSingle();

    if (slugReadError) {
      return { ok: false, message: slugReadError.message };
    }

    if (productWithSlug && input.id && productWithSlug.id !== input.id) {
      return { ok: false, message: `Slug "${input.slug}" is already used by another product.` };
    }

    if (productWithSlug && !input.id) {
      productId = productWithSlug.id;
    }
  }

  const productPayload = {
    id: productId,
    slug: input.slug,
    model_code: input.modelCode,
    size: input.size || null,
    frame_material: input.translations.ko.frameMaterial || null,
    lens_material: input.translations.ko.lensMaterial || null,
    lens_features: parseLensFeatures(input.translations.ko.lensFeaturesText),
    featured: input.featured,
    published: input.published
  };

  const { data: product, error: productError } = await supabase
    .from("products")
    .upsert(productPayload)
    .select("id")
    .single();

  if (productError) {
    return { ok: false, message: productError.message };
  }

  const translationRows = (Object.keys(input.translations) as Locale[]).map((locale) => ({
    product_id: product.id,
    locale,
    name: input.translations[locale].name,
    colorway: input.translations[locale].colorway || null,
    description: input.translations[locale].description || null,
    size_note: input.translations[locale].sizeNote || null,
    frame_material: input.translations[locale].frameMaterial || null,
    lens_material: input.translations[locale].lensMaterial || null,
    lens_features: parseLensFeatures(input.translations[locale].lensFeaturesText)
  }));

  const { error: translationError } = await supabase.from("product_translations").upsert(translationRows);
  if (translationError) {
    return { ok: false, message: translationError.message };
  }

  const imageResult = await saveProductImages(product.id, input.images);
  if (!imageResult.ok) {
    return imageResult;
  }

  revalidatePath("/admin/products");
  revalidatePath(getProductCatalogHref());
  revalidatePath(getProductDetailHref(input.slug));
  return { ok: true, message: "Product saved." };
}

async function saveProductImages(productId: string, images: ProductImageInput[]) {
  const supabase = await createSupabaseServerClient();
  const roles = getProductImageSlots().map((slot) => slot.role);
  const { error: deleteError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", productId)
    .in("role", roles);

  if (deleteError) {
    return { ok: false, message: deleteError.message };
  }

  for (const [index, image] of images.entries()) {
    const slot = getProductImageSlots().find((item) => item.role === image.role);
    const { data: existingAsset, error: existingAssetError } = await supabase
      .from("assets")
      .select("id")
      .eq("public_url", image.url)
      .maybeSingle();

    if (existingAssetError) {
      return { ok: false, message: existingAssetError.message };
    }

    let asset = existingAsset;
    if (!asset) {
      const { data: insertedAsset, error: assetError } = await supabase
        .from("assets")
        .insert({
          bucket: image.bucket ?? "external-url",
          path: image.path ?? image.url,
          public_url: image.url,
          kind: "product",
          alt: slot ? `${slot.label} product image` : "Product image"
        })
        .select("id")
        .single();

      if (assetError) {
        return { ok: false, message: assetError.message };
      }

      asset = insertedAsset;
    }

    const { error: imageError } = await supabase.from("product_images").insert({
      product_id: productId,
      asset_id: asset.id,
      role: image.role,
      sort_order: index
    });

    if (imageError) {
      return { ok: false, message: imageError.message };
    }
  }

  return { ok: true, message: "Product images saved." };
}

export async function setProductPublished(id: string, published: boolean) {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase environment variables are not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").update({ published }).eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath(getProductCatalogHref());
  return { ok: true, message: "Product visibility updated." };
}

export async function getLandingBlocksForPage(pageKey: string, locale: Locale) {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("landing_blocks")
    .select("id, page_key, block_key, locale, draft_content, published_content, published, updated_at")
    .eq("page_key", pageKey)
    .eq("locale", locale)
    .order("block_key", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function saveLandingBlockDraft(input: {
  id?: string;
  pageKey: string;
  blockKey: string;
  locale: Locale;
  content: Record<string, unknown>;
}) {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase environment variables are not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("landing_blocks").upsert({
    id: input.id,
    page_key: input.pageKey,
    block_key: input.blockKey,
    locale: input.locale,
    draft_content: input.content,
    published: false
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/landing");
  return { ok: true, message: "Draft saved." };
}

export async function publishLandingBlock(id: string) {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase environment variables are not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error: readError } = await supabase
    .from("landing_blocks")
    .select("draft_content")
    .eq("id", id)
    .single();

  if (readError) {
    return { ok: false, message: readError.message };
  }

  const { error: updateError } = await supabase
    .from("landing_blocks")
    .update({ published_content: data.draft_content, published: true })
    .eq("id", id);

  if (updateError) {
    return { ok: false, message: updateError.message };
  }

  revalidatePath("/");
  revalidatePath(getProductCatalogHref());
  revalidatePath("/admin/landing");
  return { ok: true, message: "Block published." };
}

export async function getAdminInquiries() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("id, type, status, name, company, country, email, phone, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function updateInquiryStatus(id: string, status: "open" | "in_progress" | "closed") {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase environment variables are not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/inquiries");
  return { ok: true, message: "Inquiry status updated." };
}

export async function getCompanySettings() {
  if (!hasSupabaseEnv()) {
    return {
      settings: null,
      translations: []
    };
  }

  const supabase = await createSupabaseServerClient();
  const [{ data: settings, error: settingsError }, { data: translations, error: translationsError }] = await Promise.all([
    supabase.from("company_settings").select("email, phone, kakao, instagram, facebook, tiktok, address").single(),
    supabase.from("company_translations").select("locale, brand_description, footer_note")
  ]);

  if (settingsError && settingsError.code !== "PGRST116") {
    throw new Error(settingsError.message);
  }

  if (translationsError) {
    throw new Error(translationsError.message);
  }

  return {
    settings,
    translations: translations ?? []
  };
}

export async function saveCompanySettings(input: {
  email: string;
  phone: string;
  kakao: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  address: string;
  translations: Record<Locale, { brandDescription: string; footerNote: string }>;
}) {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase environment variables are not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { error: settingsError } = await supabase.from("company_settings").upsert({
    id: true,
    email: input.email || null,
    phone: input.phone || null,
    kakao: input.kakao || null,
    instagram: input.instagram || null,
    facebook: input.facebook || null,
    tiktok: input.tiktok || null,
    address: input.address || null
  });

  if (settingsError) {
    return { ok: false, message: settingsError.message };
  }

  const translationRows = (Object.keys(input.translations) as Locale[]).map((locale) => ({
    locale,
    brand_description: input.translations[locale].brandDescription,
    footer_note: input.translations[locale].footerNote
  }));
  const { error: translationError } = await supabase.from("company_translations").upsert(translationRows);

  if (translationError) {
    return { ok: false, message: translationError.message };
  }

  revalidatePath("/admin/company");
  revalidatePath("/");
  return { ok: true, message: "Company settings saved." };
}
