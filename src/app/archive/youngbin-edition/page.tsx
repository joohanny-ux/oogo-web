import { ArchiveGallery } from "@/components/public/ArchiveGallery";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { buildPublicArchiveItems, getPublicArchiveItems } from "@/lib/archive-content";
import { getLandingPageContent, landingText } from "@/lib/home-landing";
import { getLandingBlocks } from "@/lib/public-content";
import { getRequestLocale, withLocalePrefix } from "@/lib/public-locale";

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
            <p className="eyebrow">{landingText(intro, "eyebrow", "Youngbin Edition")}</p>
            <h1>{landingText(intro, "heading", "Photo Archive")}</h1>
          </div>
          <div className="youngbin-archive-copy">
            <p className="youngbin-archive-credit">
              {landingText(intro, "artistCredit", "Photography by Youngbin Ji")}
            </p>
            <p>{landingText(intro, "body", "Collaboration studies and selected photographic works by Youngbin Ji.")}</p>
            <a href={withLocalePrefix("/projects/youngbin-edition", locale)}>
              {landingText(intro, "projectLabel", "View Project")}
            </a>
          </div>
        </section>
        <nav className="archive-collection-nav" aria-label="Archive collections">
          <a href={withLocalePrefix("/archive", locale)}>OOGO Archive</a>
          <a href={withLocalePrefix("/archive/youngbin-edition", locale)} aria-current="page">
            Youngbin Edition
          </a>
        </nav>
        {items.length > 0 ? (
          <ArchiveGallery items={items} label="Youngbin Edition photo archive" />
        ) : (
          <section className="archive-page-empty">
            <p>Youngbin Edition의 사진 작품을 준비하고 있습니다.</p>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
