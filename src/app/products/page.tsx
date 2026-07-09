import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { ProductCatalog } from "@/components/public/ProductCatalog";
import { filterProductsByCategory, normalizeCatalogCategory, type CatalogCategory } from "@/lib/products";
import { getLandingBlocks, getPublishedProducts } from "@/lib/public-content";
import type { HeaderContent } from "@/components/public/SiteHeader";

const catalogFilters: Array<{ label: string; value: CatalogCategory; href: string }> = [
  { label: "All", value: "all", href: "/products" },
  { label: "New", value: "new", href: "/products?category=new" },
  { label: "Best", value: "best", href: "/products?category=best" },
  { label: "Sunglasses", value: "sunglasses", href: "/products?category=sunglasses" },
  { label: "Special Edition", value: "special-edition", href: "/products?category=special-edition" }
];

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = normalizeCatalogCategory(category);
  const [products, landingBlocks] = await Promise.all([getPublishedProducts("ko"), getLandingBlocks("ko")]);
  const visibleProducts = filterProductsByCategory(products, activeCategory);
  const headerBlock = landingBlocks.find((item) => item.page_key === "header" && item.block_key === "main");
  const headerContent = (headerBlock?.published_content ?? undefined) as HeaderContent | undefined;

  return (
    <>
      <SiteHeader content={headerContent} />
      <main className="catalog-page">
        <section className="catalog-hero">
          <div>
            <p className="eyebrow">2026 Collection</p>
            <h1>OOGO Collection</h1>
            <p>
              빛의 농도, 얼굴의 균형, 일상의 태도를 기준으로 정리한 OOGO의 첫 선글래스 컬렉션입니다.
            </p>
          </div>
          <div className="catalog-hero-image" aria-label="OOGO collection showroom" />
        </section>
        <div className="catalog-toolbar" aria-label="Collection summary">
          {catalogFilters.map((filter) => (
            <a className={filter.value === activeCategory ? "active" : undefined} href={filter.href} key={filter.value}>
              {filter.label}
            </a>
          ))}
          <span>{visibleProducts.length} frames</span>
          <span>UV400 lens</span>
        </div>
        <ProductCatalog products={visibleProducts} />
      </main>
      <SiteFooter />
    </>
  );
}
