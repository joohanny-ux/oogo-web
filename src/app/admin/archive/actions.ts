"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import { archiveCollectionKeys, type ArchiveCollectionKey } from "@/lib/archive-collections";
import {
  getArchiveUploadFiles,
  requireArchiveUploadFiles,
  safeArchiveFileName,
  validateArchiveImage
} from "@/lib/archive-upload";
import { hasSupabaseEnv } from "@/lib/admin-content";

function revalidateArchive() {
  revalidatePath("/archive");
  revalidatePath("/archive/youngbin-edition");
  revalidatePath("/admin/archive");
  revalidatePath("/admin/files");
}

function requireArchiveCollection(formData: FormData): ArchiveCollectionKey {
  const value = String(formData.get("collectionKey") ?? "");
  if (!archiveCollectionKeys.includes(value as ArchiveCollectionKey)) {
    throw new Error("올바른 Archive 컬렉션을 선택해 주세요.");
  }
  return value as ArchiveCollectionKey;
}

async function uploadArchiveItem(file: File, collectionKey: ArchiveCollectionKey) {
  const validation = validateArchiveImage(file);
  if (!validation.ok) throw new Error(validation.message);
  if (!hasSupabaseEnv()) throw new Error("Supabase 연결 후 Archive 이미지를 저장할 수 있습니다.");

  const supabase = await requireAdminSession();
  const path = `archive/${collectionKey}/${Date.now()}-${randomUUID()}-${safeArchiveFileName(file.name)}`;
  const { error: uploadError } = await supabase.storage.from("oogo-assets").upload(path, file, {
    contentType: file.type,
    upsert: false
  });

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicData } = supabase.storage.from("oogo-assets").getPublicUrl(path);
  const imageUrl = publicData.publicUrl;
  const { data: asset, error: assetError } = await supabase
    .from("assets")
    .insert({
      bucket: "oogo-assets",
      path,
      public_url: imageUrl,
      kind: "general",
      alt: "OOGO archive image"
    })
    .select("id")
    .single();

  if (assetError) throw new Error(assetError.message);
  return { assetId: asset.id as string, imageUrl };
}

async function insertArchiveDrafts(files: File[], collectionKey: ArchiveCollectionKey) {
  if (files.length === 0) return;
  const supabase = await requireAdminSession();

  for (const file of files) {
    const uploaded = await uploadArchiveItem(file, collectionKey);
    const { error } = await supabase.from("archive_items").insert({
      collection_key: collectionKey,
      asset_id: uploaded.assetId,
      image_url: uploaded.imageUrl,
      alt_text: "OOGO archive image",
      published: false,
      published_at: null
    });

    if (error) throw new Error(error.message);
  }
}

export async function saveArchiveDraftAction(formData: FormData) {
  const collectionKey = requireArchiveCollection(formData);
  await insertArchiveDrafts(requireArchiveUploadFiles(formData), collectionKey);
  revalidateArchive();
}

export async function saveAndPublishArchiveAction(formData: FormData) {
  const collectionKey = requireArchiveCollection(formData);
  await insertArchiveDrafts(getArchiveUploadFiles(formData), collectionKey);
  const supabase = await requireAdminSession();
  const { error } = await supabase
    .from("archive_items")
    .update({ published: true, published_at: new Date().toISOString() })
    .eq("collection_key", collectionKey)
    .eq("published", false);

  if (error) throw new Error(error.message);
  revalidateArchive();
}

export async function replaceArchiveItemAction(formData: FormData) {
  const collectionKey = requireArchiveCollection(formData);
  const id = String(formData.get("id") ?? "");
  const files = getArchiveUploadFiles(formData, "replacementFile");
  if (!id || files.length !== 1) throw new Error("교체할 이미지 한 개를 선택하세요.");

  const uploaded = await uploadArchiveItem(files[0], collectionKey);
  const supabase = await requireAdminSession();
  const { error } = await supabase
    .from("archive_items")
    .update({
      asset_id: uploaded.assetId,
      image_url: uploaded.imageUrl,
      alt_text: "OOGO archive image",
      published: false,
      published_at: null,
      created_at: new Date().toISOString()
    })
    .eq("collection_key", collectionKey)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateArchive();
}

export async function deleteArchiveItemAction(formData: FormData) {
  const collectionKey = requireArchiveCollection(formData);
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("삭제할 Archive 항목이 없습니다.");

  const supabase = await requireAdminSession();
  const { error } = await supabase
    .from("archive_items")
    .delete()
    .eq("collection_key", collectionKey)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateArchive();
}
