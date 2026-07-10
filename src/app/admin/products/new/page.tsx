import { ProductForm } from "@/components/admin/ProductForm";
import { saveProductAction } from "@/app/admin/products/actions";
import { hasSupabaseEnv } from "@/lib/admin-content";

export default function NewProductPage() {
  return (
    <main className="admin-page">
      <div className="admin-page-intro">
        <h1>Add product</h1>
        <p>공통 정보와 언어별 상세 내용을 입력해 새 상품을 등록합니다.</p>
      </div>
      <ProductForm action={saveProductAction} supabaseConfigured={hasSupabaseEnv()} />
    </main>
  );
}
