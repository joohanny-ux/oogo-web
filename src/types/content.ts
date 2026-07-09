import type { Locale } from "@/lib/i18n";

export type PublishStatus = "draft" | "published";
export type InquiryStatus = "open" | "in_progress" | "closed";
export type InquiryType = "general" | "buyer" | "retail" | "collaboration" | "other" | "press";

export type Asset = {
  id: string;
  bucket: string;
  path: string;
  url: string;
  alt: string | null;
  kind: "brand" | "product" | "special" | "general";
};

export type Product = {
  id: string;
  slug: string;
  modelCode: string;
  size: string | null;
  frameMaterial: string | null;
  lensMaterial: string | null;
  lensFeatures: string[];
  published: boolean;
  featured: boolean;
  sortOrder: number;
};

export type ProductTranslation = {
  productId: string;
  locale: Locale;
  name: string;
  colorway: string | null;
  description: string | null;
};

export type LandingBlock = {
  pageKey: string;
  blockKey: string;
  locale: Locale;
  status: PublishStatus;
  content: Record<string, unknown>;
};
