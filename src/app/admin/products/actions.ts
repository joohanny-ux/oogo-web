"use server";

import { redirect } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/i18n";
import {
  getProductImageSlots,
  parseProductImageInputs,
  saveProduct,
  type AdminProductInput,
  type ProductImageRole
} from "@/lib/admin-content";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function readTranslation(formData: FormData, locale: Locale) {
  return {
    name: String(formData.get(`${locale}.name`) ?? ""),
    colorway: String(formData.get(`${locale}.colorway`) ?? ""),
    description: String(formData.get(`${locale}.description`) ?? "")
  };
}

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

function safePathPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uploadProductImageFile(file: File, role: ProductImageRole, slug: string, modelCode: string) {
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false as const, message: `${role} image is over 5MB.` };
  }

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return { ok: false as const, message: `${role} image must be JPG, PNG, or WebP.` };
  }

  const supabase = await createSupabaseServerClient();
  const productKey = safePathPart(slug || modelCode || "product");
  const fileName = safePathPart(file.name || `${role}.jpg`);
  const path = `products/${productKey}/${role}-${Date.now()}-${fileName}`;
  const { error } = await supabase.storage.from("oogo-assets").upload(path, file, {
    contentType: file.type,
    upsert: false
  });

  if (error) {
    return { ok: false as const, message: error.message };
  }

  const { data } = supabase.storage.from("oogo-assets").getPublicUrl(path);
  return {
    ok: true as const,
    bucket: "oogo-assets",
    path,
    url: data.publicUrl
  };
}

export async function saveProductAction(formData: FormData) {
  const translations = Object.fromEntries(
    LOCALES.map((locale) => [locale, readTranslation(formData, locale)])
  ) as AdminProductInput["translations"];
  const slug = String(formData.get("slug") ?? "");
  const modelCode = String(formData.get("modelCode") ?? "");
  const imageValues: Partial<Record<ProductImageRole, string>> = {};
  const imageStorageMeta: Partial<Record<ProductImageRole, { bucket: string; path: string }>> = {};

  for (const slot of getProductImageSlots()) {
    imageValues[slot.role] = String(formData.get(`image.${slot.role}`) ?? "");
    const file = formData.get(`imageFile.${slot.role}`);

    if (isUploadFile(file)) {
      const upload = await uploadProductImageFile(file, slot.role, slug, modelCode);
      if (!upload.ok) {
        throw new Error(upload.message);
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
    size: String(formData.get("size") ?? ""),
    frameMaterial: String(formData.get("frameMaterial") ?? ""),
    lensMaterial: String(formData.get("lensMaterial") ?? ""),
    lensFeaturesText: String(formData.get("lensFeaturesText") ?? ""),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    images,
    translations
  });

  if (!result.ok) {
    throw new Error(result.message);
  }

  redirect("/admin/products");
}
