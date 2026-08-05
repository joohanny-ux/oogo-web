import { hasSupabaseEnv } from "@/lib/admin-content";
import { optimizeWebImage, replaceExtensionWithWebp, webImageInputTypes } from "@/lib/optimize-image";
import { describeStorageUploadError } from "@/lib/product-image-upload";
import type { SupabaseClient } from "@supabase/supabase-js";

const landingVideoTypes = ["video/mp4", "video/webm"] as const;
export const landingImageMaxBytes = 12 * 1024 * 1024;
export const landingVideoMaxBytes = 25 * 1024 * 1024;

function safePathPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeLandingContentType(contentType: string | null | undefined) {
  const raw = (contentType ?? "").split(";")[0]?.trim().toLowerCase() ?? "";
  if (raw === "image/jpg") return "image/jpeg";
  return raw;
}

export function validateLandingUpload(file: File) {
  const type = normalizeLandingContentType(file.type);
  const isImage = (webImageInputTypes as readonly string[]).includes(type);
  const isVideo = landingVideoTypes.includes(type as (typeof landingVideoTypes)[number]);

  if (!isImage && !isVideo) {
    return { ok: false as const, message: "JPG, PNG, WebP, MP4, WebM만 업로드할 수 있습니다." };
  }

  const maxSize = isVideo ? landingVideoMaxBytes : landingImageMaxBytes;
  if (file.size > maxSize) {
    return {
      ok: false as const,
      message: `${isVideo ? "동영상" : "이미지"} 최대 용량은 ${Math.round(maxSize / 1024 / 1024)}MB입니다.`
    };
  }

  return { ok: true as const, mediaType: isVideo ? ("video" as const) : ("image" as const) };
}

export async function uploadLandingMediaAsset(options: {
  supabase: SupabaseClient;
  bytes: ArrayBuffer;
  contentType: string;
  fileName: string;
  pageKey: string;
  slotKey: string;
}) {
  if (!hasSupabaseEnv()) {
    return { ok: false as const, message: "Supabase 연결 후 랜딩 미디어를 저장할 수 있습니다." };
  }

  const file = new File([options.bytes], options.fileName, { type: options.contentType });
  const validation = validateLandingUpload(file);
  if (!validation.ok) {
    return { ok: false as const, message: validation.message };
  }

  let uploadBody: Blob | Buffer = file;
  let contentType = normalizeLandingContentType(file.type);
  let storedName = safePathPart(options.fileName || `${options.slotKey}.jpg`);

  if (validation.mediaType === "image") {
    try {
      const optimized = await optimizeWebImage(options.bytes, "landing");
      uploadBody = Buffer.from(optimized.buffer);
      contentType = optimized.contentType;
      storedName = replaceExtensionWithWebp(storedName);
    } catch (error) {
      return {
        ok: false as const,
        message: error instanceof Error ? error.message : "이미지 최적화에 실패했습니다."
      };
    }
  }

  const path = `landing/${safePathPart(options.pageKey)}/${safePathPart(options.slotKey)}-${Date.now()}-${storedName}`;
  const { error: uploadError } = await options.supabase.storage.from("oogo-assets").upload(path, uploadBody, {
    contentType,
    upsert: false
  });

  if (uploadError) {
    return { ok: false as const, message: describeStorageUploadError(uploadError.message) };
  }

  const { data } = options.supabase.storage.from("oogo-assets").getPublicUrl(path);
  const publicUrl = data.publicUrl;

  const { data: existingAsset, error: existingAssetError } = await options.supabase
    .from("assets")
    .select("id")
    .eq("public_url", publicUrl)
    .maybeSingle();

  if (existingAssetError) {
    return { ok: false as const, message: describeStorageUploadError(existingAssetError.message) };
  }

  if (!existingAsset) {
    const { error: assetError } = await options.supabase.from("assets").insert({
      bucket: "oogo-assets",
      path,
      public_url: publicUrl,
      kind: "brand",
      alt: `${options.pageKey} ${options.slotKey} ${validation.mediaType}`
    });

    if (assetError) {
      return { ok: false as const, message: describeStorageUploadError(assetError.message) };
    }
  }

  return {
    ok: true as const,
    url: publicUrl,
    mediaType: validation.mediaType
  };
}
