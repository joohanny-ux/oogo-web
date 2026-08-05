import { getAdminSupabaseClient } from "@/lib/admin-api-auth";
import {
  landingImageMaxBytes,
  landingVideoMaxBytes,
  normalizeLandingContentType,
  uploadLandingMediaAsset,
  validateLandingUpload
} from "@/lib/landing-media-upload";

export const runtime = "nodejs";
export const maxDuration = 60;

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
  const pageKey = readHeader(request, "x-landing-page-key");
  const slotKey = readHeader(request, "x-landing-slot-key");
  const fileName = readHeader(request, "x-landing-file-name", "landing-media.jpg");

  if (!pageKey || !slotKey) {
    return Response.json({ message: "랜딩 업로드 위치 정보가 올바르지 않습니다." }, { status: 400 });
  }

  const declaredSize = Number(request.headers.get("content-length") ?? 0);
  const maxDeclared = Math.max(landingImageMaxBytes, landingVideoMaxBytes);
  if (declaredSize > maxDeclared) {
    return Response.json({ message: "업로드 파일이 허용 용량을 초과했습니다." }, { status: 413 });
  }

  const supabase = await getAdminSupabaseClient();
  if (!supabase) {
    return Response.json({ message: "관리자 로그인이 필요합니다. 다시 로그인한 뒤 시도해 주세요." }, { status: 401 });
  }

  try {
    const bytes = await request.arrayBuffer();
    if (bytes.byteLength === 0) {
      return Response.json({ message: `${fileName}: 빈 파일입니다.` }, { status: 400 });
    }

    const contentType = normalizeLandingContentType(request.headers.get("content-type"));
    const validation = validateLandingUpload(new File([bytes], fileName, { type: contentType }));
    if (!validation.ok) {
      return Response.json({ message: `${fileName}: ${validation.message}` }, { status: 400 });
    }

    const result = await uploadLandingMediaAsset({
      supabase,
      bytes,
      contentType,
      fileName,
      pageKey,
      slotKey
    });

    if (!result.ok) {
      return Response.json({ message: `${fileName}: ${result.message}` }, { status: 500 });
    }

    return Response.json(
      {
        ok: true,
        url: result.url,
        mediaType: result.mediaType
      },
      { status: 201 }
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "랜딩 미디어를 저장하지 못했습니다.";
    return Response.json({ message: `${fileName}: ${detail}` }, { status: 500 });
  }
}
