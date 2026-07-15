import React from "react";
import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n";
import { getLandingEditorPages, landingPageOptions } from "@/lib/admin-content";
import { getProductCatalogHref } from "@/lib/products";

type LandingBlockRow = {
  id: string;
  block_key: string;
  draft_content: Record<string, unknown>;
  published_content: Record<string, unknown>;
  published: boolean;
};

type AssetOption = {
  id: string;
  public_url: string;
  alt: string | null;
  kind: string;
};

type LandingEditorProps = {
  pageKey: string;
  locale: Locale;
  blocks: LandingBlockRow[];
  assets?: AssetOption[];
  saveAction: (formData: FormData) => void | Promise<void>;
  publishAction: (formData: FormData) => void | Promise<void>;
  supabaseConfigured?: boolean;
};

type FieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "select" | "url";
  options?: Array<{ label: string; value: string }>;
  wide?: boolean;
};

type BlockConfig = {
  key: string;
  title: string;
  note: string;
  media?: boolean;
  mediaGuidance?: string;
  fields: FieldConfig[];
};

const specialEditionGroups = [
  {
    label: "Hero",
    note: "첫 화면의 협업 소개와 핵심 이동 경로",
    keys: ["special-hero"]
  },
  {
    label: "Story & Edition",
    note: "협업 관점, 한정판 설명과 패키지 이미지",
    keys: ["collaboration-statement", "limited-edition"]
  },
  {
    label: "Gallery",
    note: "공개 페이지에 표시할 대표 이미지 4장",
    keys: ["edition-gallery"]
  },
  {
    label: "Photographer & Links",
    note: "짧은 작가 프로필과 Archive, Inquiry, Projects 링크",
    keys: ["photographer-profile", "footer-cta"]
  }
] as const;

const commonCopyFields: FieldConfig[] = [
  { name: "eyebrow", label: "작은 제목", placeholder: "예: 2026 Collection" },
  { name: "heading", label: "메인 제목", placeholder: "섹션 제목" },
  { name: "body", label: "설명", type: "textarea", placeholder: "홈페이지에 노출될 문구", wide: true },
  { name: "primaryLabel", label: "버튼 문구", placeholder: "View more" },
  { name: "primaryHref", label: "이동 링크", placeholder: getProductCatalogHref() }
];

const homeBlocks: BlockConfig[] = [
  {
    key: "hero",
    title: "Hero",
    note: "공개 홈 첫 화면의 대표 이미지와 브랜드 문구",
    media: true,
    mediaGuidance:
      "Image 2400 x 1500px recommended, JPG/PNG/WebP max 8MB. Video 1920 x 1080 or 1920 x 1200, MP4/WebM max 25MB, muted loop style.",
    fields: [
      { name: "eyebrow", label: "작은 제목", placeholder: "OOGO 2026" },
      { name: "heading", label: "로고/타이틀", placeholder: "OOGO" },
      { name: "line", label: "메인 문장", placeholder: "Frames for light, face, and quiet attitude.", wide: true }
    ]
  },
  {
    key: "collection-preview",
    title: "Collection",
    note: "Featured 상품은 Products에서 관리하고, 여기서는 제목과 전체보기 링크를 설정합니다.",
    fields: [
      { name: "eyebrow", label: "섹션 제목", placeholder: "Collection" },
      { name: "primaryLabel", label: "전체보기 문구", placeholder: "View all" },
      { name: "primaryHref", label: "전체보기 링크", placeholder: getProductCatalogHref() }
    ]
  },
  {
    key: "special-preview",
    title: "Projects",
    note: "공개 홈의 프로젝트 대표 이미지, 제목, 설명과 이동 링크",
    media: true,
    mediaGuidance: "Recommended 2000 x 1400px campaign image, JPG/PNG/WebP max 8MB.",
    fields: [
      { name: "eyebrow", label: "작은 제목", placeholder: "Projects" },
      { name: "heading", label: "프로젝트 제목", placeholder: "Youngbin Edition" },
      { name: "body", label: "설명", type: "textarea", placeholder: "Limited image studies and seasonal edits.", wide: true },
      { name: "primaryLabel", label: "버튼 문구", placeholder: "View project" },
      { name: "primaryHref", label: "프로젝트 링크", placeholder: "/projects/youngbin-edition" }
    ]
  },
  {
    key: "archive-preview",
    title: "Archive",
    note: "공개 홈 마지막 갤러리의 제목, Archive 링크와 이미지 4개",
    media: true,
    mediaGuidance: "첫 번째 Archive 이미지입니다. Portrait or landscape JPG/PNG/WebP, max 8MB.",
    fields: [
      { name: "eyebrow", label: "섹션 제목", placeholder: "Archive" },
      { name: "primaryLabel", label: "Archive 링크 문구", placeholder: "View archive" },
      { name: "primaryHref", label: "Archive 링크", placeholder: "/archive" },
      { name: "image2Url", label: "두 번째 이미지 주소", placeholder: "Files의 이미지 URL", wide: true },
      { name: "image3Url", label: "세 번째 이미지 주소", placeholder: "Files의 이미지 URL", wide: true },
      { name: "image4Url", label: "네 번째 이미지 주소", placeholder: "Files의 이미지 URL", wide: true }
    ]
  }
];

