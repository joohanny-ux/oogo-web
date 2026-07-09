import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { saveProductAction } from "@/app/admin/products/actions";
import { getAdminProduct } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getAdminProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="admin-page">
      <h1>Edit product</h1>
      <ProductForm product={product} action={saveProductAction} />
    </main>
  );
}
