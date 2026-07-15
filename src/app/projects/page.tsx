import type { CSSProperties } from "react";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { specialEditions } from "@/lib/special-editions";
import { getLandingPageContent, landingMediaUrl, landingText } from "@/lib/home-landing";
import { getLandingBlocks } from "@/lib/public-content";
import { getRequestLocale, withLocalePrefix } from "@/lib/public-locale";
import { landingTextForLocale, publicCopy } from "@/lib/public-copy";

export default async function ProjectsPage() {
  const locale = await getRequestLocale();
  const content = getLandingPageContent(await getLandingBlocks(locale), "projects");
  const intro = content.intro;
  const featured = content["featured-project"];
  const collaboration = content["collaboration-cta"];
  return (
    <>
      <SiteHeader />
      <main className="projects-page">
        <section className="projects-page-intro">
          <div>
            <p className="eyebrow">{landingTextForLocale(intro, "eyebrow", locale, publicCopy.projects.eyebrow)}</p>
            <h1>{landingTextForLocale(intro, "heading", locale, publicCopy.projects.heading)}</h1>
          </div>
          <p>{landingTextForLocale(intro, "body", locale, publicCopy.projects.body)}</p>
        </section>
        <section className="project-list" aria-label="OOGO projects">
          {specialEditions.map((project, index) => (
            <a
              className="project-list-card"
              href={withLocalePrefix(
                index === 0 ? landingText(featured, "primaryHref", `/projects/${project.slug}`) : `/projects/${project.slug}`,
                locale
              )}
              key={project.id}
            >
              <span
                className="project-list-image"
                style={{ backgroundImage: `url("${index === 0 ? landingMediaUrl(featured, project.images.hero) : project.images.hero}")` } as CSSProperties}
              />
              <span className="project-list-copy">
                <small>{index === 0 ? landingText(featured, "year", project.year) : project.year}</small>
                <strong>{index === 0 ? landingText(featured, "heading", project.title) : project.title}</strong>
                <span>
                  {index === 0
                    ? landingTextForLocale(featured, "body", locale, {
                        ko: project.summary,
                        en: project.summary,
                        zh: project.summary
                      })
                    : project.summary}
                </span>
              </span>
            </a>
          ))}
          <a
            className="project-list-card project-list-cta"
            href={withLocalePrefix(landingText(collaboration, "primaryHref", "/inquiry"), locale)}
          >
            <span className="project-list-cta-copy">
              <small>{landingTextForLocale(collaboration, "eyebrow", locale, publicCopy.projects.next)}</small>
              <strong>{landingTextForLocale(collaboration, "heading", locale, publicCopy.projects.openCollab)}</strong>
              <span>{landingTextForLocale(collaboration, "body", locale, publicCopy.projects.openCollabBody)}</span>
            </span>
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
