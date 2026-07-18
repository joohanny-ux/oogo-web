import React from "react";
import { HeroSlidesEditor, type HeroSlideInput } from "@/components/admin/HeroSlidesEditor";
import { ImageGalleryEditor } from "@/components/admin/ImageGalleryEditor";
import { LandingBlockDetails } from "@/components/admin/LandingBlockDetails";
import { LandingEditorToolbar } from "@/components/admin/LandingEditorToolbar";
import { SocialLinksEditor, type SocialLinkInput, type SocialPlatform } from "@/components/admin/SocialLinksEditor";
import { type Locale } from "@/lib/i18n";
import { getLandingEditorPages, landingPageOptions } from "@/lib/admin-content";
import { getLandingEditorContent } from "@/lib/landing-editor-defaults";
import { withLocalePrefix } from "@/lib/locale-path";
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
  openBlockKey?: string;
  saveAction: (formData: FormData) => void | Promise<void>;
  publishAction: (formData: FormData) => void | Promise<void>;
  savePublishAction?: (formData: FormData) => void | Promise<void>;
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
  mediaSharedFromKo?: boolean;
  heroSlides?: boolean;
  imageGallery?: {
    defaults: string[];
    title: string;
    help: string;
    startIndex?: number;
  };
  socialLinks?: boolean;
  mediaGuidance?: string;
  mediaDefaultUrl?: string;
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
  },
  {
    label: "Photo Archive",
    note: "Youngbin Edition 사진 아카이브의 상단 소개",
    keys: ["youngbin-archive"]
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
    mediaSharedFromKo: true,
    heroSlides: true,
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
    mediaSharedFromKo: true,
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
    mediaSharedFromKo: true,
    imageGallery: {
      defaults: [
        "/images/home-archive/OG26001C2_07.png",
        "/images/home-archive/OG26002C3_08.png",
        "/images/home-archive/OG26003C4_07.png",
        "/images/home-archive/OG26014C3_07.png"
      ],
      title: "Archive 이미지",
      help: "공개 페이지 왼쪽부터 표시할 이미지 4개를 설정합니다. KO 이미지는 EN/CN에도 공통으로 적용됩니다."
    },
    fields: [
      { name: "eyebrow", label: "섹션 제목", placeholder: "Archive" },
      { name: "primaryLabel", label: "Archive 링크 문구", placeholder: "View archive" },
      { name: "primaryHref", label: "Archive 링크", placeholder: "/archive" }
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
      mediaSharedFromKo: true,
      mediaGuidance: "Logo image: transparent PNG/WebP, wide ratio around 3:1, minimum 240px wide.",
      mediaDefaultUrl: "/images/oogo-logo-white.png",
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
      note: "상단 브랜드 이름, 소개 문구와 대표 이미지",
      media: true,
      mediaSharedFromKo: true,
      mediaGuidance: "Recommended 1920 x 1080px brand image, JPG/PNG/WebP max 8MB.",
      mediaDefaultUrl: "/images/oogo-gallery.png",
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
      note: "전체 폭 배경 이미지 위에 강조되는 브랜드 선언",
      media: true,
      mediaSharedFromKo: true,
      mediaGuidance: "Recommended 1920 x 900px atmospheric image, JPG/PNG/WebP max 8MB.",
      mediaDefaultUrl: "/images/oogo-hero.png",
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
      media: true,
      mediaSharedFromKo: true,
      mediaGuidance: "Recommended 1920 x 1100px dark campaign image, JPG/PNG/WebP max 8MB.",
      mediaDefaultUrl: "/images/brand-experience-03.png",
      fields: [
        { name: "heading", label: "섹션 제목", wide: true },
        ...["QUIET", "HUMAN", "LIGHT", "SHADOW", "MEMORY", "FRAME"].flatMap((title, index) => [
          {
            name: `item${index + 1}Title`,
            label: `가치 ${index + 1} 제목`,
            placeholder: title
          },
          {
            name: `item${index + 1}Body`,
            label: `가치 ${index + 1} 설명`,
            type: "textarea" as const,
            wide: true
          }
        ])
      ]
    },
    {
      key: "philosophy",
      title: "Design Philosophy",
      note: "비례, 균형, 착용감, 선명함과 오래 남는 형태",
      mediaSharedFromKo: true,
      imageGallery: {
        defaults: [
          "/images/brand-philosophy-01.png",
          "/images/brand-philosophy-02.png",
          "/images/brand-philosophy-03.png",
          "/images/brand-philosophy-04.png",
          "/images/brand-philosophy-05.png"
        ],
        title: "Design Philosophy 이미지",
        help: "공개 페이지의 다섯 철학 카드에 표시할 이미지를 순서대로 설정합니다."
      },
      fields: [
        { name: "heading", label: "섹션 제목", wide: true },
        ...["Proportion", "Balance", "Comfort", "Clarity", "Timeless Form"].map((title, index) => ({
          name: `item${index + 1}Title`,
          label: `철학 ${index + 1} 제목`,
          placeholder: title
        }))
      ]
    },
    {
      key: "experience",
      title: "Brand Experience",
      note: "공간, 제품, 패키지와 착용 이미지를 조합한 갤러리",
      mediaSharedFromKo: true,
      imageGallery: {
        defaults: [
          "/images/brand-experience-01.png",
          "/images/brand-experience-02.png",
          "/images/brand-experience-03.png",
          "/images/brand-experience-04.png",
          "/images/brand-experience-05.png",
          "/images/brand-experience-06.png"
        ],
        title: "Brand Experience 이미지",
        help: "공개 페이지 갤러리에 표시할 이미지 6개를 순서대로 설정합니다."
      },
      fields: [
        { name: "heading", label: "섹션 제목", wide: true }
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
      mediaSharedFromKo: true,
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
      note: "상품 상세의 Buyer 문의 버튼 문구와 링크",
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
      mediaSharedFromKo: true,
      mediaGuidance: "가로 2400 x 1350px 권장. 제품과 협업 분위기가 함께 보이는 대표 JPG/PNG/WebP, 최대 8MB.",
      fields: [
        { name: "eyebrow", label: "협업 표기", placeholder: "OOGO x JIYOUNGBIN" },
        { name: "heading", label: "프로젝트 제목", placeholder: "Youngbin Edition" },
        { name: "subtitle", label: "연도 / 협업자", placeholder: "2026 · JI YOUNGBIN" },
        { name: "body", label: "협업 소개", type: "textarea", wide: true }
      ]
    },
    {
      key: "collaboration-statement",
      title: "Light, Gaze, Memory",
      note: "사진과 아이웨어가 빛에서 시작된다는 협업 문장",
      fields: [
        { name: "statementEn", label: "영문 메인 문장", type: "textarea", wide: true },
        { name: "bodyKo", label: "보조 설명", type: "textarea", wide: true }
      ]
    },
    {
      key: "limited-edition",
      title: "Limited Edition",
      note: "한정판 프레임, 스페셜 패키지와 캠페인 구성을 설명하는 제품 중심 섹션",
      media: true,
      mediaSharedFromKo: true,
      mediaGuidance: "프레임과 스페셜 패키지가 함께 보이는 가로 2000 x 1200px 이미지 권장, 최대 8MB.",
      fields: [
        { name: "eyebrow", label: "작은 제목", placeholder: "Limited Edition" },
        { name: "heading", label: "메인 제목", placeholder: "Youngbin Edition" },
        { name: "feature1Title", label: "특징 1 제목", placeholder: "Limited Quantity" },
        { name: "feature2Title", label: "특징 2 제목", placeholder: "Special Package" },
        { name: "feature3Title", label: "특징 3 제목", placeholder: "Campaign & Exhibition" }
      ]
    },
    {
      key: "edition-gallery",
      title: "Edition Gallery",
      note: "갤러리 섹션 제목과 공개 페이지에 표시되는 이미지 4장",
      mediaSharedFromKo: true,
      imageGallery: {
        defaults: [
          "/images/projects/youngbin-edition/edition-gallery-01.png",
          "/images/projects/youngbin-edition/light-hands.jpg",
          "/images/projects/youngbin-edition/photographer-at-work.jpg",
          "/images/projects/youngbin-edition/edition-gallery-04.png"
        ],
        title: "Edition Gallery 이미지",
        help: "공개 프로젝트 갤러리에 표시할 이미지 4개를 순서대로 설정합니다. 이미지는 KO 탭에서 관리합니다.",
        startIndex: 2
      },
      fields: [
        { name: "eyebrow", label: "작은 제목", placeholder: "Campaign & Product" },
        { name: "heading", label: "섹션 제목", placeholder: "Edition Gallery" }
      ]
    },
    {
      key: "photographer-profile",
      title: "Photographer Profile",
      note: "짧은 작가 소개와 주요 이력 3개, 별도 Photo Archive로 연결하는 섹션",
      media: true,
      mediaSharedFromKo: true,
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
        { name: "primaryHref", label: "문의 링크", placeholder: "/inquiry" }
      ]
    },
    {
      key: "youngbin-archive",
      title: "Photo Archive Intro",
      note: "Youngbin Edition 사진 아카이브 상단의 제목, 작가 표기와 프로젝트 링크",
      fields: [
        { name: "eyebrow", label: "작은 제목", placeholder: "Youngbin Edition" },
        { name: "heading", label: "페이지 제목", placeholder: "Photo Archive" },
        { name: "artistCredit", label: "작가 표기", placeholder: "Photography by Ji Youngbin" },
        { name: "body", label: "소개", type: "textarea", wide: true },
        { name: "projectLabel", label: "프로젝트 링크 문구", placeholder: "View project" }
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
        { name: "email", label: "Email", placeholder: "contact@oogolaps.com" },
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
      note: "Footer 왼쪽의 로고와 브랜드 문구",
      media: true,
      mediaSharedFromKo: true,
      mediaGuidance: "Transparent white PNG/WebP logo recommended, minimum 240px wide.",
      mediaDefaultUrl: "/images/oogo-logo-white.png",
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
      socialLinks: true,
      fields: [
        { name: "email", label: "Email", placeholder: "contact@oogolaps.com" },
        { name: "address", label: "주소", placeholder: "Seoul, Korea" },
        { name: "termsLabel", label: "이용약관 문구", placeholder: "Terms & Conditions" },
        { name: "termsHref", label: "이용약관 링크", placeholder: "/terms-conditions" },
        { name: "privacyLabel", label: "개인정보 문구", placeholder: "Privacy Policy" },
        { name: "privacyHref", label: "개인정보 링크", placeholder: "/privacy-policy" },
        { name: "copyright", label: "Copyright", placeholder: "© 2026 OOGO. All rights reserved.", wide: true }
      ]
    }
  ]
};

