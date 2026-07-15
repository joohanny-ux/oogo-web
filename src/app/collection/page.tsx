import type { CSSProperties } from "react";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { filterProductsByCategory, getProductDetailHref, normalizeCatalogCategory } from "@/lib/products";
import { getPublishedProducts } from "@/lib/public-content";
import { getLandingBlocks } from "@/lib/public-content";
import { getLandingPageContent, landingText } from "@/lib/home-landing";

export default async function CollectionPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = normalizeCatalogCategory(category);
  const [products, blocks] = await Promise.all([getPublishedProducts("ko"), getLandingBlocks("ko")]);
  const intro = getLandingPageContent(blocks, "collection")["collection-hero"];
  const visibleProducts = filterProductsByCategory(products, activeCategory);
  const displayProducts = Array.from({ length: Math.max(visibleProducts.length, 12) }, (_, index) => {
    const product = visibleProducts[index % Math.max(visibleProducts.length, 1)];

    if (!product) {
      return null;
    }

    return {
      ...product,
      displayKey: `${product.slug}-${index}`,
      displayName: index < visibleProducts.length ? product.name : `OOGO Frame ${String(index + 1).padStart(2, "0")}`
    };
  }).filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <>
      <SiteHeader />
      <main className="collection-page">
        <section className="collection-page-intro">
          <p className="eyebrow">{landingText(intro, "eyebrow", "Collection")}</p>
          <h1>{landingText(intro, "heading", "Sunglasses")}</h1>
          <p>{landingText(intro, "body", "2026 OOGO Collection")}</p>
        </section>
        <section className="collection-list-grid" aria-label="OOGO collection products">
          {displayProducts.map((product) => {
            const frontImage = product.images?.front || product.images?.angle || "/images/oogo-product-front.png";
            const angleImage = product.images?.angle || product.images?.front || "/images/oogo-product-angle.png";

            return (
              <article className="collection-list-card" key={product.displayKey}>
                <a
                  className="collection-list-image"
                  href={getProductDetailHref(product.slug)}
                  style={{
                    backgroundImage: `url("${frontImage}")`,
                    "--hover-image": `url("${angleImage}")`
                  } as CSSProperties & Record<"--hover-image", string>}
                  aria-label={`${product.displayName} detail`}
                />
                <a className="collection-list-name" href={getProductDetailHref(product.slug)}>
                  {product.displayName}
                </a>
              </article>
            );
          })}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
