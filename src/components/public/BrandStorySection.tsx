const essence = [
  {
    title: "Quiet presence",
    description: "눈에 띄기보다 오래 남는 인상."
  },
  {
    title: "Balanced silhouette",
    description: "얼굴의 비례를 흐트러뜨리지 않는 선."
  },
  {
    title: "Everyday light",
    description: "강한 햇빛과 일상의 빛을 자연스럽게 통과하는 렌즈."
  }
];

export function BrandStorySection() {
  return (
    <section className="section-block brand-story" id="brand">
      <div className="section-kicker">Brand</div>
      <div className="split-layout">
        <div>
          <p className="eyebrow">Statement</p>
          <h2>조용한 자신감은 과시가 아니라 태도에서 시작됩니다.</h2>
        </div>
        <div className="story-copy">
          <p>
            얼굴을 덮기보다 정리하는 선. 빛을 막기보다 인상을 남기는 렌즈.
          </p>
        </div>
      </div>
      <div className="essence-feature">
        <div className="essence-image" aria-label="OOGO showroom with sunglasses" />
        <div className="essence-list">
          {essence.map((item, index) => (
            <article key={item.title}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
