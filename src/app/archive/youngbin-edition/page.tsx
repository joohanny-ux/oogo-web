import { ArchiveGallery } from "@/components/public/ArchiveGallery";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { buildPublicArchiveItems, getPublicArchiveItems } from "@/lib/archive-content";
import { getLandingPageContent, landingText } from "@/lib/home-landing";
import { getLandingBlocks } from "@/lib/public-content";
import { getRequestLocale, withLocalePrefix } from "@/lib/public-locale";
import { landingTextForLocale, pickLocaleCopy, publicCopy } from "@/lib/public-copy";

export default async function YoungbinEditionArchivePage() {
  const locale = await getRequestLocale();
  const [blocks, rows] = await Promise.all([
    getLandingBlocks(locale),
    getPublicArchiveItems("youngbin-edition")
  ]);
  const content = getLandingPageContent(blocks, "special-edition");
  const intro = content["youngbin-archive"];
  const items = buildPublicArchiveItems(rows, [], "youngbin-edition");

  return (
    <>
      <SiteHeader />
      <main className="archive-page youngbin-archive-page">
        <section className="archive-page-intro youngbin-archive-intro">
          <div>
            <p className="eyebrow">
              {landingTextForLocale(intro, "eyebrow", locale, publicCopy.archive.youngbinEdition)}
            </p>
            <h1>{landingTextForLocale(intro, "heading", locale, publicCopy.archive.photoArchive)}</h1>
          </div>
          <div className="youngbin-archive-copy">
            <p className="youngbin-archive-credit">
              {landingTextForLocale(intro, "artistCredit", locale, publicCopy.archive.artistCredit)}
            </p>
            <p>{landingTextForLocale(intro, "body", locale, publicCopy.archive.youngbinBody)}</p>
            <a href={withLocalePrefix("/projects/youngbin-edition", locale)}>
              {landingTextForLocale(intro, "projectLabel", locale, publicCopy.common.viewProject)}
            </a>
          </div>
        </section>
        <nav className="archive-collection-nav" aria-label="Archive collections">
          <a href={withLocalePrefix("/archive", locale)}>{pickLocaleCopy(locale, publicCopy.archive.oogoArchive)}</a>
          <a href={withLocalePrefix("/archive/youngbin-edition", locale)} aria-current="page">
            {pickLocaleCopy(locale, publicCopy.archive.youngbinEdition)}
          </a>
        </nav>
        {items.length > 0 ? (
          <ArchiveGallery items={items} label="Youngbin Edition photo archive" locale={locale} />
        ) : (
          <section className="archive-page-empty">
            <p>{pickLocaleCopy(locale, publicCopy.archive.empty)}</p>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
