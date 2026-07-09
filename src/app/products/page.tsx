import { redirect } from "next/navigation";
import { getProductCatalogHref, normalizeCatalogCategory } from "@/lib/products";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  redirect(getProductCatalogHref(normalizeCatalogCategory(category)));
}
