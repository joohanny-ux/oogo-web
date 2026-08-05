"use server";

import { LOCALES, type Locale } from "@/lib/i18n";
import {
  hasSupabaseEnv,
  saveProduct,
  type AdminProductInput
} from "@/lib/admin-content";
import type { ProductSaveState } from "@/lib/admin-product-save";
import { getProductImageSlots, parseProductImageInputs, type ProductImageRole } from "@/lib/product-images";
import { describeStorageUploadError } from "@/lib/product-image-upload";

function readTranslation(formData: FormData, locale: Locale) {
  return {
    name: String(formData.get(`${locale}.name`) ?? ""),
    frame: String(formData.get(`${locale}.frame`) ?? ""),
    lens: String(formData.get(`${locale}.lens`) ?? ""),
    frameSize: String(formData.get(`${locale}.frameSize`) ?? ""),
    frameSizeNote: String(formData.get(`${locale}.frameSizeNote`) ?? ""),
    color: String(formData.get(`${locale}.color`) ?? "")
  };
}

export async function saveProductAction(
  _prevState: ProductSaveState,
  formData: FormData
): Promise<ProductSaveState> {
  try {
    if (!hasSupabaseEnv()) {
      return { ok: false, message: "Supabase environment variables are not configured." };
    }

    const translations = Object.fromEntries(
      LOCALES.map((locale) => [locale, readTranslation(formData, locale)])
    ) as AdminProductInput["translations"];
    const slug = String(formData.get("slug") ?? "").trim();
    const modelCode = String(formData.get("modelCode") ?? "").trim();

    if (!modelCode) {
      return { ok: false, message: "OOGO No.를 입력해 주세요." };
    }

    if (!slug) {
      return { ok: false, message: "Slug를 입력해 주세요." };
    }

    if (!translations.ko.name.trim()) {
      return { ok: false, message: "한국어 상품명은 필수입니다." };
    }

    // Image binaries are uploaded via /api/admin/products/upload before submit.
    // The server action only persists already-hosted URLs to avoid sharp crashes in actions.
    const imageValues: Partial<Record<ProductImageRole, string>> = {};
    for (const slot of getProductImageSlots()) {
      imageValues[slot.role] = String(formData.get(`image.${slot.role}`) ?? "");
    }

    const images = parseProductImageInputs(imageValues);
    const result = await saveProduct({
      id: String(formData.get("id") || "") || undefined,
      modelCode,
      slug,
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      images,
      translations
    });

    if (!result.ok) {
      return { ok: false, message: describeStorageUploadError(result.message) };
    }

    return {
      ok: true,
      message: "상품이 저장되었습니다.",
      redirectTo: "/admin/products"
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "상품 저장 중 오류가 발생했습니다.";
    return { ok: false, message: describeStorageUploadError(message) };
  }
}
