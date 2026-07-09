import { getFeaturedSpecialEdition } from "@/lib/special-editions";

export function SpecialEditionSection() {
  const edition = getFeaturedSpecialEdition();

  return (
    <section className="editorial-section projects-section" id="projects">
      <a className="gallery-image" href="/projects/youngbin-edition" aria-label={`${edition.title} project`} />
      <div className="editorial-copy">
        <p className="eyebrow">Projects</p>
        <h2>{edition.title}</h2>
        <p>Limited image studies and seasonal edits.</p>
        <a className="editorial-cta" href="/projects/youngbin-edition">
          View project
        </a>
      </div>
    </section>
  );
}
