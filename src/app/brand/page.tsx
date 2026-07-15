import type { CSSProperties } from "react";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getLandingPageContent, landingMediaUrl, landingText } from "@/lib/home-landing";
import { getLandingBlocks } from "@/lib/public-content";
import { getRequestLocale, withLocalePrefix } from "@/lib/public-locale";

const essences = [
  { index: "01", title: "QUIET", body: "과시하지 않는 존재감" },
  { index: "02", title: "HUMAN", body: "태도와 인상을 고려하는 시선" },
  { index: "03", title: "LIGHT", body: "빛을 바라보는 감각" },
  { index: "04", title: "SHADOW", body: "깊이와 여백을 만드는 대비" },
  { index: "05", title: "MEMORY", body: "장면으로 남는 인상" },
  { index: "06", title: "FRAME", body: "시선을 정리하는 구도" }
] as const;

const philosophies = [
  { index: "01", title: "Proportion", body: "얼굴과 조화를 이루는 섬세한 비례", image: "/images/brand-philosophy-01.png" },
  { index: "02", title: "Balance", body: "형태와 구조의 균형으로 완성된 안정감", image: "/images/brand-philosophy-02.png" },
  { index: "03", title: "Comfort", body: "장시간 착용을 고려한 편안한 설계", image: "/images/brand-philosophy-03.png" },
  { index: "04", title: "Clarity", body: "불필요한 요소를 덜어낸 선명한 디자인", image: "/images/brand-philosophy-04.png" },
  { index: "05", title: "Timeless Form", body: "오래도록 함께할 수 있는 형태", image: "/images/brand-philosophy-05.png" }
] as const;

const experienceImages = [
  "/images/brand-experience-01.png",
  "/images/brand-experience-02.png",
  "/images/brand-experience-03.png",
  "/images/brand-experience-04.png",
  "/images/brand-experience-05.png",
  "/images/brand-experience-06.png"
] as const;

