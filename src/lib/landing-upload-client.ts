"use client";

import { CLIENT_MAX_EDGE, prepareClientUploadImage } from "@/lib/prepare-client-upload-image";

type UploadResult = {
  url: string;
  mediaType: "image" | "video";
};

async function uploadLandingFile(file: File, pageKey: string, slotKey: string): Promise<UploadResult> {
  const isVideo = ["video/mp4", "video/webm"].includes(file.type.toLowerCase());
  const prepared = isVideo ? file : await prepareClientUploadImage(file, CLIENT_MAX_EDGE.landing, slotKey);
  const response = await fetch("/api/admin/landing/upload", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "content-type": prepared.type || file.type || "application/octet-stream",
      "x-landing-page-key": pageKey,
      "x-landing-slot-key": slotKey,
      "x-landing-file-name": encodeURIComponent(file.name)
    },
    body: prepared
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as { message?: string } | null;
    const detail = result?.message?.trim();
    throw new Error(
      detail ||
        `${file.name} 파일을 저장하지 못했습니다. (HTTP ${response.status}${
          response.status === 413 ? " · 파일이 서버 전송 한도(약 4MB)를 초과했습니다" : ""
        })`
    );
  }

  const payload = (await response.json()) as UploadResult;
  return payload;
}

export async function buildLandingSubmitFormData(form: HTMLFormElement, pageKey: string, blockKey: string) {
  const formData = new FormData(form);

  const mediaFile = formData.get("mediaFile");
  if (mediaFile instanceof File && mediaFile.size > 0) {
    const uploaded = await uploadLandingFile(mediaFile, pageKey, blockKey);
    formData.set("mediaUrl", uploaded.url);
    formData.set("mediaType", uploaded.mediaType);
    formData.delete("mediaFile");
  }

  for (let number = 1; number <= 5; number += 1) {
    const slideFile = formData.get(`slide${number}File`);
    if (slideFile instanceof File && slideFile.size > 0) {
      const uploaded = await uploadLandingFile(slideFile, pageKey, `${blockKey}-slide-${number}`);
      formData.set(`slide${number}MediaUrl`, uploaded.url);
      formData.set(`slide${number}MediaType`, uploaded.mediaType);
      formData.delete(`slide${number}File`);
    }
  }

  for (let number = 1; number <= 6; number += 1) {
    const imageFile = formData.get(`image${number}File`);
    if (imageFile instanceof File && imageFile.size > 0) {
      const uploaded = await uploadLandingFile(imageFile, pageKey, `${blockKey}-image-${number}`);
      formData.set(`image${number}Url`, uploaded.url);
      formData.delete(`image${number}File`);
    }
  }

  return formData;
}
