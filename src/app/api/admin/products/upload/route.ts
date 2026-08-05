import { getAdminSupabaseClient } from "@/lib/admin-api-auth";
import { getProductImageSlots, type ProductImageRole } from "@/lib/product-images";
import { getWebImagePreset } from "@/lib/optimize-image";
import { uploadOptimizedProductImage } from "@/lib/product-image-upload";

export const runtime = "nodejs";
export const maxDuration = 60;

const roles = new Set(getProductImageSlots().map((slot) => slot.role));

function readRole(request: Request): ProductImageRole | null {
  const value = request.headers.get("x-product-role");
  return roles.has(value as ProductImageRole) ? (value as ProductImageRole) : null;
}

function readHeader(request: Request, name: string, fallback = "") {
  const value = request.headers.get(name);
  if (!value) return fallback;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function POST(request: Request) {
  const role = readRole(request);
  if (!role) {
    return Response.json({ message: "올바른 상품 이미지 역할을 선택해 주세요." }, { status: 400 });
  }

  const maxSourceBytes = getWebImagePreset("product").maxSourceBytes;
  const declaredSize = Number(request.headers.get("content-length") ?? 0);
  if (declaredSize > maxSourceBytes) {
    return Response.json({ message: `Image is over ${Math.round(maxSourceBytes / 1024 / 1024)}MB.` }, { status: 413 });
  }

  const supabase = await getAdminSupabaseClient();
  if (!supabase) {
    return Response.json({ message: "관리자 로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const bytes = await request.arrayBuffer();
    if (bytes.byteLength === 0) {
      return Response.json({ message: "Image file is empty." }, { status: 400 });
    }
    if (bytes.byteLength > maxSourceBytes) {
      return Response.json({ message: `Image is over ${Math.round(maxSourceBytes / 1024 / 1024)}MB.` }, { status: 413 });
    }

    const result = await uploadOptimizedProductImage({
      supabase,
      bytes,
      contentType: request.headers.get("content-type") ?? "application/octet-stream",
      fileName: readHeader(request, "x-product-file-name", `${role}.webp`),
      role,
      slug: readHeader(request, "x-product-slug"),
      modelCode: readHeader(request, "x-product-model")
    });

    if (!result.ok) {
      return Response.json({ message: result.message }, { status: 400 });
    }

    return Response.json(
      {
        ok: true,
        url: result.url,
        path: result.path,
        bucket: result.bucket,
        bytes: result.bytes,
        sourceBytes: result.sourceBytes
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "상품 이미지를 업로드하지 못했습니다."
      },
      { status: 500 }
    );
  }
}
