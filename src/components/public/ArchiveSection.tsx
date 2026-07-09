const archiveItems = [
  {
    className: "archive-image-wearing"
  },
  {
    className: "archive-image-front"
  },
  {
    className: "archive-image-side"
  },
  {
    className: "archive-image-space"
  }
];

export function ArchiveSection() {
  return (
    <section className="archive-section" id="archive">
      <div className="archive-heading">
        <p className="eyebrow">Archive</p>
      </div>
      <div className="archive-grid">
        {archiveItems.map((item) => (
          <article className="archive-card" key={item.className}>
            <div className={`archive-image ${item.className}`} />
          </article>
        ))}
      </div>
    </section>
  );
}
