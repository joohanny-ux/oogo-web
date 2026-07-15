import type { CSSProperties } from "react";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getLandingPageContent, landingMediaUrl, landingText } from "@/lib/home-landing";
import { getLandingBlocks } from "@/lib/public-content";
import { getRequestLocale, withLocalePrefix } from "@/lib/public-locale";
import { landingTextForLocale, pickLocaleCopy, publicCopy } from "@/lib/public-copy";

const essences = [
  { index: "01", title: "QUIET" },
  { index: "02", title: "HUMAN" },
  { index: "03", title: "LIGHT" },
  { index: "04", title: "SHADOW" },
  { index: "05", title: "MEMORY" },
  { index: "06", title: "FRAME" }
] as const;

const philosophies = [
  { index: "01", title: "Proportion", image: "/images/brand-philosophy-01.png" },
  { index: "02", title: "Balance", image: "/images/brand-philosophy-02.png" },
  { index: "03", title: "Comfort", image: "/images/brand-philosophy-03.png" },
  { index: "04", title: "Clarity", image: "/images/brand-philosophy-04.png" },
  { index: "05", title: "Timeless Form", image: "/images/brand-philosophy-05.png" }
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
  const brandCopy = publicCopy.brand;
  const resolvedEssences = essences.map((item, index) => ({
    ...item,
    title: landingText(essence, `item${index + 1}Title`, item.title),
    body: landingTextForLocale(essence, `item${index + 1}Body`, locale, brandCopy.essenceBodies[index])
  }));
  const resolvedPhilosophies = philosophies.map((item, index) => ({
    ...item,
    title: landingText(philosophy, `item${index + 1}Title`, item.title),
    body: landingTextForLocale(philosophy, `item${index + 1}Body`, locale, brandCopy.philosophyBodies[index]),
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
            <p className="eyebrow">{landingTextForLocale(hero, "eyebrow", locale, brandCopy.eyebrow)}</p>
            <h1>{landingText(hero, "heading", "OOGO")}</h1>
            <p className="brand-page-lead">{landingTextForLocale(hero, "line", locale, brandCopy.lead)}</p>
            <p className="brand-page-hero-body">{landingTextForLocale(hero, "body", locale, brandCopy.heroBody)}</p>
          </div>
          <div
            className="brand-page-hero-media"
              style={{ backgroundImage: 'url("/images/oogo-gallery.png")' } as CSSProperties}
            aria-label="OOGO brand image"
          />
        </section>

        <section className="brand-page-about" aria-labelledby="brand-about-title">
          <div>
            <p className="eyebrow">{landingTextForLocale(about, "eyebrow", locale, { ko: "About OOGO", en: "About OOGO", zh: "关于 OOGO" })}</p>
            <h2 id="brand-about-title">{landingTextForLocale(about, "heading", locale, brandCopy.aboutHeading)}</h2>
            <p>{landingTextForLocale(about, "body", locale, brandCopy.aboutBody)}</p>
          </div>
          <dl>
            <div>
              <dt>{pickLocaleCopy(locale, brandCopy.whatLabel)}</dt>
              <dd>{landingTextForLocale(about, "what", locale, brandCopy.what)}</dd>
            </div>
            <div>
              <dt>{pickLocaleCopy(locale, brandCopy.whoLabel)}</dt>
              <dd>{landingTextForLocale(about, "who", locale, brandCopy.who)}</dd>
            </div>
            <div>
              <dt>{pickLocaleCopy(locale, brandCopy.offerLabel)}</dt>
              <dd>{landingTextForLocale(about, "offer", locale, brandCopy.offer)}</dd>
            </div>
          </dl>
        </section>

        <section className="brand-page-statement" aria-label="Brand statement">
          <p className="eyebrow">{landingText(statement, "eyebrow", "Brand Statement")}</p>
          <h2>{landingTextForLocale(statement, "headline", locale, brandCopy.statementHeadline)}</h2>
          <p>{landingTextForLocale(statement, "body", locale, brandCopy.statementBody)}</p>
        </section>

        <section className="brand-page-section brand-page-essence" aria-labelledby="brand-essence-title">
          <header>
            <div>
              <p className="eyebrow">{pickLocaleCopy(locale, brandCopy.essenceEyebrow)}</p>
              <h2 id="brand-essence-title">{landingTextForLocale(essence, "heading", locale, brandCopy.essenceHeading)}</h2>
            </div>
          </header>
          <div className="brand-page-essence-grid">
            {resolvedEssences.map((item) => <article key={item.index}><span>{item.index}</span><h3>{item.title}</h3></article>)}
          </div>
        </section>

        <section className="brand-page-section brand-page-philosophy" aria-labelledby="brand-philosophy-title">
          <header>
            <div>
              <p className="eyebrow">{pickLocaleCopy(locale, brandCopy.philosophyEyebrow)}</p>
              <h2 id="brand-philosophy-title">{landingTextForLocale(philosophy, "heading", locale, brandCopy.philosophyHeading)}</h2>
            </div>
          </header>
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
          <header>
            <div>
              <p className="eyebrow">{pickLocaleCopy(locale, brandCopy.experienceEyebrow)}</p>
              <h2 id="brand-experience-title">{landingTextForLocale(experience, "heading", locale, brandCopy.experienceHeading)}</h2>
            </div>
          </header>
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
          <p>{landingTextForLocale(closing, "body", locale, brandCopy.closingBody)}</p>
          <div className="brand-page-cta">
            <a className="editorial-cta brand-page-cta-link" href={withLocalePrefix(landingText(closing, "primaryHref", "/collection"), locale)}>
              {landingTextForLocale(closing, "primaryLabel", locale, publicCopy.common.viewCollection)}
            </a>
            <a className="brand-page-cta-secondary" href={withLocalePrefix(landingText(closing, "secondaryHref", "/inquiry"), locale)}>
              {landingTextForLocale(closing, "secondaryLabel", locale, publicCopy.common.businessInquiry)}
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