export default async function BrandPage() {
  const locale = await getRequestLocale();
  const content = getLandingPageContent(await getLandingBlocks(locale), "brand-story");
  const hero = content["story-hero"];
  const about = content.about;
  const statement = content.statement;
  const essence = content.essence;
  const philosophy = content.philosophy;
  const experience = content.experience;
  const closing = content["closing-cta"];
  const resolvedEssences = essences.map((item, index) => ({
    ...item,
    title: landingText(essence, `item${index + 1}Title`, item.title),
    body: landingText(essence, `item${index + 1}Body`, item.body)
  }));
  const resolvedPhilosophies = philosophies.map((item, index) => ({
    ...item,
    title: landingText(philosophy, `item${index + 1}Title`, item.title),
    body: landingText(philosophy, `item${index + 1}Body`, item.body),
    image: index === 0 ? landingMediaUrl(philosophy, item.image) : landingText(philosophy, `image${index + 1}Url`, item.image)
  }));
  const resolvedExperienceImages = experienceImages.map((image, index) =>
    index === 0 ? landingMediaUrl(experience, image) : landingText(experience, `image${index + 1}Url`, image)
  );

  return (
    <>
      <SiteHeader />
      <main className="brand-page">
        <section className="brand-page-hero">
          <div className="brand-page-hero-copy">
            <p className="eyebrow">{landingText(hero, "eyebrow", "Brand Story")}</p>
            <h1>{landingText(hero, "heading", "OOGO")}</h1>
            <p className="brand-page-lead">{landingText(hero, "line", "조용하지만 분명한 존재감과 정제된 시선.")}</p>
            <p className="brand-page-hero-body">{landingText(hero, "body", "OOGO는 인상과 태도를 정리하는 한국 아이웨어 브랜드입니다.")}</p>
          </div>
          <div
            className="brand-page-hero-media"
              style={{ backgroundImage: 'url("/images/oogo-gallery.png")' } as CSSProperties}
            aria-label="OOGO brand image"
          />
        </section>

        <section className="brand-page-about" aria-labelledby="brand-about-title">
          <div>
            <p className="eyebrow">{landingText(about, "eyebrow", "About OOGO")}</p>
            <h2 id="brand-about-title">{landingText(about, "heading", "정제된 시선을 위한 아이웨어")}</h2>
            <p>{landingText(about, "body", "OOGO는 조용하지만 분명한 존재감과 정제된 시선을 제안하는 한국 아이웨어 브랜드입니다. 단순한 패션 소품이 아니라, 인상과 태도를 정리하는 프레임을 제안합니다.")}</p>
          </div>
          <dl>
            <div><dt>What it is</dt><dd>{landingText(about, "what", "정제된 취향을 위한 프리미엄 아이웨어")}</dd></div>
            <div><dt>Who it is for</dt><dd>{landingText(about, "who", "형태와 비율, 무드를 중요하게 보는 사람들")}</dd></div>
            <div><dt>What it offers</dt><dd>{landingText(about, "offer", "시선을 정리하는 프레임과 조용한 존재감")}</dd></div>
          </dl>
        </section>

        <section className="brand-page-statement" aria-label="Brand statement">
          <p className="eyebrow">{landingText(statement, "eyebrow", "Brand Statement")}</p>
          <h2>{landingText(statement, "headline", "조용한 자신감은 과시가 아니라 태도에서 시작됩니다.")}</h2>
          <p>{landingText(statement, "body", "OOGO frames a way of seeing: clear, balanced, and quietly confident.")}</p>
        </section>

        <section className="brand-page-section brand-page-essence" aria-labelledby="brand-essence-title">
          <header><div><p className="eyebrow">Brand Essence</p><h2 id="brand-essence-title">{landingText(essence, "heading", "브랜드를 이루는 여섯 가지 가치")}</h2></div></header>
          <div className="brand-page-essence-grid">
            {resolvedEssences.map((item) => <article key={item.index}><span>{item.index}</span><h3>{item.title}</h3></article>)}
          </div>
        </section>

        <section className="brand-page-section brand-page-philosophy" aria-labelledby="brand-philosophy-title">
          <header><div><p className="eyebrow">Design Philosophy</p><h2 id="brand-philosophy-title">{landingText(philosophy, "heading", "얼굴을 꾸미기보다 인상과 시선을 정리합니다.")}</h2></div></header>
          <div className="brand-page-philosophy-grid">
            {resolvedPhilosophies.map((item) => (
              <article key={item.index}>
                <div style={{ backgroundImage: `url("${item.image}")` } as CSSProperties} />
                <span>{item.index}</span><h3>{item.title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="brand-page-section brand-page-experience" aria-labelledby="brand-experience-title">
          <header><div><p className="eyebrow">Brand Experience</p><h2 id="brand-experience-title">{landingText(experience, "heading", "제품을 넘어 공간과 경험을 설계합니다.")}</h2></div></header>
          <div className="brand-page-experience-grid">
            {resolvedExperienceImages.map((image, index) => {
              const studioShot = index === 1 || index === 3 || index === 5;
              return (
                <figure key={`${image}-${index}`} className={studioShot ? "is-studio" : undefined}>
                  <span style={{ backgroundImage: `url("${image}")` } as CSSProperties} />
                </figure>
              );
            })}
          </div>
        </section>

        <section className="brand-page-closing">
          <p>{landingText(closing, "body", "OOGO는 단순한 아이웨어가 아니라, 한 발짝 더 깊이 바라보는 방식입니다.")}</p>
          <div className="brand-page-cta">
            <a className="editorial-cta brand-page-cta-link" href={withLocalePrefix(landingText(closing, "primaryHref", "/collection"), locale)}>{landingText(closing, "primaryLabel", "View Collection")}</a>
            <a className="brand-page-cta-secondary" href={withLocalePrefix(landingText(closing, "secondaryHref", "/inquiry"), locale)}>{landingText(closing, "secondaryLabel", "Business Inquiry")}</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