const pageBlockMap: Record<string, BlockConfig[]> = {
  header: [
    {
      key: "main",
      title: "Header",
      note: "로고, 메인 메뉴, 언어 선택, 우측 버튼",
      media: true,
      mediaGuidance: "Logo image: transparent PNG/WebP, wide ratio around 3:1, minimum 240px wide.",
      fields: [
        { name: "logoLabel", label: "로고 대체 문구", placeholder: "OOGO" },
        { name: "logoHref", label: "로고 클릭 링크", placeholder: "/" },
        { name: "nav1Label", label: "메뉴 1 이름", placeholder: "Brand" },
        { name: "nav1Href", label: "메뉴 1 링크", placeholder: "/brand" },
        { name: "nav2Label", label: "메뉴 2 이름", placeholder: "Collection" },
        { name: "nav2Href", label: "메뉴 2 링크", placeholder: "/collection" },
        { name: "nav3Label", label: "메뉴 3 이름", placeholder: "Projects" },
        { name: "nav3Href", label: "메뉴 3 링크", placeholder: "/projects" },
        { name: "nav4Label", label: "메뉴 4 이름", placeholder: "Archive" },
        { name: "nav4Href", label: "메뉴 4 링크", placeholder: "/archive" },
        { name: "nav5Label", label: "메뉴 5 이름", placeholder: "Inquiry" },
        { name: "nav5Href", label: "메뉴 5 링크", placeholder: "/inquiry" },
        {
          name: "showLocale",
          label: "언어 선택 표시",
          type: "select",
          options: [
            { label: "보이기", value: "true" },
            { label: "숨기기", value: "false" }
          ]
        }
      ]
    }
  ],
  home: homeBlocks,
  "brand-story": [
    {
      key: "story-hero",
      title: "Brand Hero",
      note: "상단 브랜드 이름, 짧은 문장과 대표 이미지",
      media: true,
      mediaGuidance: "Recommended 2400 x 1400px, editorial brand image, JPG/PNG/WebP max 8MB.",
      fields: [
        { name: "eyebrow", label: "작은 제목", placeholder: "Brand Story" },
        { name: "heading", label: "브랜드 제목", placeholder: "OOGO" },
        { name: "line", label: "핵심 문장", placeholder: "조용하지만 분명한 존재감과 정제된 시선.", wide: true },
        { name: "body", label: "브랜드 소개", type: "textarea", wide: true }
      ]
    },
    {
      key: "about",
      title: "About OOGO",
      note: "브랜드 정의와 고객, 제공 가치를 소개하는 영역",
      fields: [
        { name: "eyebrow", label: "작은 제목", placeholder: "About OOGO" },
        { name: "heading", label: "섹션 제목", placeholder: "정제된 시선을 위한 아이웨어" },
        { name: "body", label: "브랜드 소개", type: "textarea", wide: true },
        { name: "what", label: "What it is", type: "textarea" },
        { name: "who", label: "Who it is for", type: "textarea" },
        { name: "offer", label: "What it offers", type: "textarea" }
      ]
    },
    {
      key: "statement",
      title: "Brand Statement",
      note: "전체 폭으로 강조되는 브랜드 선언",
      fields: [
        { name: "eyebrow", label: "작은 제목", placeholder: "Brand Statement" },
        { name: "headline", label: "선언 문장", type: "textarea", wide: true },
        { name: "body", label: "보조 문장", type: "textarea", wide: true }
      ]
    },
    {
      key: "essence",
      title: "Brand Essence",
      note: "QUIET, HUMAN, LIGHT, SHADOW, MEMORY, FRAME 여섯 가지 가치",
      fields: [
        { name: "heading", label: "섹션 제목", wide: true },
        { name: "intro", label: "섹션 설명", type: "textarea", wide: true },
        ...["QUIET", "HUMAN", "LIGHT", "SHADOW", "MEMORY", "FRAME"].flatMap((title, index) => [
          { name: `item${index + 1}Title`, label: `가치 ${index + 1} 제목`, placeholder: title },
          { name: `item${index + 1}Body`, label: `가치 ${index + 1} 설명`, type: "textarea" as const }
        ])
      ]
    },
    {
      key: "philosophy",
      title: "Design Philosophy",
      note: "비례, 균형, 착용감, 선명함과 오래 남는 형태",
      media: true,
      mediaGuidance: "Recommended 1600 x 1200px product detail image, JPG/PNG/WebP max 8MB.",
      fields: [
        { name: "heading", label: "섹션 제목", wide: true },
        { name: "intro", label: "섹션 설명", type: "textarea", wide: true },
        ...["Proportion", "Balance", "Comfort", "Clarity", "Timeless Form"].flatMap((title, index) => [
          { name: `item${index + 1}Title`, label: `철학 ${index + 1} 제목`, placeholder: title },
          { name: `item${index + 1}Body`, label: `철학 ${index + 1} 설명`, type: "textarea" as const },
          ...(index === 0 ? [] : [{ name: `image${index + 1}Url`, label: `철학 ${index + 1} 이미지 주소`, wide: true }])
        ])
      ]
    },
    {
      key: "experience",
      title: "Brand Experience",
      note: "공간, 제품, 패키지와 착용 이미지를 조합한 갤러리",
      media: true,
      mediaGuidance: "Recommended 1600 x 1200px editorial image, JPG/PNG/WebP max 8MB.",
      fields: [
        { name: "heading", label: "섹션 제목", wide: true },
        { name: "body", label: "섹션 설명", type: "textarea", wide: true },
        { name: "image2Url", label: "이미지 2 주소", wide: true },
        { name: "image3Url", label: "이미지 3 주소", wide: true },
        { name: "image4Url", label: "이미지 4 주소", wide: true },
        { name: "image5Url", label: "이미지 5 주소", wide: true },
        { name: "image6Url", label: "이미지 6 주소", wide: true }
      ]
    },
    {
      key: "closing-cta",
      title: "Closing & CTA",
      note: "브랜드 마무리 문장과 Collection, Inquiry 링크",
      fields: [
        { name: "body", label: "마무리 문장", type: "textarea", wide: true },
        { name: "primaryLabel", label: "주요 링크 문구", placeholder: "View collection" },
        { name: "primaryHref", label: "주요 링크", placeholder: "/collection" },
        { name: "secondaryLabel", label: "보조 링크 문구", placeholder: "Business Inquiry" },
        { name: "secondaryHref", label: "보조 링크", placeholder: "/inquiry" }
      ]
    }
  ],
  collection: [
    {
      key: "collection-hero",
      title: "Collection Intro",
      note: "상품 목록 상단의 좌·중앙·우측 문구. 상품은 Products에서 관리합니다.",
      fields: [
        { name: "eyebrow", label: "왼쪽 제목", placeholder: "Collection" },
        { name: "heading", label: "중앙 제목", placeholder: "Sunglasses" },
        { name: "body", label: "오른쪽 문구", placeholder: "2026 OOGO Collection" }
      ]
    }
  ],
  projects: [
    {
      key: "intro",
      title: "Projects Intro",
      note: "Projects 목록 상단 제목과 설명",
      fields: [
        { name: "eyebrow", label: "작은 제목", placeholder: "Projects" },
        { name: "heading", label: "페이지 제목", placeholder: "Projects" },
        { name: "body", label: "오른쪽 설명", placeholder: "Seasonal studies / collaborations / image archive", wide: true }
      ]
    },
    {
      key: "featured-project",
      title: "Featured Project",
      note: "목록의 대표 프로젝트 이미지와 정보",
      media: true,
      fields: [
        { name: "year", label: "연도", placeholder: "2026" },
        { name: "heading", label: "프로젝트 제목", placeholder: "Youngbin Edition" },
        { name: "body", label: "프로젝트 설명", type: "textarea", wide: true },
        { name: "primaryHref", label: "프로젝트 링크", placeholder: "/projects/youngbin-edition" }
      ]
    },
    {
      key: "collaboration-cta",
      title: "Collaboration CTA",
      note: "대표 프로젝트 옆 협업 문의 영역",
      fields: [
        { name: "eyebrow", label: "작은 제목", placeholder: "Next" },
        { name: "heading", label: "제목", placeholder: "Open collaboration" },
        { name: "body", label: "설명", type: "textarea", wide: true },
        { name: "primaryHref", label: "문의 링크", placeholder: "/inquiry" }
      ]
    }
  ],
  "product-detail": [
    {
      key: "detail-template",
      title: "Product Detail Template",
      note: "모든 상품 상세에 공통으로 표시되는 Buyer 문의 버튼",
      fields: [
        { name: "buyerCta", label: "버튼 문구", placeholder: "Buyer inquiry" },
        { name: "buyerHref", label: "버튼 링크", placeholder: "/inquiry" }
      ]
    }
  ],
  "special-edition": [
    {
      key: "special-hero",
      title: "Collaboration Hero",
      note: "첫 화면의 OOGO x JIYOUNGBIN 협업 소개, 대표 이미지와 두 개의 이동 버튼",
      media: true,
      mediaGuidance: "가로 2400 x 1350px 권장. 제품과 협업 분위기가 함께 보이는 대표 JPG/PNG/WebP, 최대 8MB.",
      fields: [
        { name: "eyebrow", label: "협업 표기", placeholder: "OOGO x JIYOUNGBIN" },
        { name: "heading", label: "프로젝트 제목", placeholder: "Youngbin Edition" },
        { name: "subtitle", label: "연도 / 협업자", placeholder: "2026 · JI YOUNGBIN" },
        { name: "body", label: "협업 소개", type: "textarea", wide: true },
        { name: "primaryLabel", label: "문의 버튼 문구", placeholder: "Buyer inquiry" },
        { name: "primaryHref", label: "문의 링크", placeholder: "/inquiry" },
        { name: "secondaryLabel", label: "아카이브 버튼 문구", placeholder: "View Photo Archive" },
        { name: "secondaryHref", label: "아카이브 링크", placeholder: "/archive/youngbin-edition" }
      ]
    },
    {
      key: "collaboration-statement",
      title: "Light, Gaze, Memory",
      note: "사진과 아이웨어가 빛에서 시작된다는 협업 문장과 작가 작업 이미지 2장",
      media: true,
      mediaGuidance: "작가의 작업 과정 이미지 1. 가로 1600 x 1000px 전후 JPG/PNG/WebP, 최대 8MB.",
      fields: [
        { name: "statementEn", label: "영문 메인 문장", type: "textarea", wide: true },
        { name: "bodyKo", label: "한글 보조 설명", type: "textarea", wide: true },
        { name: "theme1", label: "키워드 1", placeholder: "Light" },
        { name: "theme2", label: "키워드 2", placeholder: "Gaze" },
        { name: "theme3", label: "키워드 3", placeholder: "Memory" },
        { name: "image2Url", label: "작업 이미지 2 주소", placeholder: "Files의 이미지 URL", wide: true }
      ]
    },
    {
      key: "limited-edition",
      title: "Limited Edition",
      note: "한정판 프레임, 스페셜 패키지와 캠페인 구성을 설명하는 제품 중심 섹션",
      media: true,
      mediaGuidance: "프레임과 스페셜 패키지가 함께 보이는 가로 2000 x 1200px 이미지 권장, 최대 8MB.",
      fields: [
        { name: "eyebrow", label: "작은 제목", placeholder: "Limited Edition" },
        { name: "heading", label: "메인 제목", placeholder: "Youngbin Edition" },
        { name: "body", label: "에디션 설명", type: "textarea", wide: true },
        { name: "feature1Title", label: "특징 1 제목", placeholder: "Limited Quantity" },
        { name: "feature1Body", label: "특징 1 설명" },
        { name: "feature2Title", label: "특징 2 제목", placeholder: "Special Package" },
        { name: "feature2Body", label: "특징 2 설명" },
        { name: "feature3Title", label: "특징 3 제목", placeholder: "Campaign & Exhibition" },
        { name: "feature3Body", label: "특징 3 설명" }
      ]
    },
    {
      key: "edition-gallery",
      title: "Edition Gallery",
      note: "제품 정면, 사선, 패키지, 캠페인과 디테일 이미지를 공개 순서대로 구성",
      media: true,
      mediaGuidance: "갤러리 첫 이미지. 제품 또는 캠페인 JPG/PNG/WebP, 최대 8MB.",
      fields: [
        { name: "image2Url", label: "갤러리 이미지 2 주소", placeholder: "Files의 이미지 URL", wide: true },
        { name: "image3Url", label: "갤러리 이미지 3 주소", placeholder: "Files의 이미지 URL", wide: true },
        { name: "image4Url", label: "갤러리 이미지 4 주소", placeholder: "Files의 이미지 URL", wide: true }
      ]
    },
    {
      key: "photographer-profile",
      title: "Photographer Profile",
      note: "짧은 작가 소개와 주요 이력 3개, 별도 Photo Archive로 연결하는 섹션",
      media: true,
      mediaGuidance: "지영빈 작가의 인물 또는 작업 사진. 세로 1200 x 1500px 전후 권장, 최대 8MB.",
      fields: [
        { name: "eyebrow", label: "작가 구분", placeholder: "Photographer" },
        { name: "name", label: "작가명", placeholder: "Ji Youngbin" },
        { name: "role", label: "역할", placeholder: "Photographer · Visual Storyteller" },
        { name: "quoteKo", label: "한글 인용문", placeholder: "모든 순간은 예술이 될 수 있다.", wide: true },
        { name: "quoteEn", label: "영문 인용문", placeholder: "Every moment can become art.", wide: true },
        { name: "body", label: "짧은 소개", type: "textarea", wide: true },
        { name: "credential1", label: "주요 이력 1", wide: true },
        { name: "credential2", label: "주요 이력 2", wide: true },
        { name: "credential3", label: "주요 이력 3", wide: true },
        { name: "archiveLabel", label: "아카이브 버튼 문구", placeholder: "View Photo Archive" },
        { name: "archiveHref", label: "아카이브 링크", placeholder: "/archive/youngbin-edition" }
      ]
    },
    {
      key: "footer-cta",
      title: "Footer CTA",
      note: "프로젝트 상세 하단의 문의·목록 링크",
      fields: [
        { name: "primaryLabel", label: "문의 문구", placeholder: "Buyer inquiry" },
        { name: "primaryHref", label: "문의 링크", placeholder: "/inquiry" },
        { name: "secondaryLabel", label: "목록 문구", placeholder: "All projects" },
        { name: "secondaryHref", label: "목록 링크", placeholder: "/projects" }
      ]
    }
  ],
  archive: [
    {
      key: "intro",
      title: "Archive Intro",
      note: "Archive 상단의 제목과 설명",
      fields: [
        { name: "eyebrow", label: "왼쪽 제목", placeholder: "Archive" },
        { name: "heading", label: "중앙 제목", placeholder: "Archive" },
        { name: "body", label: "오른쪽 설명", type: "textarea", wide: true }
      ]
    }
  ],
  inquiry: [
    {
      key: "inquiry-main",
      title: "Inquiry Intro",
      note: "문의 페이지의 작은 제목, 메인 제목과 소개 문장",
      fields: [
        { name: "eyebrow", label: "작은 제목", placeholder: "Contact & Support" },
        { name: "heading", label: "메인 제목", placeholder: "Product & Business Inquiry" },
        { name: "body", label: "소개", type: "textarea", wide: true }
      ]
    },
    {
      key: "direct-channel",
      title: "Direct Channel",
      note: "직접 연락할 이메일과 위치",
      fields: [
        { name: "eyebrow", label: "채널 제목", placeholder: "Direct channel" },
        { name: "email", label: "Email", placeholder: "contact@oogolabs.com" },
        { name: "address", label: "위치", placeholder: "Seoul, Korea" }
      ]
    },
    {
      key: "topic-guide",
      title: "Topic Guide",
      note: "문의 가능한 주제 4개",
      fields: [
        { name: "topic1", label: "주제 1", placeholder: "Buyer catalogue" },
        { name: "topic2", label: "주제 2", placeholder: "Retail partnership" },
        { name: "topic3", label: "주제 3", placeholder: "Collaboration / campaign" },
        { name: "topic4", label: "주제 4", placeholder: "Press / archive request" }
      ]
    },
    {
      key: "response-note",
      title: "Response Note",
      note: "문의 목록 아래의 응답 시간 안내",
      fields: [{ name: "response", label: "응답 안내", placeholder: "We usually respond within 1-2 business days.", wide: true }]
    }
  ],
  footer: [
    {
      key: "brand",
      title: "Brand",
      note: "Footer 왼쪽의 브랜드 문구",
      fields: [{ name: "brandDescription", label: "브랜드 문구", type: "textarea", wide: true }]
    },
    {
      key: "navigation",
      title: "Navigation",
      note: "Footer 중앙 메뉴 5개",
      fields: [
        { name: "nav1Label", label: "메뉴 1", placeholder: "Collection" }, { name: "nav1Href", label: "링크 1", placeholder: "/collection" },
        { name: "nav2Label", label: "메뉴 2", placeholder: "Projects" }, { name: "nav2Href", label: "링크 2", placeholder: "/projects" },
        { name: "nav3Label", label: "메뉴 3", placeholder: "Archive" }, { name: "nav3Href", label: "링크 3", placeholder: "/archive" },
        { name: "nav4Label", label: "메뉴 4", placeholder: "Inquiry" }, { name: "nav4Href", label: "링크 4", placeholder: "/inquiry" },
        { name: "nav5Label", label: "메뉴 5", placeholder: "Brand Story" }, { name: "nav5Href", label: "링크 5", placeholder: "/brand" }
      ]
    },
    {
      key: "contact-legal",
      title: "Contact & Legal",
      note: "Footer 오른쪽 연락처, SNS, 법률 링크와 저작권",
      fields: [
        { name: "email", label: "Email", placeholder: "contact@oogolabs.com" },
        { name: "address", label: "주소", placeholder: "Seoul, Korea" },
        { name: "instagram", label: "Instagram URL", placeholder: "https://www.instagram.com/oogolabs" },
        { name: "facebook", label: "Facebook URL", placeholder: "https://www.facebook.com/oogolabs" },
        { name: "tiktok", label: "TikTok URL", placeholder: "https://www.tiktok.com/@oogolabs" },
        { name: "youtube", label: "YouTube URL" },
        { name: "pinterest", label: "Pinterest URL" },
        { name: "termsLabel", label: "이용약관 문구", placeholder: "Terms & Conditions" },
        { name: "termsHref", label: "이용약관 링크", placeholder: "/terms-conditions" },
        { name: "privacyLabel", label: "개인정보 문구", placeholder: "Privacy Policy" },
        { name: "privacyHref", label: "개인정보 링크", placeholder: "/privacy-policy" },
        { name: "copyright", label: "Copyright", placeholder: "© 2026 OOGO. All rights reserved.", wide: true }
      ]
    }
  ]
};

