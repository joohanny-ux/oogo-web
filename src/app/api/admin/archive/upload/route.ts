import { randomUUID } from "node:crypto";
import { archiveCollectionKeys, type ArchiveCollectionKey } from "@/lib/archive-collections";
import { hasSupabaseEnv } from "@/lib/admin-content";
import { requireAdminSession } from "@/lib/admin-auth";
import {
  archiveImageMaxBytes,
  safeArchiveFileName,
  validateArchiveImage
} from "@/lib/archive-upload";

function readCollection(request: Request): ArchiveCollectionKey | null {
  const value = request.headers.get("x-archive-collection");
  return archiveCollectionKeys.includes(value as ArchiveCollectionKey)
    ? value as ArchiveCollectionKey
    : null;
}

function readFileName(request: Request) {
  const value = request.headers.get("x-archive-file-name") ?? "archive-image.jpg";
  try {
    return decodeURIComponent(value);
  } catch {
    return "archive-image.jpg";
  }
}

export async function POST(request: Request) {
  const collectionKey = readCollection(request);
  if (!collectionKey) {
    return Response.json({ message: "올바른 Archive 컬렉션을 선택해 주세요." }, { status: 400 });
  }
  if (!hasSupabaseEnv()) {
    return Response.json({ message: "Supabase 연결 후 Archive 이미지를 저장할 수 있습니다." }, { status: 503 });
  }

  const declaredSize = Number(request.headers.get("content-length") ?? 0);
  if (declaredSize > archiveImageMaxBytes) {
    return Response.json({ message: "이미지당 최대 용량은 8MB입니다." }, { status: 413 });
  }

  const supabase = await requireAdminSession();

  try {
    const bytes = await request.arrayBuffer();
    const file = new File([bytes], readFileName(request), {
      type: request.headers.get("content-type") ?? "application/octet-stream"
    });
    const validation = validateArchiveImage(file);
    if (!validation.ok) {
      return Response.json({ message: validation.message }, { status: 400 });
    }

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

    const { error: archiveError } = await supabase.from("archive_items").insert({
      collection_key: collectionKey,
      asset_id: asset.id,
      image_url: imageUrl,
      alt_text: "OOGO archive image",
      published: false,
      published_at: null
    });
    if (archiveError) throw new Error(archiveError.message);

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Archive 이미지를 저장하지 못했습니다." },
      { status: 500 }
    );
  }
}
