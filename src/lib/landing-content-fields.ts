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
  "posterUrl"
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
