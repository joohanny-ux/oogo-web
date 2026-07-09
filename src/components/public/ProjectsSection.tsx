import { getFeaturedSpecialEdition } from "@/lib/special-editions";

type ProjectsContent = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  primaryLabel?: string;
  mediaUrl?: string;
};

function value(content: ProjectsContent | undefined, key: keyof ProjectsContent, fallback: string) {
  return content?.[key]?.trim() || fallback;
}

export function ProjectsSection({ content }: { content?: ProjectsContent }) {
  const edition = getFeaturedSpecialEdition();
  const leadImageStyle = content?.mediaUrl?.trim() ? { backgroundImage: `url("${content.mediaUrl}")` } : undefined;

  return (
    <section className="projects-section" id="projects">
      <div className="projects-lead">
        <p className="eyebrow">{value(content, "eyebrow", "Projects")}</p>
        <h2>{value(content, "heading", "Limited ideas, collaborations, and image studies.")}</h2>
      </div>
      <div className="projects-grid">
        <a className="project-card project-card-large" href={`/projects/${edition.slug}`}>
          <span className="project-image" style={leadImageStyle} />
          <span className="project-copy">
            <small>{edition.year} Special Edition</small>
            <strong>{edition.title}</strong>
            <em>{value(content, "body", edition.summary)}</em>
          </span>
        </a>
        <a className="project-card" href="/archive">
          <span className="project-image project-image-archive" />
          <span className="project-copy">
            <small>Image Archive</small>
            <strong>Light studies</strong>
            <em>Campaign fragments, wearing cuts, and frame details.</em>
          </span>
        </a>
        <a className="project-card" href="/inquiry">
          <span className="project-image project-image-collab" />
          <span className="project-copy">
            <small>Future collaboration</small>
            <strong>Open project</strong>
            <em>Retail, buyer, and brand collaboration inquiries.</em>
          </span>
        </a>
      </div>
    </section>
  );
}
