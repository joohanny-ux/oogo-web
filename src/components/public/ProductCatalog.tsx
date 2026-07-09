"use client";

import { useState } from "react";

type CatalogProduct = {
  slug: string;
  modelCode: string;
  name: string;
  colorway: string | null;
  description: string | null;
  size: string | null;
  frameMaterial: string | null;
  lensMaterial: string | null;
  lensFeatures: string[];
  featured: boolean;
  sortOrder: number;
  images?: Partial<Record<"angle" | "wearing" | "front" | "side", string>>;
};

export function ProductCatalog({ products }: { products: CatalogProduct[] }) {
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);

  function imageStyle(url?: string) {
    return url ? { backgroundImage: `url("${url}")` } : undefined;
  }

  return (
    <>
      <div className="catalog-grid">
        {products.map((product) => (
          <article className="product-tile compact-product-tile" key={product.modelCode}>
            <button
              aria-label={`Quick view ${product.name}`}
              className="product-visual product-quick-trigger"
              onClick={() => setSelectedProduct(product)}
              style={imageStyle(product.images?.angle)}
              type="button"
            >
              <span>{product.modelCode}</span>
            </button>
            <div className="product-tile-copy">
              <h2>{product.name}</h2>
              <p>{product.modelCode}</p>
              <div className="product-card-actions">
                <button type="button" onClick={() => setSelectedProduct(product)}>
                  Quick view
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedProduct ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedProduct(null)}>
          <section
            aria-labelledby="quick-view-title"
            aria-modal="true"
            className="quick-view-modal"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" onClick={() => setSelectedProduct(null)}>
              Close
            </button>
            <div className="quick-view-gallery" aria-label={`${selectedProduct.name} product detail views`}>
              <div
                className="quick-view-image"
                aria-label={`${selectedProduct.name} product image`}
                style={imageStyle(selectedProduct.images?.angle)}
              >
                <span>{selectedProduct.modelCode}</span>
              </div>
              <div
                className="quick-wearing-view"
                aria-label={`${selectedProduct.name} wearing impression`}
                style={imageStyle(selectedProduct.images?.wearing)}
              >
                <span>Wearing impression</span>
              </div>
              <div className="quick-view-row">
                <figure
                  className="quick-front-view"
                  aria-label={`${selectedProduct.name} front view`}
                  style={imageStyle(selectedProduct.images?.front)}
                >
                  <figcaption>Front balance</figcaption>
                </figure>
                <figure
                  className="quick-side-view"
                  aria-label={`${selectedProduct.name} side view`}
                  style={imageStyle(selectedProduct.images?.side)}
                >
                  <figcaption>Side profile</figcaption>
                </figure>
              </div>
            </div>
            <div className="quick-view-copy">
              <p className="eyebrow">{selectedProduct.modelCode}</p>
              <h2 id="quick-view-title">{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <dl>
                <div>
                  <dt>Size</dt>
                  <dd>{selectedProduct.size}</dd>
                </div>
                <div>
                  <dt>Frame</dt>
                  <dd>{selectedProduct.frameMaterial}</dd>
                </div>
                <div>
                  <dt>Lens</dt>
                  <dd>{selectedProduct.lensMaterial}</dd>
                </div>
              </dl>
              <div className="detail-actions">
                <a href="/inquiry">Request buyer catalog</a>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
