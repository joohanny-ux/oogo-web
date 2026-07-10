export type ProductImageRole = "angle" | "wearing" | "front" | "side";

export type ProductImageInput = {
  role: ProductImageRole;
  url: string;
  bucket?: string;
  path?: string;
};

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
      guidance: "1400 x 900px 권장, 상품 중앙 배치, JPG/PNG/WebP, 최대 5MB"
    },
    {
      role: "angle",
      label: "Angle view",
      note: "상세 이미지 2, Collection hover 이미지",
      guidance: "1600 x 1200px, 4:3 권장, JPG/PNG/WebP, 최대 5MB"
    },
    {
      role: "side",
      label: "Side profile",
      note: "상세 이미지 3, 템플과 측면 실루엣",
      guidance: "1400 x 900px 권장, 상품 중앙 배치, JPG/PNG/WebP, 최대 5MB"
    },
    {
      role: "wearing",
      label: "Wearing / Lifestyle",
      note: "상세 이미지 4, 착용 또는 쇼룸 이미지",
      guidance: "세로 1600 x 2000px 또는 가로 2400 x 1500px 권장, 최대 5MB"
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
