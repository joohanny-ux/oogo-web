import { ProductForm } from "@/components/admin/ProductForm";
import { saveProductAction } from "@/app/admin/products/actions";

export default function NewProductPage() {
  return (
    <main className="admin-page">
      <h1>Add product</h1>
      <ProductForm action={saveProductAction} />
    </main>
  );
}
