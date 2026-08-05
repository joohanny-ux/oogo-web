"use server";

import { redirect } from "next/navigation";
import { normalizeLocale } from "@/lib/i18n";
import { hasSupabaseEnv, publishLandingBlock, saveLandingBlockDraft } from "@/lib/admin-content";
import {
  readHeroSlidesFields,
  readLandingContentFields,
  readSocialLinksFields
} from "@/lib/landing-content-fields";

async function saveLandingBlock(formData: FormData) {
  const pageKey = String(formData.get("pageKey") ?? "home");
  const blockKey = String(formData.get("blockKey") ?? "main");
  const hasMediaControl = formData.has("mediaType") || formData.has("mediaUrl");
  const media = hasMediaControl
    ? {
        mediaType: String(formData.get("mediaType") ?? "image"),
        mediaUrl: String(formData.get("mediaUrl") ?? formData.get("imageUrl") ?? "")
      }
    : undefined;
  const content = readLandingContentFields(formData, media);

  if (pageKey === "home" && blockKey === "hero" && formData.has("slide1MediaType")) {
    content.slides = readHeroSlidesFields(formData);
    if (!Array.isArray(content.slides) || content.slides.length === 0) {
      delete content.slides;
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
