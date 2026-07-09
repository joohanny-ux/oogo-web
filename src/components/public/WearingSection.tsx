export function WearingSection() {
  return (
    <section className="wearing-section" id="wearing">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">Wearing</p>
          <h2>On face. In light.</h2>
        </div>
        <p className="spec-note">Fit study</p>
      </div>
      <div className="wearing-grid">
        <article className="wearing-panel wearing-panel-large">
          <span>Fit impression</span>
        </article>
        <article className="wearing-panel wearing-panel-front">
          <span>Front balance</span>
        </article>
        <article className="wearing-panel wearing-panel-side">
          <span>Side line</span>
        </article>
      </div>
    </section>
  );
}
