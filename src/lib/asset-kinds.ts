export const assetKindOptions = [
  { value: "brand", label: "Brand" },
  { value: "product", label: "Product" },
  { value: "special", label: "Special" },
  { value: "general", label: "General" }
] as const;

export type AssetKind = (typeof assetKindOptions)[number]["value"];

export function normalizeAssetKind(value: string): AssetKind {
  return assetKindOptions.some((option) => option.value === value) ? (value as AssetKind) : "general";
}
