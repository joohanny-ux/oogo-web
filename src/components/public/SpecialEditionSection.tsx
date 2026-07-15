import { getFeaturedSpecialEdition } from "@/lib/special-editions";
import type { CSSProperties } from "react";
import { landingMediaUrl, landingText, type LandingContent } from "@/lib/home-landing";

type ProjectStyle = CSSProperties & { "--home-project-image": string };

export function SpecialEditionSection({ content }: { content?: LandingContent }) {
  const edition = getFeaturedSpecialEdition();
  const href = landingText(content, "primaryHref", "/projects/youngbin-edition");
  const style: ProjectStyle = {
    "--home-project-image": `url("${landingMediaUrl(content, "/images/oogo-gallery.png")}")`
  };

  return (
    <section className="editorial-section projects-section" id="projects">
      <a className="gallery-image" href={href} aria-label={`${landingText(content, "heading", edition.title)} project`} style={style} />
      <div className="editorial-copy">
        <p className="eyebrow">{landingText(content, "eyebrow", "Projects")}</p>
        <h2>{landingText(content, "heading", edition.title)}</h2>
        <p>{landingText(content, "body", "Limited image studies and seasonal edits.")}</p>
        <a className="editorial-cta" href={href}>
          {landingText(content, "primaryLabel", "View project")}
        </a>
      </div>
    </section>
  );
}
