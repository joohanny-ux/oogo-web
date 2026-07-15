import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getSpecialEditionBySlug } from "@/lib/special-editions";
import { getLandingPageContent, landingMediaUrl, landingText } from "@/lib/home-landing";
import { getLandingBlocks } from "@/lib/public-content";
import { getRequestLocale, withLocalePrefix } from "@/lib/public-locale";

const imageStyle = (url: string, fit: CSSProperties["backgroundSize"] = "cover") =>
  ({
    backgroundImage: `url("${url}")`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: fit
  }) satisfies CSSProperties;

export default async function YoungbinEditionPage() {
  const edition = getSpecialEditionBySlug("youngbin-edition");

  if (!edition) {
    notFound();
  }

  const locale = await getRequestLocale();
  const photoArchiveHref = withLocalePrefix("/archive/youngbin-edition", locale);
  const content = getLandingPageContent(await getLandingBlocks(locale), "special-edition");
  const hero = content["special-hero"];
  const statement = content["collaboration-statement"];
  const limited = content["limited-edition"];
  const galleryBlock = content["edition-gallery"];
  const profile = content["photographer-profile"];
  const footerCta = content["footer-cta"];
  const limitedFeatures = edition.limited.features.map((feature, index) => ({
    title: landingText(limited, `feature${index + 1}Title`, feature.title),
    body: landingText(limited, `feature${index + 1}Body`, feature.body)
  }));
  const gallery = edition.gallery
    .map((image, index) => ({
      ...image,
      src:
        index === 0
          ? landingMediaUrl(galleryBlock, image.src)
          : landingText(galleryBlock, `image${index + 1}Url`, image.src)
    }))
    .filter((image, index) => image.src.length > 0 && index > 0)
    .slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main className="project-detail-page youngbin-project-page">
        <section
          className="youngbin-project-hero"
          style={imageStyle(landingMediaUrl(hero, edition.images.collaborationHero))}
          aria-label={`${edition.title} collaboration`}
        >
          <div className="youngbin-project-hero-copy">
            <p className="eyebrow">{landingText(hero, "eyebrow", "OOGO x JI YOUNGBIN")}</p>
            <h1>{landingText(hero, "heading", edition.title)}</h1>
            <p className="youngbin-project-meta">
              {landingText(hero, "subtitle", `${edition.year} · ${edition.collaborator}`)}
            </p>
            <p className="youngbin-project-lead">{landingText(hero, "body", edition.story)}</p>
          </div>
        </section>

        <section className="youngbin-project-story-edition" aria-labelledby="youngbin-story-title">
          <div className="youngbin-project-story-copy">
            <p className="eyebrow">Collaboration Story</p>
            <h2 id="youngbin-story-title">
              {landingText(statement, "statementEn", edition.statement.statementEn)}
            </h2>
            <p className="youngbin-project-story-body">{landingText(statement, "bodyKo", edition.statement.bodyKo)}</p>
            <div className="youngbin-project-edition-intro">
              <p className="eyebrow">{landingText(limited, "eyebrow", edition.limited.eyebrow)}</p>
              <h3>{landingText(limited, "heading", edition.limited.heading)}</h3>
              <p className="youngbin-project-edition-meta">
                {limitedFeatures.map((feature) => feature.title).join(" · ")}
              </p>
            </div>
          </div>
          <div
            className="youngbin-project-story-media"
            style={imageStyle(landingMediaUrl(limited, edition.images.limitedEdition))}
            role="img"
            aria-label="Youngbin Edition package and frame"
          />
        </section>

        <section className="youngbin-project-gallery" aria-labelledby="youngbin-gallery-title">
          <header className="youngbin-project-section-heading">
            <div>
              <p className="eyebrow">Campaign & Product</p>
              <h2 id="youngbin-gallery-title">Edition Gallery</h2>
            </div>
          </header>
          <div className="youngbin-project-gallery-grid">
            {gallery.map((image, index) => (
              <div
                className={`youngbin-project-gallery-item youngbin-project-gallery-item-${index + 1}`}
                key={image.key}
                style={imageStyle(image.src, image.fit)}
                role="img"
                aria-label={`${edition.title} gallery image ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="youngbin-project-profile" aria-labelledby="youngbin-profile-title">
          <div
            className="youngbin-project-profile-media"
            style={imageStyle(landingMediaUrl(profile, edition.images.photographerProfile))}
            role="img"
            aria-label={edition.profile.name}
          />
          <div className="youngbin-project-profile-copy">
            <p className="eyebrow">{landingText(profile, "eyebrow", edition.profile.eyebrow)}</p>
            <h2 id="youngbin-profile-title">{landingText(profile, "name", edition.profile.name)}</h2>
            <p className="youngbin-project-profile-role">{landingText(profile, "role", edition.profile.role)}</p>
            <blockquote>
              <strong>{landingText(profile, "quoteKo", edition.profile.quoteKo)}</strong>
              <span>{landingText(profile, "quoteEn", edition.profile.quoteEn)}</span>
            </blockquote>
            <p>{landingText(profile, "body", edition.profile.body)}</p>
            <ul>
              {edition.profile.credentials.map((credential, index) => (
                <li key={credential}>{landingText(profile, `credential${index + 1}`, credential)}</li>
              ))}
            </ul>
            <div className="youngbin-project-profile-actions">
              <a
                className="youngbin-project-button youngbin-project-button-dark"
                href={withLocalePrefix(
                  landingText(profile, "archiveHref", edition.profile.archiveHref || photoArchiveHref),
                  locale
                )}
              >
                {landingText(profile, "archiveLabel", edition.profile.archiveLabel)}
              </a>
              <a
                className="youngbin-project-text-link"
                href={withLocalePrefix(landingText(footerCta, "primaryHref", "/inquiry"), locale)}
              >
                {landingText(footerCta, "primaryLabel", edition.cta)}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