export function getLandingEditorFieldContract(pageKey: string) {
  return (pageBlockMap[pageKey] ?? []).map((block) => ({
    blockKey: block.key,
    fieldNames: block.fields.map((field) => field.name)
  }));
}

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
  if (block.published && JSON.stringify(block.draft_content) !== JSON.stringify(block.published_content)) {
    return "게시 후 수정됨";
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
  return textValue(content, "mediaUrl") || textValue(content, "imageUrl") || textValue(content, "image1Url");
}

function heroSlideInputs(content: Record<string, unknown>): HeroSlideInput[] {
  const savedSlides = Array.isArray(content.slides) ? content.slides : [];
  const slides = savedSlides
    .filter((slide): slide is Record<string, unknown> => typeof slide === "object" && slide !== null && !Array.isArray(slide))
    .slice(0, 5)
    .map((slide, index) => ({
      id: textValue(slide, "id") || `hero-${index + 1}`,
      mediaType: textValue(slide, "mediaType") === "video" ? ("video" as const) : ("image" as const),
      mediaUrl: mediaUrl(slide),
      posterUrl: textValue(slide, "posterUrl"),
      alt: textValue(slide, "alt"),
      eyebrow: textValue(slide, "eyebrow"),
      heading: textValue(slide, "heading"),
      line: textValue(slide, "line")
    }))
    .filter((slide) => slide.mediaUrl);

  if (slides.length > 0) {
    return slides;
  }

  const legacyMediaUrl = mediaUrl(content);
  return [
    {
      id: "hero-1",
      mediaType: textValue(content, "mediaType") === "video" ? ("video" as const) : ("image" as const),
      mediaUrl: legacyMediaUrl || "/images/oogo-hero.png",
      posterUrl: textValue(content, "posterUrl"),
      alt: textValue(content, "alt"),
      eyebrow: "",
      heading: "",
      line: ""
    }
  ];
}

