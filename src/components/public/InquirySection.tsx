import { InquiryForm } from "@/components/public/InquiryForm";
import { landingText, type LandingContent } from "@/lib/home-landing";

function localizedText(
  content: LandingContent | undefined,
  key: string,
  fallback: string,
  legacyEnglish: string
) {
  const value = landingText(content, key, fallback);
  return value === legacyEnglish ? fallback : value;
}

export function InquirySection({ content }: { content?: Record<string, LandingContent> }) {
  const intro = content?.["inquiry-main"];
  const channel = content?.["direct-channel"];
  const topics = content?.["topic-guide"];
  const response = content?.["response-note"];
  return (
    <section className="inquiry-page-layout" id="inquiry">
      <div className="inquiry-page-copy">
        <p className="eyebrow">{localizedText(intro, "eyebrow", "문의 및 지원", "Contact & Support")}</p>
        <h1>{localizedText(intro, "heading", "제품 및 비즈니스 문의", "Product & Business Inquiry")}</h1>
        <p className="inquiry-page-body">
          {localizedText(
            intro,
            "body",
            "바이어, 리테일, 협업, 프레스 및 아카이브 문의를 남겨 주세요. 확인 후 이메일로 답변드립니다.",
            "OOGO welcomes buyer, retail, collaboration, press, and archive requests. Share your message and we will respond by email."
          )}
        </p>
        <div className="inquiry-page-contact">
          <span className="inquiry-page-contact-label">
            {localizedText(channel, "eyebrow", "직접 문의", "Direct channel")}
          </span>
          <a href={`mailto:${landingText(channel, "email", "contact@oogolabs.com")}`}>{landingText(channel, "email", "contact@oogolabs.com")}</a>
          <span>{localizedText(channel, "address", "서울, 대한민국", "Seoul, Korea")}</span>
        </div>
        <ul className="inquiry-page-guides" aria-label="문의 분야">
          <li>{localizedText(topics, "topic1", "바이어 카탈로그", "Buyer catalogue")}</li>
          <li>{localizedText(topics, "topic2", "리테일 파트너십", "Retail partnership")}</li>
          <li>{localizedText(topics, "topic3", "협업 및 캠페인", "Collaboration / campaign")}</li>
          <li>{localizedText(topics, "topic4", "프레스 및 아카이브 요청", "Press / archive request")}</li>
        </ul>
        <p className="inquiry-page-response">
          {localizedText(
            response,
            "response",
            "영업일 기준 1~2일 이내에 이메일로 답변드립니다.",
            "We usually respond within 1-2 business days."
          )}
        </p>
      </div>
      <InquiryForm />
    </section>
  );
}
