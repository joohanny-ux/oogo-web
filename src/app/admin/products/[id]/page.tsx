import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { saveProductAction } from "@/app/admin/products/actions";
import { getAdminProduct, hasSupabaseEnv } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getAdminProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="admin-page">
      <div className="admin-page-intro">
        <h1>Edit product</h1>
        <p>공통 정보, 언어별 스펙, 상세 이미지를 수정합니다.</p>
      </div>
      <ProductForm product={product} action={saveProductAction} supabaseConfigured={hasSupabaseEnv()} />
    </main>
  );
}
