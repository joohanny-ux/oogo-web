// 프로젝트/스페셜 에디션 메타데이터와 이미지 세트.

export type ProjectImageSet = {
  hero: string;
  campaign: string;
  product: string;
  wearing: string;
  archive: string;
  collaborationHero: string;
  limitedEdition: string;
  lightHands: string;
  photographerAtWork: string;
  photographerProfile: string;
};

export type ProjectGalleryImage = {
  key: string;
  src: string;
  fit: "cover" | "contain";
};

export type ProjectEditorialBlock =
  | { kind: "image"; key: "campaign" | "product" | "wearing" | "archive"; label: string; fit?: "cover" | "contain"; span?: "full" | "half" }
  | { kind: "text"; body: string };

export type YoungbinEditionContent = {
  hero: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    body: string;
  };
  statement: {
    statementEn: string;
    bodyKo: string;
    themes: [string, string, string];
  };
  limited: {
    eyebrow: string;
    heading: string;
    body: string;
    features: Array<{ title: string; body: string }>;
  };
  gallery: ProjectGalleryImage[];
  profile: {
    eyebrow: string;
    name: string;
    role: string;
    quoteKo: string;
    quoteEn: string;
    body: string;
    credentials: [string, string, string];
    archiveLabel: string;
    archiveHref: string;
  };
};

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
  statement: YoungbinEditionContent["statement"];
  limited: YoungbinEditionContent["limited"];
  gallery: YoungbinEditionContent["gallery"];
  profile: YoungbinEditionContent["profile"];
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
      hero: "/images/projects/projects-list-hero.png",
      campaign: "/images/projects/youngbin-edition/collaboration-hero.jpg",
      product: "/images/oogo-product-front.png",
      wearing: "/images/projects/youngbin-edition/photographer-profile.jpg",
      archive: "/images/oogo-product-angle.png",
      collaborationHero: "/images/projects/youngbin-edition/collaboration-hero.jpg",
      limitedEdition: "/images/projects/youngbin-edition/limited-edition.jpg",
      lightHands: "/images/projects/youngbin-edition/light-hands.jpg",
      photographerAtWork: "/images/projects/youngbin-edition/photographer-at-work.jpg",
      photographerProfile: "/images/projects/youngbin-edition/photographer-profile.jpg"
    },
    statement: {
      statementEn:
        "Photography and eyewear begin with light. Both shape what we choose to remember.",
      bodyKo: "사진가의 시선과 OOGO의 프레임이 만나 빛과 순간을 기록합니다.",
      themes: ["Light", "Gaze", "Memory"]
    },
    limited: {
      eyebrow: "Limited Edition",
      heading: "Youngbin Edition",
      body:
        "빛을 바라보는 태도와 시선을 기록하는 감각이 만나, OOGO의 세계관을 한정판 프레임과 스페셜 패키지로 확장합니다.",
      features: [
        { title: "Limited Quantity", body: "한정 수량으로 제작되는 협업 프레임" },
        { title: "Special Package", body: "에디션을 위해 구성한 전용 패키지" },
        { title: "Campaign & Exhibition", body: "사진과 제품이 이어지는 캠페인 서사" }
      ]
    },
    gallery: [
      { key: "collaboration", src: "/images/projects/youngbin-edition/collaboration-hero.jpg", fit: "cover" },
      { key: "limited", src: "/images/projects/youngbin-edition/edition-gallery-01.png", fit: "contain" },
      { key: "hands", src: "/images/projects/youngbin-edition/light-hands.jpg", fit: "cover" },
      { key: "working", src: "/images/projects/youngbin-edition/photographer-at-work.jpg", fit: "cover" },
      {
        key: "product",
        src: "/images/projects/youngbin-edition/edition-gallery-04.png",
        fit: "cover"
      }
    ],
    profile: {
      eyebrow: "Photographer",
      name: "Ji Youngbin",
      role: "Photographer · Visual Storyteller",
      quoteKo: "모든 순간은 예술이 될 수 있다.",
      quoteEn: "Every moment can become art.",
      body:
        "지영빈은 35년 이상 인물, 앨범 재킷, 에디토리얼과 다큐멘터리 사진을 통해 사람과 순간의 태도를 기록해 온 사진가입니다.",
      credentials: [
        "35+ years across portrait, editorial, and documentary photography",
        "Official photographer for UNESCO Korea",
        "New York Times Square documentary international screening"
      ],
      archiveLabel: "View Photo Archive",
      archiveHref: "/archive/youngbin-edition"
    },
    editorial: [
      { kind: "image", key: "campaign", label: "Campaign", fit: "cover", span: "full" },
      { kind: "text", body: "Light direction, quiet attitude, and seasonal frames." },
      { kind: "image", key: "product", label: "Object", fit: "contain", span: "half" },
      { kind: "image", key: "wearing", label: "Wearing", fit: "cover", span: "half" },
      { kind: "image", key: "archive", label: "Detail", fit: "contain", span: "half" }
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
