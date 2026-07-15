import { redirect } from "next/navigation";
import { getProductCatalogHref, normalizeCatalogCategory } from "@/lib/products";
import { getRequestLocale } from "@/lib/public-locale";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const locale = await getRequestLocale();
  redirect(getProductCatalogHref(normalizeCatalogCategory(category), locale));
}
