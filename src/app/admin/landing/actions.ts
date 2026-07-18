"use server";

import { redirect } from "next/navigation";
import { normalizeLocale } from "@/lib/i18n";
import { hasSupabaseEnv, publishLandingBlock, saveLandingBlockDraft } from "@/lib/admin-content";
import {
  readHeroSlidesFields,
  readLandingContentFields,
  readSocialLinksFields,
  type UploadedHeroMedia
} from "@/lib/landing-content-fields";
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
    mediaType: isVideo ? ("video" as const) : ("image" as const)
  };
}

async function saveLandingBlock(formData: FormData) {
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
  const content = readLandingContentFields(formData, media);

  if (pageKey === "home" && blockKey === "hero" && formData.has("slide1MediaType")) {
    const uploadedSlides: Partial<Record<number, UploadedHeroMedia>> = {};

    for (let number = 1; number <= 5; number += 1) {
      const slideFile = formData.get(`slide${number}File`);
      if (!isUploadFile(slideFile)) continue;

      const upload = await uploadLandingMediaFile(slideFile, pageKey, `${blockKey}-slide-${number}`);
      if (!upload.ok) {
        throw new Error(upload.message);
      }
      uploadedSlides[number] = {
        mediaType: upload.mediaType,
        mediaUrl: upload.url
      };
    }

    content.slides = readHeroSlidesFields(formData, uploadedSlides);
    if (!Array.isArray(content.slides) || content.slides.length === 0) {
      delete content.slides;
    }
  }

  const hasGalleryControl = Array.from({ length: 6 }, (_, index) => index + 1).some(
    (number) => formData.has(`image${number}Url`) || formData.has(`image${number}File`)
  );
  if (hasGalleryControl) {
    for (let number = 1; number <= 6; number += 1) {
      const imageFile = formData.get(`image${number}File`);
      if (!isUploadFile(imageFile)) continue;
      if (!["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)) {
        throw new Error("Archive gallery files must be JPG, PNG, or WebP images.");
      }

      const upload = await uploadLandingMediaFile(imageFile, pageKey, `${blockKey}-image-${number}`);
      if (!upload.ok) {
        throw new Error(upload.message);
      }
      content[`image${number}Url`] = upload.url;
    }
  }

  if (pageKey === "footer" && blockKey === "contact-legal" && formData.has("socialLinksManaged")) {
    content.socialLinks = readSocialLinksFields(formData);
  }

  const result = await saveLandingBlockDraft({
    id: String(formData.get("id") || "") || undefined,
    pageKey,
    locale: normalizeLocale(String(formData.get("locale") ?? "ko")),
    blockKey,
    content
  });

  if (!result.ok) {
    throw new Error(result.message);
  }

  return result;
}

function landingEditorRedirect(formData: FormData, status: "saved" | "published") {
  const pageKey = String(formData.get("pageKey") ?? "home");
  const locale = normalizeLocale(String(formData.get("locale") ?? "ko"));
  const blockKey = String(formData.get("blockKey") ?? "").trim();
  const blockQuery = blockKey ? `&block=${encodeURIComponent(blockKey)}` : "";
  redirect(`/admin/landing?page=${encodeURIComponent(pageKey)}&locale=${locale}&status=${status}${blockQuery}${blockKey ? `#landing-block-${encodeURIComponent(blockKey)}` : ""}`);
}

export async function saveLandingBlockAction(formData: FormData) {
  await saveLandingBlock(formData);
  landingEditorRedirect(formData, "saved");
}

export async function saveAndPublishLandingBlockAction(formData: FormData) {
  const saveResult = await saveLandingBlock(formData);
  const publishResult = await publishLandingBlock(saveResult.id);

  if (!publishResult.ok) {
    throw new Error(publishResult.message);
  }

  // Toolbar may call this for many sections; only redirect when submitted as a form action.
  if (formData.get("_batch") !== "1") {
    landingEditorRedirect(formData, "published");
  }
}

export async function publishLandingBlockAction(formData: FormData) {
  const result = await publishLandingBlock(String(formData.get("id") ?? ""));

  if (!result.ok) {
    throw new Error(result.message);
  }

  landingEditorRedirect(formData, "published");
}
