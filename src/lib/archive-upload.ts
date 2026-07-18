import type { ArchiveCollectionKey } from "@/lib/archive-collections";

const archiveImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
export const archiveImageMaxBytes = 8 * 1024 * 1024;

export function formatArchiveFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

export function getArchiveUploadFiles(formData: FormData, fieldName = "archiveFiles") {
  return formData
    .getAll(fieldName)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

export function requireArchiveUploadFiles(formData: FormData, fieldName = "archiveFiles") {
  const files = getArchiveUploadFiles(formData, fieldName);
  if (files.length === 0) {
    throw new Error("저장할 이미지를 다시 선택해 주세요.");
  }
  return files;
}

export function buildArchiveUploadForms(files: File[], collectionKey: ArchiveCollectionKey) {
  return files.map((file) => {
    const formData = new FormData();
    formData.set("collectionKey", collectionKey);
    formData.set("archiveFiles", file);
    return formData;
  });
}

export function buildArchiveUploadRequest(file: File, collectionKey: ArchiveCollectionKey) {
  return {
    url: "/api/admin/archive/upload",
    init: {
      method: "POST",
      headers: {
        "content-type": file.type,
        "x-archive-collection": collectionKey,
        "x-archive-file-name": encodeURIComponent(file.name)
      },
      body: file
    } satisfies RequestInit
  };
}

export function validateArchiveImage(file: File) {
  if (!archiveImageTypes.has(file.type)) {
    return { ok: false as const, message: "JPG, PNG, WebP 이미지만 업로드할 수 있습니다." };
  }

  if (file.size > archiveImageMaxBytes) {
    return { ok: false as const, message: "이미지당 최대 용량은 8MB입니다." };
  }

  return { ok: true as const };
}

export function safeArchiveFileName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "archive-image.jpg";
}
