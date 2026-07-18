import { ArchiveSection } from "@/components/public/ArchiveSection";
import { CollectionPreview } from "@/components/public/CollectionPreview";
import { HeroSection } from "@/components/public/HeroSection";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SpecialEditionSection } from "@/components/public/SpecialEditionSection";
import { getFeaturedProducts, getLandingPageContentForLocale } from "@/lib/public-content";
import { getRequestLocale } from "@/lib/public-locale";

export default async function HomePage() {
  const locale = await getRequestLocale();
  const [products, homeContent] = await Promise.all([
    getFeaturedProducts(locale),
    getLandingPageContentForLocale("home", locale)
  ]);

  return (
    <>
      <SiteHeader overlay />
      <main className="home-gallery-page">
        <HeroSection content={homeContent.hero} locale={locale} />
        <CollectionPreview products={products} content={homeContent["collection-preview"]} locale={locale} />
        <SpecialEditionSection content={homeContent["special-preview"]} locale={locale} />
        <ArchiveSection content={homeContent["archive-preview"]} locale={locale} />
      </main>
      <SiteFooter />
    </>
  );
}