function textValue(content: Record<string, unknown>, key: string) {
  const value = content[key];
  return typeof value === "string" ? value : "";
}

function selectValue(content: Record<string, unknown>, key: string, fallback: string) {
  const value = textValue(content, key);
  return value || fallback;
}

function getBlock(blocks: LandingBlockRow[], blockKey: string) {
  return blocks.find((block) => block.block_key === blockKey) ?? null;
}

function statusLabel(block: LandingBlockRow | null) {
  if (!block) {
    return "새 초안";
  }
  return block.published ? "게시됨" : "초안 저장됨";
}

function pageTitle(pageKey: string) {
  const editorPages = getLandingEditorPages();
  return editorPages.find((page) => page.key === pageKey)?.label ?? landingPageOptions.find((option) => option.key === pageKey)?.label ?? pageKey;
}

function publicHref(pageKey: string) {
  const editorPages = getLandingEditorPages();
  return editorPages.find((page) => page.key === pageKey)?.publicHref ?? "/";
}

function previewText(content: Record<string, unknown>, blockConfig: BlockConfig) {
  return (
    textValue(content, "heading") ||
    textValue(content, "line") ||
    textValue(content, "body") ||
    textValue(content, "brandDescription") ||
    blockConfig.note
  );
}

function mediaUrl(content: Record<string, unknown>) {
  return textValue(content, "mediaUrl") || textValue(content, "imageUrl");
}

