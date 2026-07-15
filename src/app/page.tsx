import { ArchiveSection } from "@/components/public/ArchiveSection";
import { CollectionPreview } from "@/components/public/CollectionPreview";
import { HeroSection } from "@/components/public/HeroSection";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SpecialEditionSection } from "@/components/public/SpecialEditionSection";
import { getHomeLandingContent } from "@/lib/home-landing";
import { getFeaturedProducts, getLandingBlocks } from "@/lib/public-content";

export default async function HomePage() {
  const [products, blocks] = await Promise.all([getFeaturedProducts("ko"), getLandingBlocks("ko")]);
  const homeContent = getHomeLandingContent(blocks);

  return (
    <>
      <SiteHeader overlay />
      <main className="home-gallery-page">
        <HeroSection content={homeContent.hero} />
        <CollectionPreview products={products} content={homeContent["collection-preview"]} />
        <SpecialEditionSection content={homeContent["special-preview"]} />
        <ArchiveSection content={homeContent["archive-preview"]} />
      </main>
      <SiteFooter />
    </>
  );
}