function galleryImageInputs(content: Record<string, unknown>, config: NonNullable<BlockConfig["imageGallery"]>) {
  const startIndex = config.startIndex ?? 1;
  return config.defaults.map((fallback, index) => textValue(content, `image${startIndex + index}Url`) || fallback);
}

const defaultSocialLinks: SocialLinkInput[] = [
  { id: "social-instagram", platform: "instagram", href: "https://www.instagram.com/oogolaps", label: "Instagram", visible: true },
  { id: "social-facebook", platform: "facebook", href: "https://www.facebook.com/oogolaps", label: "Facebook", visible: true },
  { id: "social-tiktok", platform: "tiktok", href: "https://www.tiktok.com/@oogolaps", label: "TikTok", visible: true },
  { id: "social-youtube", platform: "youtube", href: "https://www.youtube.com/@oogolaps", label: "YouTube", visible: true },
  { id: "social-pinterest", platform: "pinterest", href: "https://www.pinterest.com/oogolaps", label: "Pinterest", visible: true }
];

function socialLinkInputs(content: Record<string, unknown>): SocialLinkInput[] {
  if (Array.isArray(content.socialLinks)) {
    return content.socialLinks
      .filter((link): link is Record<string, unknown> => typeof link === "object" && link !== null && !Array.isArray(link))
      .map((link, index) => {
        const platform = textValue(link, "platform");
        return {
          id: textValue(link, "id") || `social-${index + 1}`,
          platform: (["instagram", "facebook", "tiktok", "youtube", "pinterest"].includes(platform) ? platform : "instagram") as SocialPlatform,
          href: textValue(link, "href"),
          label: textValue(link, "label"),
          visible: link.visible !== false
        };
      })
      .filter((link) => link.href);
  }

  return defaultSocialLinks.map((link) => ({
    ...link,
    href: textValue(content, link.platform) || link.href
  }));
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
  const currentMediaUrl = mediaUrl(content) || block.mediaDefaultUrl || "";

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
  savePublishAction,
  canPersist,
  initiallyOpen = false
}: {
  blockConfig: BlockConfig;
  row: LandingBlockRow | null;
  pageKey: string;
  locale: Locale;
  assets: AssetOption[];
  saveAction: LandingEditorProps["saveAction"];
  savePublishAction: NonNullable<LandingEditorProps["savePublishAction"]>;
  canPersist: boolean;
  initiallyOpen?: boolean;
}) {
  const content = getLandingEditorContent(pageKey, blockConfig.key, locale, row?.draft_content);
  const currentMediaUrl = mediaUrl(content) || blockConfig.mediaDefaultUrl || "";

  return (
    <section className="landing-block-editor" id={`landing-block-${blockConfig.key}`}>
      <LandingBlockDetails name={`landing-${pageKey}`} initiallyOpen={initiallyOpen}>
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

        <form className="admin-form" action={saveAction} data-landing-block-form>
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
            {blockConfig.heroSlides && locale === "ko" ? (
              <HeroSlidesEditor
                initialSlides={heroSlideInputs(content)}
                assets={assets}
                canPersist={canPersist}
                initialAutoplay={content.autoplay !== false && content.autoplay !== "false"}
                initialIntervalMs={Number(content.intervalMs ?? 6000)}
              />
            ) : blockConfig.imageGallery && (!blockConfig.mediaSharedFromKo || locale === "ko") ? (
              <ImageGalleryEditor
                initialImages={galleryImageInputs(content, blockConfig.imageGallery)}
                assets={assets}
                canPersist={canPersist}
                title={blockConfig.imageGallery.title}
                help={blockConfig.imageGallery.help}
                startIndex={blockConfig.imageGallery.startIndex}
                assetListId={`gallery-assets-${pageKey}-${blockConfig.key}`}
              />
            ) : blockConfig.socialLinks ? (
              <SocialLinksEditor initialLinks={socialLinkInputs(content)} />
            ) : blockConfig.media && (!blockConfig.mediaSharedFromKo || locale === "ko") ? (
              <MediaPanel content={content} block={blockConfig} assets={assets} canPersist={canPersist} />
            ) : blockConfig.mediaSharedFromKo ? (
              <aside className="admin-asset-panel landing-media-panel">
                <div className="admin-section-heading">
                  <span>공통 미디어</span>
                  <small>KO</small>
                </div>
                <p>이 섹션의 이미지는 모든 언어에서 한국어 버전과 공유됩니다. KO 탭에서 변경하세요.</p>
              </aside>
            ) : null}
          </div>
          <div className="landing-form-actions">
            <button type="submit" disabled={!canPersist}>
              {canPersist ? "초안 저장" : "Supabase 연결 후 저장 가능"}
            </button>
            <button className="admin-secondary-button" type="submit" formAction={savePublishAction} disabled={!canPersist}>
              {canPersist ? "저장 후 게시" : "Supabase 연결 필요"}
            </button>
          </div>
        </form>
      </LandingBlockDetails>
    </section>
  );
}

