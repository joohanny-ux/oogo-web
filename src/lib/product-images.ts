export type ProductImageRole = "angle" | "wearing" | "front" | "side";

export type ProductImageInput = {
  role: ProductImageRole;
  url: string;
  bucket?: string;
  path?: string;
};

type ProductThumbnailSource = {
  role?: string | null;
  assets?: { public_url?: string | null } | Array<{ public_url?: string | null }> | null;
};

function assetUrl(source?: ProductThumbnailSource) {
  if (Array.isArray(source?.assets)) {
    return source.assets[0]?.public_url ?? null;
  }

  return source?.assets?.public_url ?? null;
}

export function getProductThumbnailUrl(images: ProductThumbnailSource[] = []) {
  return assetUrl(images.find((image) => image.role === "front")) ??
    assetUrl(images.find((image) => image.role === "angle"));
}

export function getProductImageSlots(): Array<{
  role: ProductImageRole;
  label: string;
  note: string;
  guidance: string;
}> {
  return [
    {
      role: "front",
      label: "Front balance",
      note: "상세 이미지 1, Collection 기본 이미지",
      guidance: "긴 변 1800px 이하 WebP로 자동 최적화, JPG/PNG/WebP 원본 최대 12MB"
    },
    {
      role: "angle",
      label: "Angle view",
      note: "상세 이미지 2, Collection hover 이미지",
      guidance: "긴 변 1800px 이하 WebP로 자동 최적화, JPG/PNG/WebP 원본 최대 12MB"
    },
    {
      role: "side",
      label: "Side profile",
      note: "상세 이미지 3, 템플과 측면 실루엣",
      guidance: "긴 변 1800px 이하 WebP로 자동 최적화, JPG/PNG/WebP 원본 최대 12MB"
    },
    {
      role: "wearing",
      label: "Wearing / Lifestyle",
      note: "상세 이미지 4, 착용 또는 쇼룸 이미지",
      guidance: "긴 변 1800px 이하 WebP로 자동 최적화, JPG/PNG/WebP 원본 최대 12MB"
    }
  ];
}

export function parseProductImageInputs(values: Partial<Record<ProductImageRole, string>>): ProductImageInput[] {
  return getProductImageSlots()
    .map((slot) => ({
      role: slot.role,
      url: values[slot.role]?.trim() ?? ""
    }))
    .filter((image) => image.url.length > 0);
}
