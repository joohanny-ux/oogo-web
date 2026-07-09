// 프로젝트/스페셜 에디션 메타데이터와 이미지 세트.

export type ProjectImageSet = {
  hero: string;
  campaign: string;
  product: string;
  wearing: string;
  archive: string;
};

export type ProjectEditorialBlock =
  | { kind: "image"; key: keyof ProjectImageSet; label: string; fit?: "cover" | "contain"; span?: "full" | "half" }
  | { kind: "text"; body: string };

export type SpecialEdition = {
  id: string;
  slug: string;
  title: string;
  collaborator: string;
  year: string;
  theme: string;
  summary: string;
  story: string;
  lead: string;
  tags: string[];
  relatedProducts: string[];
  images: ProjectImageSet;
  editorial: ProjectEditorialBlock[];
  cta: string;
};

export const specialEditions: SpecialEdition[] = [
  {
    id: "youngbin-edition-2026",
    slug: "youngbin-edition",
    title: "Youngbin Edition",
    collaborator: "Youngbin",
    year: "2026",
    theme: "Photography, light, and quiet attitude",
    summary: "Limited image studies and seasonal edits.",
    lead: "Limited image studies and seasonal edits.",
    story:
      "A seasonal edit shaped by light direction, face, and quiet attitude. Campaign and wearing cuts are released through buyer inquiry.",
    tags: ["Photography", "Limited color", "Buyer catalog"],
    relatedProducts: ["OG26001C2", "OG26002C1"],
    images: {
      hero: "/images/oogo-gallery.png",
      campaign: "/images/oogo-gallery.png",
      product: "/images/oogo-product-front.png",
      wearing: "/images/oogo-hero.png",
      archive: "/images/oogo-product-angle.png"
    },
    editorial: [
      { kind: "image", key: "campaign", label: "Campaign", fit: "cover", span: "full" },
      { kind: "text", body: "Light direction, quiet attitude, and seasonal frames." },
      { kind: "image", key: "product", label: "Object", fit: "contain", span: "half" },
      { kind: "image", key: "wearing", label: "Wearing", fit: "cover", span: "half" },
      { kind: "image", key: "archive", label: "Detail", fit: "contain", span: "half" },
      {
        kind: "text",
        body: "Released through buyer inquiry. Related frames: OG26001C2 / OG26002C1."
      }
    ],
    cta: "Buyer inquiry"
  }
];

export function getFeaturedSpecialEdition() {
  return specialEditions[0];
}

export function getSpecialEditionBySlug(slug: string) {
  return specialEditions.find((edition) => edition.slug === slug);
}
