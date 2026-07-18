// 랜딩 에디터에서 저장할 수 있는 공개 콘텐츠 필드를 정의한다.
export const LANDING_CONTENT_FIELDS = [
  "eyebrow",
  "heading",
  "line",
  "body",
  "primaryLabel",
  "primaryHref",
  "secondaryLabel",
  "secondaryHref",
  "subtitle",
  "year",
  "logoLabel",
  "logoHref",
  "nav1Label",
  "nav1Href",
  "nav2Label",
  "nav2Href",
  "nav3Label",
  "nav3Href",
  "nav4Label",
  "nav4Href",
  "nav5Label",
  "nav5Href",
  "showLocale",
  "what",
  "who",
  "offer",
  "headline",
  "item1Title",
  "item2Title",
  "item3Title",
  "item4Title",
  "item5Title",
  "item6Title",
  "item1Body",
  "item2Body",
  "item3Body",
  "item4Body",
  "item5Body",
  "item6Body",
  "image1Url",
  "image2Url",
  "image3Url",
  "image4Url",
  "image5Url",
  "image6Url",
  "buyerCta",
  "buyerHref",
  "statementEn",
  "bodyKo",
  "feature1Title",
  "feature2Title",
  "feature3Title",
  "name",
  "role",
  "quoteKo",
  "quoteEn",
  "credential1",
  "credential2",
  "credential3",
  "archiveLabel",
  "archiveHref",
  "artistCredit",
  "projectLabel",
  "topic1",
  "topic2",
  "topic3",
  "topic4",
  "response",
  "brandDescription",
  "email",
  "address",
  "instagram",
  "facebook",
  "tiktok",
  "youtube",
  "pinterest",
  "termsLabel",
  "termsHref",
  "privacyLabel",
  "privacyHref",
  "copyright",
  "posterUrl",
  "autoplay",
  "intervalMs"
] as const;

export function readLandingContentFields(
  formData: FormData,
  media?: { mediaType: string; mediaUrl: string }
) {
  const content: Record<string, unknown> = {};

  for (const key of LANDING_CONTENT_FIELDS) {
    if (formData.has(key)) {
      content[key] = String(formData.get(key) ?? "");
    }
  }

  if (media) {
    content.mediaType = media.mediaType;
    content.mediaUrl = media.mediaUrl;
    content.imageUrl = media.mediaUrl;
  }

  return content;
}

export type UploadedHeroMedia = {
  mediaType: "image" | "video";
  mediaUrl: string;
};

const SOCIAL_PLATFORMS = ["instagram", "facebook", "tiktok", "youtube", "pinterest"] as const;

type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

function isSocialPlatform(value: string): value is SocialPlatform {
  return SOCIAL_PLATFORMS.some((platform) => platform === value);
}

export function readSocialLinksFields(formData: FormData) {
  return Array.from({ length: 8 }, (_, index) => {
    const number = index + 1;
    const prefix = `social${number}`;
    const platformValue = String(formData.get(`${prefix}Platform`) ?? "");
    const href = String(formData.get(`${prefix}Href`) ?? "").trim();

    if (!href || !isSocialPlatform(platformValue)) {
      return null;
    }

    return {
      id: String(formData.get(`${prefix}Id`) ?? `social-${number}`).trim() || `social-${number}`,
      platform: platformValue,
      href,
      label: String(formData.get(`${prefix}Label`) ?? "").trim(),
      visible: formData.getAll(`${prefix}Visible`).some((value) => String(value) === "true")
    };
  }).filter((link): link is NonNullable<typeof link> => link !== null);
}

export function readHeroSlidesFields(
  formData: FormData,
  uploadedMedia: Partial<Record<number, UploadedHeroMedia>> = {}
) {
  return Array.from({ length: 5 }, (_, index) => {
    const number = index + 1;
    const prefix = `slide${number}`;
    const uploaded = uploadedMedia[number];
    const mediaUrl = uploaded?.mediaUrl ?? String(formData.get(`${prefix}MediaUrl`) ?? "").trim();

    if (!mediaUrl) {
      return null;
    }

    return {
      id: String(formData.get(`${prefix}Id`) ?? `hero-${number}`).trim() || `hero-${number}`,
      mediaType: uploaded?.mediaType ?? (String(formData.get(`${prefix}MediaType`) ?? "image") === "video" ? "video" : "image"),
      mediaUrl,
      posterUrl: String(formData.get(`${prefix}PosterUrl`) ?? "").trim(),
      alt: String(formData.get(`${prefix}Alt`) ?? "").trim(),
      eyebrow: String(formData.get(`${prefix}Eyebrow`) ?? "").trim(),
      heading: String(formData.get(`${prefix}Heading`) ?? "").trim(),
      line: String(formData.get(`${prefix}Line`) ?? "").trim()
    };
  }).filter((slide): slide is NonNullable<typeof slide> => slide !== null);
}
