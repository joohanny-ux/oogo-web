// 공개 사이트 로케일별 기본 카피 (CMS 미게시·한글 혼입 시 폴백)
import type { Locale } from "@/lib/i18n";

export type LocaleCopy = Record<Locale, string>;

export function pickLocaleCopy(locale: Locale, copy: LocaleCopy): string {
  return copy[locale] || copy.en || copy.ko;
}

export function containsHangul(value: string) {
  return /[\uAC00-\uD7A3]/.test(value);
}

export function resolveLocaleText(value: string | undefined, locale: Locale, copy: LocaleCopy) {
  if (typeof value === "string" && value.trim()) {
    const trimmed = value.trim();
    if (locale !== "ko" && containsHangul(trimmed)) {
      return pickLocaleCopy(locale, copy);
    }
    return trimmed;
  }

  return pickLocaleCopy(locale, copy);
}

export function landingTextForLocale(
  content: Record<string, unknown> | null | undefined,
  key: string,
  locale: Locale,
  copy: LocaleCopy
) {
  const value = content?.[key];
  return resolveLocaleText(typeof value === "string" ? value : undefined, locale, copy);
}

export const publicCopy = {
  nav: {
    brand: { ko: "Brand", en: "Brand", zh: "品牌" },
    collection: { ko: "Collection", en: "Collection", zh: "系列" },
    projects: { ko: "Projects", en: "Projects", zh: "项目" },
    archive: { ko: "Archive", en: "Archive", zh: "档案" },
    inquiry: { ko: "Inquiry", en: "Inquiry", zh: "咨询" }
  },
  common: {
    viewAll: { ko: "View all", en: "View all", zh: "查看全部" },
    viewArchive: { ko: "View archive", en: "View archive", zh: "查看档案" },
    viewProject: { ko: "View project", en: "View project", zh: "查看项目" },
    viewCollection: { ko: "View Collection", en: "View Collection", zh: "查看系列" },
    businessInquiry: { ko: "Business Inquiry", en: "Business Inquiry", zh: "商务咨询" },
    buyerRetail: {
      ko: "Buyer / Retail / Collaboration",
      en: "Buyer / Retail / Collaboration",
      zh: "采购 / 零售 / 合作"
    },
    brandStory: { ko: "Brand Story", en: "Brand Story", zh: "品牌故事" },
    terms: { ko: "Terms & Conditions", en: "Terms & Conditions", zh: "使用条款" },
    privacy: { ko: "Privacy Policy", en: "Privacy Policy", zh: "隐私政策" },
    copyright: {
      ko: "© 2026 OOGO. All rights reserved.",
      en: "© 2026 OOGO. All rights reserved.",
      zh: "© 2026 OOGO. 保留所有权利。"
    }
  },
  home: {
    heroEyebrow: { ko: "OOGO 2026", en: "OOGO 2026", zh: "OOGO 2026" },
    heroHeading: { ko: "OOGO", en: "OOGO", zh: "OOGO" },
    heroLine: {
      ko: "Frames for light, face, and quiet attitude.",
      en: "Frames for light, face, and quiet attitude.",
      zh: "为光、面容与安静态度而设计的镜框。"
    },
    collectionEyebrow: { ko: "Collection", en: "Collection", zh: "系列" },
    projectsEyebrow: { ko: "Projects", en: "Projects", zh: "项目" },
    projectsHeading: { ko: "Youngbin Edition", en: "Youngbin Edition", zh: "Youngbin 特别版" },
    projectsBody: {
      ko: "Limited image studies and seasonal edits.",
      en: "Limited image studies and seasonal edits.",
      zh: "限定影像研究与季刊编辑。"
    },
    archiveEyebrow: { ko: "Archive", en: "Archive", zh: "档案" },
    footerBrand: {
      ko: "Frames for light, face, and quiet attitude.",
      en: "Frames for light, face, and quiet attitude.",
      zh: "为光、面容与安静态度而设计的镜框。"
    }
  },
  a11y: {
    heroCarousel: { ko: "OOGO 하이라이트", en: "OOGO highlights", zh: "OOGO 精选" },
    slideView: {
      ko: "슬라이드 보기",
      en: "View slide",
      zh: "查看幻灯片"
    },
    openOriginal: {
      ko: "원본 이미지 보기",
      en: "View original image",
      zh: "查看原图"
    },
    originalImage: {
      ko: "원본 이미지",
      en: "Original image",
      zh: "原图"
    },
    closeOriginal: {
      ko: "원본 이미지 닫기",
      en: "Close original image",
      zh: "关闭原图"
    },
    prevImage: { ko: "이전 이미지", en: "Previous image", zh: "上一张" },
    nextImage: { ko: "다음 이미지", en: "Next image", zh: "下一张" }
  },
  brand: {
    eyebrow: { ko: "Brand Story", en: "Brand Story", zh: "品牌故事" },
    lead: {
      ko: "조용하지만 분명한 존재감과 정제된 시선.",
      en: "Quiet presence and a refined way of seeing.",
      zh: "安静却鲜明的存在感，以及被整理的视线。"
    },
    heroBody: {
      ko: "OOGO는 인상과 태도를 정리하는 한국 아이웨어 브랜드입니다.",
      en: "OOGO is a Korean eyewear brand that frames impression and attitude.",
      zh: "OOGO 是整理印象与态度的韩国眼镜品牌。"
    },
    aboutHeading: {
      ko: "정제된 시선을 위한 아이웨어",
      en: "Eyewear for a refined gaze",
      zh: "为精炼视线而生的眼镜"
    },
    aboutBody: {
      ko: "OOGO는 조용하지만 분명한 존재감과 정제된 시선을 제안하는 한국 아이웨어 브랜드입니다. 단순한 패션 소품이 아니라, 인상과 태도를 정리하는 프레임을 제안합니다.",
      en: "OOGO is a Korean eyewear brand that offers quiet presence and a refined gaze. It proposes frames that organize impression and attitude, not merely fashion accessories.",
      zh: "OOGO 是提出安静却鲜明的存在感与精炼视线的韩国眼镜品牌。它提供的不只是时尚配件，而是整理印象与态度的镜框。"
    },
    what: {
      ko: "정제된 취향을 위한 프리미엄 아이웨어",
      en: "Premium eyewear for refined taste",
      zh: "面向精炼品味的高端眼镜"
    },
    who: {
      ko: "형태와 비율, 무드를 중요하게 보는 사람들",
      en: "People who value form, proportion, and mood",
      zh: "重视形态、比例与氛围的人"
    },
    offer: {
      ko: "시선을 정리하는 프레임과 조용한 존재감",
      en: "Frames that organize the gaze with quiet presence",
      zh: "整理视线的镜框与安静的存在感"
    },
    statementHeadline: {
      ko: "조용한 자신감은 과시가 아니라 태도에서 시작됩니다.",
      en: "Quiet confidence begins with attitude, not display.",
      zh: "安静的自信始于态度，而非炫耀。"
    },
    statementBody: {
      ko: "OOGO frames a way of seeing: clear, balanced, and quietly confident.",
      en: "OOGO frames a way of seeing: clear, balanced, and quietly confident.",
      zh: "OOGO 塑造一种观看方式：清晰、平衡、安静而自信。"
    },
    whatLabel: { ko: "What it is", en: "What it is", zh: "是什么" },
    whoLabel: { ko: "Who it is for", en: "Who it is for", zh: "适合谁" },
    offerLabel: { ko: "What it offers", en: "What it offers", zh: "提供什么" },
    essenceEyebrow: { ko: "Brand Essence", en: "Brand Essence", zh: "品牌本质" },
    philosophyEyebrow: { ko: "Design Philosophy", en: "Design Philosophy", zh: "设计哲学" },
    experienceEyebrow: { ko: "Brand Experience", en: "Brand Experience", zh: "品牌体验" },
    essenceHeading: {
      ko: "브랜드를 이루는 여섯 가지 가치",
      en: "Six values that shape the brand",
      zh: "构成品牌的六个价值"
    },
    philosophyHeading: {
      ko: "얼굴을 꾸미기보다 인상과 시선을 정리합니다.",
      en: "We refine impression and gaze rather than decorating the face.",
      zh: "比起装饰面部，我们更整理印象与视线。"
    },
    experienceHeading: {
      ko: "제품을 넘어 공간과 경험을 설계합니다.",
      en: "Beyond products, we design space and experience.",
      zh: "超越产品，我们设计空间与体验。"
    },
    closingBody: {
      ko: "OOGO는 단순한 아이웨어가 아니라, 한 발짝 더 깊이 바라보는 방식입니다.",
      en: "OOGO is not just eyewear — it is a way of looking one step deeper.",
      zh: "OOGO 不只是眼镜，而是更深一步的观看方式。"
    },
    essenceBodies: [
      { ko: "과시하지 않는 존재감", en: "Presence without display", zh: "不炫耀的存在感" },
      { ko: "태도와 인상을 고려하는 시선", en: "A gaze that considers attitude and impression", zh: "考虑态度与印象的视线" },
      { ko: "빛을 바라보는 감각", en: "A sensitivity to light", zh: "面向光线的感觉" },
      { ko: "깊이와 여백을 만드는 대비", en: "Contrast that creates depth and space", zh: "造出深度与留白的对比" },
      { ko: "장면으로 남는 인상", en: "An impression that remains as a scene", zh: "留在场景中的印象" },
      { ko: "시선을 정리하는 구도", en: "Composition that organizes the gaze", zh: "整理视线的构图" }
    ] as LocaleCopy[],
    philosophyBodies: [
      { ko: "얼굴과 조화를 이루는 섬세한 비례", en: "Delicate proportion in harmony with the face", zh: "与面部和谐的细致比例" },
      { ko: "형태와 구조의 균형으로 완성된 안정감", en: "Stability completed by balance of form and structure", zh: "由形态与结构的平衡完成的安定感" },
      { ko: "장시간 착용을 고려한 편안한 설계", en: "Comfort designed for long wear", zh: "考虑长时间佩戴的舒适设计" },
      { ko: "불필요한 요소를 덜어낸 선명한 디자인", en: "Clear design with unnecessary elements removed", zh: "去掉多余元素的清晰设计" },
      { ko: "오래도록 함께할 수 있는 형태", en: "A form made to last", zh: "可以长久的形态" }
    ] as LocaleCopy[]
  },
  collection: {
    eyebrow: { ko: "Collection", en: "Collection", zh: "系列" },
    heading: { ko: "Sunglasses", en: "Sunglasses", zh: "太阳镜" },
    body: { ko: "2026 OOGO Collection", en: "2026 OOGO Collection", zh: "2026 OOGO 系列" }
  },
  archive: {
    eyebrow: { ko: "Archive", en: "Archive", zh: "档案" },
    heading: { ko: "Archive", en: "Archive", zh: "档案" },
    body: {
      ko: "Visual records of OOGO frames, light, faces, and campaigns.",
      en: "Visual records of OOGO frames, light, faces, and campaigns.",
      zh: "OOGO 镜框、光线、面容与活动的视觉记录。"
    },
    oogoArchive: { ko: "OOGO Archive", en: "OOGO Archive", zh: "OOGO 档案" },
    youngbinEdition: { ko: "Youngbin Edition", en: "Youngbin Edition", zh: "Youngbin 特别版" },
    photoArchive: { ko: "Photo Archive", en: "Photo Archive", zh: "摄影档案" },
    artistCredit: {
      ko: "Photography by Youngbin Ji",
      en: "Photography by Youngbin Ji",
      zh: "摄影：Ji Youngbin"
    },
    youngbinBody: {
      ko: "Collaboration studies and selected photographic works by Youngbin Ji.",
      en: "Collaboration studies and selected photographic works by Youngbin Ji.",
      zh: "与 Ji Youngbin 的合作研究与精选摄影作品。"
    },
    empty: {
      ko: "Youngbin Edition의 사진 작품을 준비하고 있습니다.",
      en: "Photographic works for the Youngbin Edition are being prepared.",
      zh: "Youngbin 特别版摄影作品准备中。"
    }
  },
  projects: {
    eyebrow: { ko: "Projects", en: "Projects", zh: "项目" },
    heading: { ko: "Projects", en: "Projects", zh: "项目" },
    body: {
      ko: "Seasonal studies / collaborations / image archive",
      en: "Seasonal studies / collaborations / image archive",
      zh: "季刊研究 / 合作 / 影像档案"
    },
    next: { ko: "Next", en: "Next", zh: "下一步" },
    openCollab: { ko: "Open collaboration", en: "Open collaboration", zh: "开放合作" },
    openCollabBody: {
      ko: "Buyer, retail, and campaign inquiries.",
      en: "Buyer, retail, and campaign inquiries.",
      zh: "采购、零售与活动咨询。"
    }
  },
  youngbin: {
    storyBody: {
      ko: "사진가의 시선과 OOGO의 프레임이 만나 빛과 순간을 기록합니다.",
      en: "A photographer’s gaze meets OOGO frames to record light and moment.",
      zh: "摄影师的视线与 OOGO 镜框相遇，记录光线与瞬间。"
    },
    limitedBody: {
      ko: "빛을 바라보는 태도와 시선을 기억하는 감각이 만나, OOGO의 세계관을 한정판 프레임과 스페셜 패키지로 확장합니다.",
      en: "A way of looking at light meets a sense that remembers the gaze, expanding OOGO’s world into a limited frame and special package.",
      zh: "面向光线的态度与记住视线的感觉相遇，将 OOGO 的世界观延展为限量镜框与特别包装。"
    },
    featureBodies: [
      { ko: "한정 수량으로 제작되는 협업 프레임", en: "A collaboration frame produced in limited quantity", zh: "限量制作的合作镜框" },
      { ko: "에디션을 위해 구성한 전용 패키지", en: "A dedicated package composed for the edition", zh: "为特别版构成的专属包装" },
      { ko: "사진과 제품이 이어지는 캠페인 서사", en: "A campaign narrative where photo and product continue", zh: "照片与产品延续的活动叙事" }
    ] as LocaleCopy[],
    profileBody: {
      ko: "지영빈은 35년 이상 인물, 앨범 재킷, 에디토리얼과 다큐멘터리 사진을 통해 사람과 순간의 태도를 기록해 온 사진가입니다.",
      en: "Ji Youngbin is a photographer who has spent more than 35 years recording people and moments through portrait, album jacket, editorial, and documentary work.",
      zh: "Ji Youngbin 是一位超过 35 年通过人像、专辑封面、编辑与纪录片摄影记录人与瞬间态度的摄影师。"
    },
    quote: {
      ko: "모든 순간은 예술이 될 수 있다.",
      en: "Every moment can become art.",
      zh: "每一个瞬间都可以成为艺术。"
    },
    collaborationStory: {
      ko: "Collaboration Story",
      en: "Collaboration Story",
      zh: "合作故事"
    },
    campaignProduct: {
      ko: "Campaign & Product",
      en: "Campaign & Product",
      zh: "活动与产品"
    },
    editionGallery: {
      ko: "Edition Gallery",
      en: "Edition Gallery",
      zh: "特别版画廊"
    },
    archiveLabel: {
      ko: "View Photo Archive",
      en: "View Photo Archive",
      zh: "查看摄影档案"
    },
    buyerInquiry: {
      ko: "Buyer inquiry",
      en: "Buyer inquiry",
      zh: "采购咨询"
    }
  },
  product: {
    buyerCta: { ko: "Buyer inquiry", en: "Buyer inquiry", zh: "采购咨询" }
  },
  inquiry: {
    eyebrow: { ko: "문의 및 지원", en: "Contact & Support", zh: "咨询与支持" },
    heading: { ko: "제품 및 비즈니스 문의", en: "Product & Business Inquiry", zh: "产品与商务咨询" },
    body: {
      ko: "바이어, 리테일, 협업, 프레스 및 아카이브 문의를 남겨 주세요. 확인 후 이메일로 답변드립니다.",
      en: "Leave a buyer, retail, collaboration, press, or archive inquiry. We will reply by email after reviewing your message.",
      zh: "请留下采购、零售、合作、媒体或档案咨询。我们确认后将通过邮件回复。"
    },
    direct: { ko: "직접 문의", en: "Direct channel", zh: "直接联系" },
    address: { ko: "서울, 대한민국", en: "Seoul, Korea", zh: "韩国首尔" },
    topics: [
      { ko: "바이어 카탈로그", en: "Buyer catalogue", zh: "采购图册" },
      { ko: "리테일 파트너십", en: "Retail partnership", zh: "零售合作" },
      { ko: "협업 및 캠페인", en: "Collaboration / campaign", zh: "合作与活动" },
      { ko: "프레스 및 아카이브 요청", en: "Press / archive request", zh: "媒体 / 档案请求" }
    ] as LocaleCopy[],
    response: {
      ko: "영업일 기준 1~2일 이내에 이메일로 답변드립니다.",
      en: "We usually respond by email within 1-2 business days.",
      zh: "我们通常在 1~2 个工作日内通过邮件回复。"
    },
    submit: { ko: "문의 보내기", en: "Send inquiry", zh: "发送咨询" },
    submitting: { ko: "전송 중...", en: "Sending...", zh: "发送中..." },
    name: { ko: "이름", en: "Name", zh: "姓名" },
    email: { ko: "이메일", en: "Email", zh: "邮箱" },
    company: { ko: "회사", en: "Company", zh: "公司" },
    country: { ko: "국가", en: "Country", zh: "国家" },
    phone: { ko: "연락처", en: "Phone", zh: "电话" },
    website: { ko: "웹사이트", en: "Website", zh: "网站" },
    message: { ko: "문의 내용", en: "Message", zh: "咨询内容" },
    type: { ko: "문의 유형", en: "Inquiry type", zh: "咨询类型" }
  }
} as const;
