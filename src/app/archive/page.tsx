import { ArchiveGallery } from "@/components/public/ArchiveGallery";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { buildPublicArchiveItems, getPublicArchiveItems } from "@/lib/archive-content";
import { archiveGridItems } from "@/lib/archive-items";
import { getLandingPageContent, landingMediaUrl, landingText } from "@/lib/home-landing";
import { getLandingBlocks } from "@/lib/public-content";

export default async function ArchivePage() {
  const [landingBlocks, archiveRows] = await Promise.all([getLandingBlocks("ko"), getPublicArchiveItems("oogo")]);
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
          <p className="eyebrow">{landingText(intro, "eyebrow", "Archive")}</p>
          <h1>{landingText(intro, "heading", "Archive")}</h1>
          <p>{landingText(intro, "body", "Visual records of OOGO frames, light, faces, and campaigns.")}</p>
        </section>
        <nav className="archive-collection-nav" aria-label="Archive collections">
          <a href="/archive" aria-current="page">OOGO Archive</a>
          <a href="/archive/youngbin-edition">Youngbin Edition</a>
        </nav>
        <ArchiveGallery items={items} />
      </main>
      <SiteFooter />
    </>
  );
}
