import { InquiryForm } from "@/components/public/InquiryForm";
import type { Locale } from "@/lib/i18n";
import { landingText, type LandingContent } from "@/lib/home-landing";
import { landingTextForLocale, pickLocaleCopy, publicCopy } from "@/lib/public-copy";

export function InquirySection({
  content,
  locale = "ko"
}: {
  content?: Record<string, LandingContent>;
  locale?: Locale;
}) {
  const intro = content?.["inquiry-main"];
  const channel = content?.["direct-channel"];
  const topics = content?.["topic-guide"];
  const response = content?.["response-note"];
  const copy = publicCopy.inquiry;

  return (
    <section className="inquiry-page-layout" id="inquiry">
      <div className="inquiry-page-copy">
        <p className="eyebrow">{landingTextForLocale(intro, "eyebrow", locale, copy.eyebrow)}</p>
        <h1>{landingTextForLocale(intro, "heading", locale, copy.heading)}</h1>
        <p className="inquiry-page-body">{landingTextForLocale(intro, "body", locale, copy.body)}</p>
        <div className="inquiry-page-contact">
          <span className="inquiry-page-contact-label">
            {landingTextForLocale(channel, "eyebrow", locale, copy.direct)}
          </span>
          <a href={`mailto:${landingText(channel, "email", "contact@oogolabs.com")}`}>
            {landingText(channel, "email", "contact@oogolabs.com")}
          </a>
          <span>{landingTextForLocale(channel, "address", locale, copy.address)}</span>
        </div>
        <ul className="inquiry-page-guides" aria-label={pickLocaleCopy(locale, copy.eyebrow)}>
          {copy.topics.map((topic, index) => (
            <li key={topic.en}>{landingTextForLocale(topics, `topic${index + 1}`, locale, topic)}</li>
          ))}
        </ul>
        <p className="inquiry-page-response">
          {landingTextForLocale(response, "response", locale, copy.response)}
        </p>
      </div>
      <InquiryForm locale={locale} />
    </section>
  );
}
