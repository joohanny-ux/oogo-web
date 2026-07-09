import { ArchiveSection } from "@/components/public/ArchiveSection";
import { CollectionPreview } from "@/components/public/CollectionPreview";
import { HeroSection } from "@/components/public/HeroSection";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SpecialEditionSection } from "@/components/public/SpecialEditionSection";
import { getFeaturedProducts } from "@/lib/public-content";

export default async function HomePage() {
  const products = await getFeaturedProducts("ko");

  return (
    <>
      <SiteHeader />
      <main className="home-gallery-page">
        <HeroSection />
        <CollectionPreview products={products} />
        <SpecialEditionSection />
        <ArchiveSection />
      </main>
      <SiteFooter />
    </>
  );
}
