import type { Locale } from "@/lib/i18n";

export const landingPageKeys = [
  "header",
  "home",
  "brand-story",
  "collection",
  "projects",
  "product-detail",
  "special-edition",
  "archive",
  "inquiry",
  "footer"
] as const;

type SeedTranslation = Record<Locale, { name: string; colorway: string | null; description: string | null }>;

export const initialProducts: Array<{
  modelCode: string;
  slug: string;
  size: string;
  frameMaterial: string;
  lensMaterial: string;
  lensFeatures: string[];
  translations: SeedTranslation;
}> = [
  {
    modelCode: "OG26001C2",
    slug: "og26001c2-sunset-stroll",
    size: "63-17-145",
    frameMaterial: "High-quality PC Frame (Polycarbonate)",
    lensMaterial: "PA12 Nylon (Swiss EMS Grilamid TR90 LXS)",
    lensFeatures: [
      "UV400 100% protection",
      "Anti-impact",
      "Anti-reflective coating",
      "Low haze <1.5%",
      "1.0g/cm3"
    ],
    translations: {
      ko: { name: "황혼의 산책", colorway: null, description: "빛과 그림자의 균형을 담은 OOGO 프레임입니다." },
      en: { name: "Sunset Stroll", colorway: null, description: "An OOGO frame shaped by the balance of light and shadow." },
      zh: { name: "夕光漫步", colorway: null, description: "以光影平衡塑造的 OOGO 镜框。" }
    }
  },
  {
    modelCode: "OG26002C1",
    slug: "og26002c1-black-moon",
    size: "53-22-142",
    frameMaterial: "High-quality PC Frame (Polycarbonate)",
    lensMaterial: "PA12 Nylon (Swiss EMS Grilamid TR90 LXS)",
    lensFeatures: [
      "UV400 100% protection",
      "Anti-impact",
      "Anti-reflective coating",
      "Low haze <1.5%",
      "1.0g/cm3"
    ],
    translations: {
      ko: { name: "블랙 문", colorway: null, description: "조용한 존재감을 선명하게 만드는 블랙 프레임입니다." },
      en: { name: "Black Moon", colorway: null, description: "A black frame with quiet and distinct presence." },
      zh: { name: "黑月", colorway: null, description: "呈现安静而鲜明存在感的黑色镜框。" }
    }
  },
  {
    modelCode: "OG26003C4",
    slug: "og26003c4-silver-mist",
    size: "62-20-145",
    frameMaterial: "High-quality PC Frame (Polycarbonate)",
    lensMaterial: "PA12 Nylon (Swiss EMS Grilamid TR90 LXS)",
    lensFeatures: [
      "UV400 100% protection",
      "Anti-impact",
      "Anti-reflective coating",
      "Low haze <1.5%",
      "1.0g/cm3"
    ],
    translations: {
      ko: { name: "실버 미스트", colorway: null, description: "빛의 결을 부드럽게 정리하는 실버 톤 프레임입니다." },
      en: { name: "Silver Mist", colorway: null, description: "A silver-toned frame that softens the texture of light." },
      zh: { name: "银雾", colorway: null, description: "柔和整理光线质感的银色调镜框。" }
    }
  }
];