export function LandingEditor({
  pageKey,
  locale,
  blocks,
  assets = [],
  openBlockKey,
  saveAction,
  savePublishAction = saveAction,
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
      <LandingEditorToolbar
        pages={editorPages}
        pageKey={pageKey}
        locale={locale}
        publicHref={withLocalePrefix(publicHref(pageKey), locale)}
        canPersist={canPersist}
        savePublishAction={savePublishAction}
      />

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
                    {groupBlocks.map((blockConfig) => (
                      <BlockEditor
                        key={blockConfig.key}
                        blockConfig={blockConfig}
                        row={getBlock(blocks, blockConfig.key)}
                        pageKey={pageKey}
                        locale={locale}
                        assets={assets}
                        saveAction={saveAction}
                        savePublishAction={savePublishAction}
                        canPersist={canPersist}
                        initiallyOpen={openBlockKey === blockConfig.key}
                      />
                    ))}
                  </div>
                </section>
              );
            })
          : pageBlocks.map((blockConfig) => (
              <BlockEditor
                key={blockConfig.key}
                blockConfig={blockConfig}
                row={getBlock(blocks, blockConfig.key)}
                pageKey={pageKey}
                locale={locale}
                assets={assets}
                saveAction={saveAction}
                savePublishAction={savePublishAction}
                canPersist={canPersist}
                initiallyOpen={openBlockKey === blockConfig.key}
              />
            ))}
      </div>
    </div>
  );
}
