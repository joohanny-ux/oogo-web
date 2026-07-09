import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getSpecialEditionBySlug } from "@/lib/special-editions";

const imageStyle = (url: string, fit: CSSProperties["backgroundSize"] = "cover") =>
  ({
    backgroundImage: `url("${url}")`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: fit
  }) satisfies CSSProperties;

export default function YoungbinEditionPage() {
  const edition = getSpecialEditionBySlug("youngbin-edition");

  if (!edition) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="project-detail-page">
        <section className="project-detail-hero" aria-label={`${edition.title} overview`}>
          <figure className="project-detail-hero-media" style={imageStyle(edition.images.hero)}>
            <figcaption>{edition.title}</figcaption>
          </figure>
          <div className="project-detail-hero-copy">
            <p className="eyebrow">Special Edition</p>
            <h1>{edition.title}</h1>
            <p className="project-detail-meta">{edition.year} · {edition.collaborator}</p>
            <p className="project-detail-lead">{edition.lead}</p>
            <a className="editorial-cta project-detail-cta" href="/inquiry">
              {edition.cta}
            </a>
          </div>
        </section>

        <section className="project-editorial" aria-label={`${edition.title} editorial`}>
          {edition.editorial.map((block, index) => {
            if (block.kind === "text") {
              return (
                <div className="project-editorial-text" key={`text-${index}`}>
                  <p>{block.body}</p>
                </div>
              );
            }

            return (
              <figure
                className={`project-editorial-media project-editorial-media-${block.span ?? "half"} project-editorial-media-${block.key}`}
                key={`${block.key}-${index}`}
                style={imageStyle(edition.images[block.key], block.fit ?? "cover")}
              >
                <figcaption>{block.label}</figcaption>
              </figure>
            );
          })}
        </section>

        <section className="project-detail-footer-cta">
          <a className="editorial-cta project-detail-cta" href="/inquiry">
            {edition.cta}
          </a>
          <a className="project-back-link" href="/projects">
            All projects
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
