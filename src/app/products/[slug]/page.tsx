import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getProductDetailSections } from "@/lib/products";
import { getProductBySlug } from "@/lib/public-content";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug, "ko");

  if (!product) {
    notFound();
  }

  const englishName = product.translations?.en?.name;
  const chineseName = product.translations?.zh?.name;
  const translatedNames = [englishName, chineseName].filter(Boolean).join(" / ");
  const detailSections = getProductDetailSections(product);

  const imageStyle = (url?: string, fit: CSSProperties["backgroundSize"] = "contain") =>
    ({
      backgroundImage: `url("${url || "/images/oogo-product-front.png"}")`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: fit
    });

  return (
    <>
      <SiteHeader />
      <main className="product-detail-page">
        <section className="product-detail-gallery" aria-label={`${product.name} product views`}>
          <figure className="product-detail-media product-detail-media-front" style={imageStyle(product.images?.front)}>
            <figcaption>Front</figcaption>
          </figure>
          <figure className="product-detail-media product-detail-media-angle" style={imageStyle(product.images?.angle)}>
            <figcaption>Angle</figcaption>
          </figure>
          <figure className="product-detail-media product-detail-media-side" style={imageStyle(product.images?.side)}>
            <figcaption>Side</figcaption>
          </figure>
          <figure
            className="product-detail-media product-detail-media-wearing"
            style={imageStyle(product.images?.wearing || "/images/oogo-gallery.png", "cover")}
          >
            <figcaption>Wearing</figcaption>
          </figure>
        </section>
        <aside className="product-detail-copy">
          <p className="product-code-pill">{product.modelCode}</p>
          <h1>{product.name}</h1>
          {translatedNames ? <p className="product-translated-name">{translatedNames}</p> : null}
          {product.colorway ? <p className="product-colorway">{product.colorway}</p> : null}

          <div className="catalog-detail-list" aria-label="Product catalog details">
            {detailSections.map((section) => (
              <section className="catalog-detail-block" key={section.title}>
                <h2>{section.eyebrow}</h2>
                <p>{section.primary}</p>
                {section.secondary ? <small>{section.secondary}</small> : null}
                {section.detail ? <small>{section.detail}</small> : null}
              </section>
            ))}
          </div>

          <div className="detail-actions detail-actions-single">
            <a href="/inquiry">Buyer inquiry</a>
          </div>
        </aside>
      </main>
      <SiteFooter />
    </>
  );
}
