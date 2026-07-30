"use server";

import { redirect } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/i18n";
import {
  hasSupabaseEnv,
  saveProduct,
  type AdminProductInput
} from "@/lib/admin-content";
import type { ProductSaveState } from "@/lib/admin-product-save";
import { getProductImageSlots, parseProductImageInputs, type ProductImageRole } from "@/lib/product-images";
import { optimizeWebImage, replaceExtensionWithWebp, webImageInputTypes } from "@/lib/optimize-image";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return typeof File !== "undefined" && value instanceof File && value.size > 0;
}

function safePathPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function describeUploadError(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("402") || lower.includes("quota") || lower.includes("exceed") || lower.includes("payment")) {
    return "Supabase 사용량 한도로 이미지 업로드가 차단되었습니다. Usage/플랜을 확인한 뒤 다시 시도해 주세요.";
  }

  if (lower.includes("row-level security") || lower.includes("rls") || lower.includes("not allowed") || lower.includes("unauthorized")) {
    return "이미지 업로드 권한이 없습니다. 관리자 로그인과 Storage 정책을 확인해 주세요.";
  }

  return message;
}

async function uploadProductImageFile(file: File, role: ProductImageRole, slug: string, modelCode: string) {
  if (!hasSupabaseEnv()) {
    return {
      ok: false as const,
      message: "Supabase environment variables are not configured. Connect Supabase before uploading product images."
    };
  }

  if (!(webImageInputTypes as readonly string[]).includes(file.type)) {
    return { ok: false as const, message: `${role} image must be JPG, PNG, or WebP.` };
  }

  let optimized;
  try {
    optimized = await optimizeWebImage(await file.arrayBuffer(), "product");
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : `${role} image optimization failed.`
    };
  }

  const supabase = await createSupabaseServerClient();
  const productKey = safePathPart(slug || modelCode || "product");
  const fileName = replaceExtensionWithWebp(safePathPart(file.name || `${role}.webp`));
  const path = `products/${productKey}/${role}-${Date.now()}-${fileName}`;
  const { error } = await supabase.storage.from("oogo-assets").upload(path, optimized.buffer, {
    contentType: optimized.contentType,
    upsert: false
  });

  if (error) {
    return { ok: false as const, message: describeUploadError(error.message) };
  }

  const { data } = supabase.storage.from("oogo-assets").getPublicUrl(path);
  return {
    ok: true as const,
    bucket: "oogo-assets",
    path,
    url: data.publicUrl
  };
}

export async function saveProductAction(
  _prevState: ProductSaveState,
  formData: FormData
): Promise<ProductSaveState> {
  try {
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

    const imageValues: Partial<Record<ProductImageRole, string>> = {};
    const imageStorageMeta: Partial<Record<ProductImageRole, { bucket: string; path: string }>> = {};

    for (const slot of getProductImageSlots()) {
      imageValues[slot.role] = String(formData.get(`image.${slot.role}`) ?? "");
      const file = formData.get(`imageFile.${slot.role}`);

      if (isUploadFile(file)) {
        const upload = await uploadProductImageFile(file, slot.role, slug, modelCode);
        if (!upload.ok) {
          return { ok: false, message: upload.message };
        }

        imageValues[slot.role] = upload.url;
        imageStorageMeta[slot.role] = {
          bucket: upload.bucket,
          path: upload.path
        };
      }
    }

    const images = parseProductImageInputs(imageValues).map((image) => ({
      ...image,
      bucket: imageStorageMeta[image.role]?.bucket,
      path: imageStorageMeta[image.role]?.path
    }));

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
      return { ok: false, message: result.message };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "상품 저장 중 오류가 발생했습니다.";
    return { ok: false, message: describeUploadError(message) };
  }

  redirect("/admin/products");
}
