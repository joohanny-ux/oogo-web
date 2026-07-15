import { CollectionRail } from "@/components/public/CollectionRail";
import type { Locale } from "@/lib/i18n";
import { landingText, type LandingContent } from "@/lib/home-landing";
import { getProductCatalogHref } from "@/lib/products";
import { withLocalePrefix } from "@/lib/locale-path";

type CollectionProduct = {
  slug: string;
  modelCode: string;
  name: string;
  colorway?: string | null;
  size: string | null;
  images?: Partial<Record<"angle" | "front", string>>;
};

export function CollectionPreview({
  products,
  content,
  locale = "ko"
}: {
  products: CollectionProduct[];
  content?: LandingContent;
  locale?: Locale;
}) {
  const displayProducts = products.length === 0 ? [] : Array.from({ length: Math.max(8, products.length) }, (_, index) => {
    const product = products[index % products.length];

    if (!product) {
      return null;
    }

    return {
      ...product,
      previewKey: `${product.modelCode}-${index}`,
      previewName: index < products.length ? product.name : `OOGO Frame ${String(index + 1).padStart(2, "0")}`
    };
  }).filter(Boolean) as Array<CollectionProduct & { previewKey: string; previewName: string }>;

  return (
    <section className="dark-section collection-wall" id="collection">
      <div className="collection-rail-heading">
        <p className="eyebrow">{landingText(content, "eyebrow", "Collection")}</p>
        <a href={withLocalePrefix(landingText(content, "primaryHref", getProductCatalogHref(undefined, locale)), locale)}>
          {landingText(content, "primaryLabel", "View all")}
        </a>
      </div>
      <CollectionRail products={displayProducts} locale={locale} />
    </section>
  );
}
