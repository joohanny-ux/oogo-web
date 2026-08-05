import { hasSupabaseEnv } from "@/lib/admin-content";
import { optimizeWebImage, replaceExtensionWithWebp, webImageInputTypes } from "@/lib/optimize-image";
import type { ProductImageRole } from "@/lib/product-images";
import type { SupabaseClient } from "@supabase/supabase-js";

function safePathPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function describeStorageUploadError(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("402") || lower.includes("quota") || lower.includes("exceed") || lower.includes("payment")) {
    return "Supabase 사용량 한도로 이미지 업로드가 차단되었습니다. Usage/플랜을 확인한 뒤 다시 시도해 주세요.";
  }

  if (lower.includes("row-level security") || lower.includes("rls") || lower.includes("not allowed") || lower.includes("unauthorized")) {
    return "이미지 업로드 권한이 없습니다. 관리자 로그인과 Storage 정책을 확인해 주세요.";
  }

  return message;
}

export async function uploadOptimizedProductImage(options: {
  supabase: SupabaseClient;
  bytes: ArrayBuffer;
  contentType: string;
  fileName: string;
  role: ProductImageRole;
  slug: string;
  modelCode: string;
}) {
  if (!hasSupabaseEnv()) {
    return {
      ok: false as const,
      message: "Supabase environment variables are not configured. Connect Supabase before uploading product images."
    };
  }

  if (!(webImageInputTypes as readonly string[]).includes(options.contentType)) {
    return { ok: false as const, message: `${options.role} image must be JPG, PNG, or WebP.` };
  }

  let optimized;
  try {
    optimized = await optimizeWebImage(options.bytes, "product");
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : `${options.role} image optimization failed.`
    };
  }

  const productKey = safePathPart(options.slug || options.modelCode || "product");
  const fileName = replaceExtensionWithWebp(safePathPart(options.fileName || `${options.role}.webp`));
  const path = `products/${productKey}/${options.role}-${Date.now()}-${fileName}`;
  const { error } = await options.supabase.storage.from("oogo-assets").upload(path, Buffer.from(optimized.buffer), {
    contentType: optimized.contentType,
    upsert: false
  });

  if (error) {
    return { ok: false as const, message: describeStorageUploadError(error.message) };
  }

  const { data } = options.supabase.storage.from("oogo-assets").getPublicUrl(path);
  return {
    ok: true as const,
    bucket: "oogo-assets" as const,
    path,
    url: data.publicUrl,
    bytes: optimized.bytes,
    sourceBytes: optimized.sourceBytes
  };
}
