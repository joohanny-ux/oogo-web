import { randomUUID } from "node:crypto";
import { getAdminSupabaseClient } from "@/lib/admin-api-auth";
import { archiveCollectionKeys, type ArchiveCollectionKey } from "@/lib/archive-collections";
import { hasSupabaseEnv } from "@/lib/admin-content";
import {
  archiveImageMaxBytes,
  normalizeArchiveImageType,
  safeArchiveFileName,
  validateArchiveImage
} from "@/lib/archive-upload";
import { optimizeWebImage, replaceExtensionWithWebp } from "@/lib/optimize-image";
import { describeStorageUploadError } from "@/lib/product-image-upload";

export const runtime = "nodejs";
export const maxDuration = 60;

function readCollection(request: Request): ArchiveCollectionKey | null {
  const value = request.headers.get("x-archive-collection");
  return archiveCollectionKeys.includes(value as ArchiveCollectionKey)
    ? (value as ArchiveCollectionKey)
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
    return Response.json({ message: "이미지당 최대 용량은 12MB입니다." }, { status: 413 });
  }

  const supabase = await getAdminSupabaseClient();
  if (!supabase) {
    return Response.json({ message: "관리자 로그인이 필요합니다. 다시 로그인한 뒤 시도해 주세요." }, { status: 401 });
  }

  const fileName = readFileName(request);

  try {
    const bytes = await request.arrayBuffer();
    if (bytes.byteLength === 0) {
      return Response.json({ message: `${fileName}: 빈 파일입니다.` }, { status: 400 });
    }
    if (bytes.byteLength > archiveImageMaxBytes) {
      return Response.json({ message: "이미지당 최대 용량은 12MB입니다." }, { status: 413 });
    }

    const contentType = normalizeArchiveImageType(request.headers.get("content-type"));
    const file = new File([bytes], fileName, { type: contentType });
    const validation = validateArchiveImage(file);
    if (!validation.ok) {
      return Response.json({ message: `${fileName}: ${validation.message}` }, { status: 400 });
    }

    let optimized;
    try {
      optimized = await optimizeWebImage(bytes, "archive");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "이미지 최적화에 실패했습니다.";
      return Response.json({ message: `${fileName}: ${detail}` }, { status: 400 });
    }

    const path = `archive/${collectionKey}/${Date.now()}-${randomUUID()}-${replaceExtensionWithWebp(safeArchiveFileName(fileName))}`;
    const { error: uploadError } = await supabase.storage.from("oogo-assets").upload(path, Buffer.from(optimized.buffer), {
      contentType: optimized.contentType,
      upsert: false
    });
    if (uploadError) {
      return Response.json({ message: describeStorageUploadError(uploadError.message) }, { status: 500 });
    }

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
    if (assetError) {
      return Response.json({ message: describeStorageUploadError(assetError.message) }, { status: 500 });
    }

    const { error: archiveError } = await supabase.from("archive_items").insert({
      collection_key: collectionKey,
      asset_id: asset.id,
      image_url: imageUrl,
      alt_text: "OOGO archive image",
      published: false,
      published_at: null
    });
    if (archiveError) {
      return Response.json({ message: describeStorageUploadError(archiveError.message) }, { status: 500 });
    }

    return Response.json(
      {
        ok: true,
        optimizedBytes: optimized.bytes,
        sourceBytes: optimized.sourceBytes
      },
      { status: 201 }
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Archive 이미지를 저장하지 못했습니다.";
    return Response.json({ message: `${fileName}: ${describeStorageUploadError(detail)}` }, { status: 500 });
  }
}
