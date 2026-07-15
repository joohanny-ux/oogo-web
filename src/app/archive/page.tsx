import { ArchiveGallery } from "@/components/public/ArchiveGallery";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { buildPublicArchiveItems, getPublicArchiveItems } from "@/lib/archive-content";
import { archiveGridItems } from "@/lib/archive-items";
import { getLandingPageContent, landingMediaUrl, landingText } from "@/lib/home-landing";
import { getLandingBlocks } from "@/lib/public-content";
import { getRequestLocale, withLocalePrefix } from "@/lib/public-locale";
import { landingTextForLocale, pickLocaleCopy, publicCopy } from "@/lib/public-copy";

export default async function ArchivePage() {
  const locale = await getRequestLocale();
  const [landingBlocks, archiveRows] = await Promise.all([getLandingBlocks(locale), getPublicArchiveItems("oogo")]);
  const content = getLandingPageContent(landingBlocks, "archive");
  const intro = content.intro;
  const gallery = content.gallery;
  const legacyItems = archiveGridItems.map((item, index) => ({
    ...item,
    image: index === 0 ? landingMediaUrl(gallery, item.image) : landingText(gallery, `image${index + 1}Url`, item.image)
  }));
  const items = buildPublicArchiveItems(archiveRows, legacyItems, "oogo");
  return (
    <>
      <SiteHeader />
      <main className="archive-page">
        <section className="archive-page-intro">
          <p className="eyebrow">{landingTextForLocale(intro, "eyebrow", locale, publicCopy.archive.eyebrow)}</p>
          <h1>{landingTextForLocale(intro, "heading", locale, publicCopy.archive.heading)}</h1>
          <p>{landingTextForLocale(intro, "body", locale, publicCopy.archive.body)}</p>
        </section>
        <nav className="archive-collection-nav" aria-label="Archive collections">
          <a href={withLocalePrefix("/archive", locale)} aria-current="page">
            {pickLocaleCopy(locale, publicCopy.archive.oogoArchive)}
          </a>
          <a href={withLocalePrefix("/archive/youngbin-edition", locale)}>
            {pickLocaleCopy(locale, publicCopy.archive.youngbinEdition)}
          </a>
        </nav>
        <ArchiveGallery items={items} locale={locale} />
      </main>
      <SiteFooter />
    </>
  );
}