function Field({ field, content }: { field: FieldConfig; content: Record<string, unknown> }) {
  const className = field.wide ? "admin-wide-field" : undefined;

  if (field.type === "textarea") {
    return (
      <label className={className}>
        {field.label}
        <textarea name={field.name} defaultValue={textValue(content, field.name)} placeholder={field.placeholder} />
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className={className}>
        {field.label}
        <select name={field.name} defaultValue={selectValue(content, field.name, field.options?.[0]?.value ?? "")}>
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className={className}>
      {field.label}
      <input name={field.name} defaultValue={textValue(content, field.name)} placeholder={field.placeholder} type={field.type === "url" ? "url" : "text"} />
    </label>
  );
}

function MediaPanel({
  content,
  block,
  assets,
  canPersist
}: {
  content: Record<string, unknown>;
  block: BlockConfig;
  assets: AssetOption[];
  canPersist: boolean;
}) {
  const mediaType = selectValue(content, "mediaType", "image");
  const currentMediaUrl = mediaUrl(content);

  return (
    <aside className="admin-asset-panel landing-media-panel">
      <div className="admin-section-heading">
        <span>이미지 / 영상</span>
        <small>Image / Video</small>
      </div>
      <label>
        미디어 종류
        <select name="mediaType" defaultValue={mediaType}>
          <option value="image">이미지</option>
          <option value="video">동영상</option>
        </select>
      </label>
      <label>
        이미지/영상 주소
        <input name="mediaUrl" list="landing-asset-options" defaultValue={currentMediaUrl} placeholder="/images/oogo-hero.png or storage URL" />
      </label>
      <label>
        동영상 대체 이미지
        <input name="posterUrl" list="landing-asset-options" defaultValue={textValue(content, "posterUrl")} placeholder="동영상일 때 권장" />
      </label>
      <div className="landing-file-actions">
        <a href="/admin/files" target="_blank" rel="noreferrer">
          Files에서 선택
        </a>
        <small>{canPersist ? "Files에서 URL을 복사해 붙여넣거나 바로 업로드하세요." : "Supabase 연결 후 파일 선택과 업로드를 사용할 수 있습니다."}</small>
      </div>
      <label className="admin-upload-control">
        <span>파일 업로드</span>
        <em>{block.mediaGuidance ?? "JPG/PNG/WebP image max 8MB. MP4/WebM video max 25MB."}</em>
        <input name="mediaFile" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" disabled={!canPersist} />
      </label>
      {currentMediaUrl ? (
        mediaType === "video" ? (
          <video className="landing-media-preview" src={currentMediaUrl} poster={textValue(content, "posterUrl")} muted controls />
        ) : (
          <div className="landing-media-preview" style={{ backgroundImage: `url("${currentMediaUrl}")` }} />
        )
      ) : (
        <div className="landing-media-preview landing-media-preview-empty">현재 공개 기본 이미지 사용 중</div>
      )}
      <datalist id="landing-asset-options">
        {assets.map((asset) => (
          <option key={asset.id} value={asset.public_url}>
            {asset.alt || asset.kind}
          </option>
        ))}
      </datalist>
    </aside>
  );
}

function BlockEditor({
  blockConfig,
  row,
  pageKey,
  locale,
  assets,
  saveAction,
  publishAction,
  initiallyOpen,
  canPersist
}: {
  blockConfig: BlockConfig;
  row: LandingBlockRow | null;
  pageKey: string;
  locale: Locale;
  assets: AssetOption[];
  saveAction: LandingEditorProps["saveAction"];
  publishAction: LandingEditorProps["publishAction"];
  initiallyOpen: boolean;
  canPersist: boolean;
}) {
  const content = row?.draft_content ?? {};
  const currentMediaUrl = mediaUrl(content);

  return (
    <section className="landing-block-editor">
      <details open={initiallyOpen}>
        <summary>
          <div className="landing-section-card-preview">
            {currentMediaUrl ? (
              <div className="landing-summary-thumb" style={{ backgroundImage: `url("${currentMediaUrl}")` }} />
            ) : (
              <div className="landing-summary-thumb landing-summary-thumb-empty">{blockConfig.media ? "Media" : "Text"}</div>
            )}
            <span className="landing-summary-copy">
              <strong>{blockConfig.title}</strong>
              <small>{previewText(content, blockConfig)}</small>
            </span>
          </div>
          <span className="landing-summary-action">
            <em className={row?.published ? "status-published" : "status-draft"}>{statusLabel(row)}</em>
            <b>Edit</b>
          </span>
        </summary>

        <form className="admin-form" action={saveAction}>
          <input type="hidden" name="id" value={row?.id ?? ""} />
          <input type="hidden" name="pageKey" value={pageKey} />
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="blockKey" value={blockConfig.key} />
          <div className="landing-editor-grid">
            <div className="admin-form-section">
              <div className="admin-section-heading">
                <span>텍스트</span>
                <small>{locale.toUpperCase()}</small>
              </div>
              <div className="admin-form-grid">
                {blockConfig.fields.map((field) => (
                  <Field key={field.name} field={field} content={content} />
                ))}
              </div>
            </div>
            {blockConfig.media ? <MediaPanel content={content} block={blockConfig} assets={assets} canPersist={canPersist} /> : null}
          </div>
          <div className="landing-form-actions">
            <button type="submit" disabled={!canPersist}>
              {canPersist ? "초안 저장" : "Supabase 연결 후 저장 가능"}
            </button>
          </div>
        </form>

        {row?.id ? (
          <form className="landing-publish-form" action={publishAction}>
            <input type="hidden" name="id" value={row.id} />
            <button className="admin-secondary-button" type="submit" disabled={!canPersist}>
              {canPersist ? "게시하기" : "Supabase 연결 필요"}
            </button>
          </form>
        ) : null}
      </details>
    </section>
  );
}

export function LandingEditor({
  pageKey,
  locale,
  blocks,
  assets = [],
  saveAction,
  publishAction,
  supabaseConfigured = true
}: LandingEditorProps) {
  const editorPages = getLandingEditorPages();
  const canPersist = supabaseConfigured;
  const pageBlocks = pageBlockMap[pageKey] ?? [
    {
      key: "main",
      title: landingPageOptions.find((option) => option.key === pageKey)?.label ?? pageKey,
      note: "페이지 문구와 대표 이미지",
      media: true,
      fields: commonCopyFields
    }
  ];
  const currentPageTitle = pageTitle(pageKey);
  const isSpecialEdition = pageKey === "special-edition";

  return (
    <div className="landing-editor">
      {!canPersist ? (
        <div className="admin-config-warning" role="status">
          <strong>Supabase connection required</strong>
          <p>랜딩 페이지 초안 저장, 게시, 미디어 업로드는 Supabase 연결 후 사용할 수 있습니다.</p>
        </div>
      ) : null}
      <div className="site-editor-toolbar">
        <nav className="site-editor-tabs" aria-label="Landing page editor sections">
          {editorPages.map((page) => (
            <a key={page.key} className={page.key === pageKey ? "site-editor-tab active" : "site-editor-tab"} href={`/admin/landing?page=${page.key}&locale=${locale}`}>
              <span>{page.surface}</span>
              <strong>{page.label}</strong>
              <small>{page.routeLabel}</small>
            </a>
          ))}
        </nav>
        <div className="site-editor-actions">
          <div className="admin-locale-tabs">
            {LOCALES.map((item) => (
              <a key={item} className={item === locale ? "active" : undefined} href={`/admin/landing?page=${pageKey}&locale=${item}`}>
                {LOCALE_LABELS[item]}
              </a>
            ))}
          </div>
          <a className="landing-open-public" href={publicHref(pageKey)} target="_blank" rel="noreferrer">
            공개 페이지 보기
          </a>
        </div>
      </div>

      <div className="landing-page-summary">
        <div>
          <span>{currentPageTitle}</span>
          <strong>{isSpecialEdition ? `${specialEditionGroups.length}개 챕터 편집` : `${pageBlocks.length}개 섹션 편집`}</strong>
        </div>
        <p>
          {editorPages.find((page) => page.key === pageKey)?.description ??
            "카드를 열어 수정하고, 초안 저장 후 게시하면 홈페이지에 반영됩니다."}
        </p>
      </div>

      <div className="landing-block-list">
        {isSpecialEdition
          ? specialEditionGroups.map((group, groupIndex) => {
              const groupBlocks = pageBlocks.filter((block) => group.keys.some((key) => key === block.key));

              return (
                <section className="landing-editor-group" data-editor-group={group.label} key={group.label}>
                  <header className="landing-editor-group-heading">
                    <span>{String(groupIndex + 1).padStart(2, "0")}</span>
                    <div>
                      <h2>{group.label}</h2>
                      <p>{group.note}</p>
                    </div>
                  </header>
                  <div className="landing-editor-group-blocks">
                    {groupBlocks.map((blockConfig, blockIndex) => (
                      <BlockEditor
                        key={blockConfig.key}
                        blockConfig={blockConfig}
                        row={getBlock(blocks, blockConfig.key)}
                        pageKey={pageKey}
                        locale={locale}
                        assets={assets}
                        saveAction={saveAction}
                        publishAction={publishAction}
                        initiallyOpen={groupIndex === 0 && blockIndex === 0}
                        canPersist={canPersist}
                      />
                    ))}
                  </div>
                </section>
              );
            })
          : pageBlocks.map((blockConfig, index) => (
              <BlockEditor
                key={blockConfig.key}
                blockConfig={blockConfig}
                row={getBlock(blocks, blockConfig.key)}
                pageKey={pageKey}
                locale={locale}
                assets={assets}
                saveAction={saveAction}
                publishAction={publishAction}
                initiallyOpen={index === 0}
                canPersist={canPersist}
              />
            ))}
      </div>
    </div>
  );
}
