"use server";

import { normalizeLocale } from "@/lib/i18n";
import { hasSupabaseEnv, publishLandingBlock, saveLandingBlockDraft } from "@/lib/admin-content";
import { readLandingContentFields } from "@/lib/landing-content-fields";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

export async function uploadLandingMediaFile(file: File, pageKey: string, blockKey: string) {
  if (!hasSupabaseEnv()) {
    return {
      ok: false as const,
      message: "Supabase environment variables are not configured. Connect Supabase before uploading landing media."
    };
  }

  const isImage = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  const isVideo = ["video/mp4", "video/webm"].includes(file.type);
  const maxSize = isVideo ? 25 * 1024 * 1024 : 8 * 1024 * 1024;

  if (!isImage && !isVideo) {
    return { ok: false as const, message: "Hero media must be JPG, PNG, WebP, MP4, or WebM." };
  }

  if (file.size > maxSize) {
    return { ok: false as const, message: `Hero ${isVideo ? "video" : "image"} is over ${isVideo ? "25MB" : "8MB"}.` };
  }

  const supabase = await createSupabaseServerClient();
  const fileName = safePathPart(file.name || `${blockKey}.${isVideo ? "mp4" : "jpg"}`);
  const path = `landing/${safePathPart(pageKey)}/${safePathPart(blockKey)}-${Date.now()}-${fileName}`;
  const { error } = await supabase.storage.from("oogo-assets").upload(path, file, {
    contentType: file.type,
    upsert: false
  });

  if (error) {
    return { ok: false as const, message: error.message };
  }

  const { data } = supabase.storage.from("oogo-assets").getPublicUrl(path);
  const publicUrl = data.publicUrl;

  const { data: existingAsset, error: existingAssetError } = await supabase
    .from("assets")
    .select("id")
    .eq("public_url", publicUrl)
    .maybeSingle();

  if (existingAssetError) {
    return { ok: false as const, message: existingAssetError.message };
  }

  if (!existingAsset) {
    const { error: assetError } = await supabase.from("assets").insert({
      bucket: "oogo-assets",
      path,
      public_url: publicUrl,
      kind: "brand",
      alt: `${pageKey} ${blockKey} ${isVideo ? "video" : "image"}`
    });

    if (assetError) {
      return { ok: false as const, message: assetError.message };
    }
  }

  return {
    ok: true as const,
    url: publicUrl,
    mediaType: isVideo ? "video" : "image"
  };
}

export async function saveLandingBlockAction(formData: FormData) {
  const pageKey = String(formData.get("pageKey") ?? "home");
  const blockKey = String(formData.get("blockKey") ?? "main");
  const mediaFile = formData.get("mediaFile");
  const mediaUpload = isUploadFile(mediaFile) ? await uploadLandingMediaFile(mediaFile, pageKey, blockKey) : null;

  if (mediaUpload && !mediaUpload.ok) {
    throw new Error(mediaUpload.message);
  }

  const hasMediaControl = Boolean(mediaUpload) || formData.has("mediaType") || formData.has("mediaUrl");
  const media = hasMediaControl
    ? {
        mediaType: mediaUpload?.mediaType ?? String(formData.get("mediaType") ?? "image"),
        mediaUrl: mediaUpload?.url ?? String(formData.get("mediaUrl") ?? formData.get("imageUrl") ?? "")
      }
    : undefined;

  const result = await saveLandingBlockDraft({
    id: String(formData.get("id") || "") || undefined,
    pageKey,
    locale: normalizeLocale(String(formData.get("locale") ?? "ko")),
    blockKey,
    content: readLandingContentFields(formData, media)
  });

  if (!result.ok) {
    throw new Error(result.message);
  }
}

export async function publishLandingBlockAction(formData: FormData) {
  const result = await publishLandingBlock(String(formData.get("id") ?? ""));

  if (!result.ok) {
    throw new Error(result.message);
  }
}
