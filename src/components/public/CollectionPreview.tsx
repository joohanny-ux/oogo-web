import { CollectionRail } from "@/components/public/CollectionRail";

type CollectionProduct = {
  slug: string;
  modelCode: string;
  name: string;
  colorway?: string | null;
  size: string | null;
  images?: Partial<Record<"angle" | "front", string>>;
};

export function CollectionPreview({ products }: { products: CollectionProduct[] }) {
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
        <p className="eyebrow">Collection</p>
        <a href="/collection">View all</a>
      </div>
      <CollectionRail products={displayProducts} />
    </section>
  );
}
