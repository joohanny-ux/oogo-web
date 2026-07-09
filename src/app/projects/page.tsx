import type { CSSProperties } from "react";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { specialEditions } from "@/lib/special-editions";

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />
      <main className="projects-page">
        <section className="projects-page-intro">
          <div>
            <p className="eyebrow">Projects</p>
            <h1>Projects</h1>
          </div>
          <p>Seasonal studies / collaborations / image archive</p>
        </section>
        <section className="project-list" aria-label="OOGO projects">
          {specialEditions.map((project) => (
            <a className="project-list-card" href={`/projects/${project.slug}`} key={project.id}>
              <span
                className="project-list-image"
                style={{ backgroundImage: `url("${project.images.hero}")` } as CSSProperties}
              />
              <span className="project-list-copy">
                <small>{project.year}</small>
                <strong>{project.title}</strong>
                <span>{project.summary}</span>
              </span>
            </a>
          ))}
          <a className="project-list-card project-list-cta" href="/inquiry">
            <span className="project-list-cta-copy">
              <small>Next</small>
              <strong>Open collaboration</strong>
              <span>Buyer, retail, and campaign inquiries.</span>
            </span>
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
