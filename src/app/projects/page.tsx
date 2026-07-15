import type { CSSProperties } from "react";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { specialEditions } from "@/lib/special-editions";
import { getLandingPageContent, landingMediaUrl, landingText } from "@/lib/home-landing";
import { getLandingBlocks } from "@/lib/public-content";

export default async function ProjectsPage() {
  const content = getLandingPageContent(await getLandingBlocks("ko"), "projects");
  const intro = content.intro;
  const featured = content["featured-project"];
  const collaboration = content["collaboration-cta"];
  return (
    <>
      <SiteHeader />
      <main className="projects-page">
        <section className="projects-page-intro">
          <div>
            <p className="eyebrow">{landingText(intro, "eyebrow", "Projects")}</p>
            <h1>{landingText(intro, "heading", "Projects")}</h1>
          </div>
          <p>{landingText(intro, "body", "Seasonal studies / collaborations / image archive")}</p>
        </section>
        <section className="project-list" aria-label="OOGO projects">
          {specialEditions.map((project, index) => (
            <a className="project-list-card" href={index === 0 ? landingText(featured, "primaryHref", `/projects/${project.slug}`) : `/projects/${project.slug}`} key={project.id}>
              <span
                className="project-list-image"
                style={{ backgroundImage: `url("${index === 0 ? landingMediaUrl(featured, project.images.hero) : project.images.hero}")` } as CSSProperties}
              />
              <span className="project-list-copy">
                <small>{index === 0 ? landingText(featured, "year", project.year) : project.year}</small>
                <strong>{index === 0 ? landingText(featured, "heading", project.title) : project.title}</strong>
                <span>{index === 0 ? landingText(featured, "body", project.summary) : project.summary}</span>
              </span>
            </a>
          ))}
          <a className="project-list-card project-list-cta" href={landingText(collaboration, "primaryHref", "/inquiry")}>
            <span className="project-list-cta-copy">
              <small>{landingText(collaboration, "eyebrow", "Next")}</small>
              <strong>{landingText(collaboration, "heading", "Open collaboration")}</strong>
              <span>{landingText(collaboration, "body", "Buyer, retail, and campaign inquiries.")}</span>
            </span>
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
