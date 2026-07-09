import { ProductForm } from "@/components/admin/ProductForm";
import { saveProductAction } from "@/app/admin/products/actions";
import { hasSupabaseEnv } from "@/lib/admin-content";

export default function NewProductPage() {
  return (
    <main className="admin-page">
      <h1>Add product</h1>
      <ProductForm action={saveProductAction} supabaseConfigured={hasSupabaseEnv()} />
    </main>
  );
}
