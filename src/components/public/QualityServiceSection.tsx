import { getServiceHighlights } from "@/lib/service";

export function QualityServiceSection() {
  const highlights = getServiceHighlights();

  return (
    <section className="service-section" id="service">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">Quality & Service</p>
          <h2>Built for sunlight, prepared for partnership.</h2>
        </div>
        <p className="spec-note">Warranty / Materials / Buyer support</p>
      </div>
      <div className="service-grid">
        {highlights.map((item, index) => (
          <article key={item.title}>
            <small>{String(index + 1).padStart(2, "0")}</small>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
