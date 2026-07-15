import { getFeaturedSpecialEdition } from "@/lib/special-editions";
import type { CSSProperties } from "react";
import type { Locale } from "@/lib/i18n";
import { landingMediaUrl, landingText, type LandingContent } from "@/lib/home-landing";
import { withLocalePrefix } from "@/lib/locale-path";
import { landingTextForLocale, publicCopy } from "@/lib/public-copy";

type ProjectStyle = CSSProperties & { "--home-project-image": string };

export function SpecialEditionSection({
  content,
  locale = "ko"
}: {
  content?: LandingContent;
  locale?: Locale;
}) {
  const edition = getFeaturedSpecialEdition();
  const href = withLocalePrefix(landingText(content, "primaryHref", "/projects/youngbin-edition"), locale);
  const style: ProjectStyle = {
    "--home-project-image": `url("${landingMediaUrl(content, "/images/oogo-gallery.png")}")`
  };

  return (
    <section className="editorial-section projects-section" id="projects">
      <a className="gallery-image" href={href} aria-label={`${landingText(content, "heading", edition.title)} project`} style={style} />
      <div className="editorial-copy">
        <p className="eyebrow">{landingTextForLocale(content, "eyebrow", locale, publicCopy.home.projectsEyebrow)}</p>
        <h2>{landingTextForLocale(content, "heading", locale, publicCopy.home.projectsHeading)}</h2>
        <p>{landingTextForLocale(content, "body", locale, publicCopy.home.projectsBody)}</p>
        <a className="editorial-cta" href={href}>
          {landingTextForLocale(content, "primaryLabel", locale, publicCopy.common.viewProject)}
        </a>
      </div>
    </section>
  );
}
