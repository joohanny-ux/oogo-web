import { getAdminProducts } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

type AdminProductRow = Awaited<ReturnType<typeof getAdminProducts>>[number];

function koreanName(product: AdminProductRow) {
  return product.product_translations?.find((item) => item.locale === "ko")?.name ?? product.model_code;
}

function assetPublicUrl(asset: unknown) {
  if (Array.isArray(asset)) {
    return asset[0]?.public_url ?? null;
  }

  if (asset && typeof asset === "object" && "public_url" in asset) {
    return String(asset.public_url ?? "") || null;
  }

  return null;
}

function mainImageUrl(product: AdminProductRow) {
  const asset = product.product_images?.find((item) => item.role === "angle")?.assets;
  return assetPublicUrl(asset);
}

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <main className="admin-page">
      <div className="admin-page-heading">
        <div>
          <h1>Product Library</h1>
          <p>현재 조건에 맞는 상품 {products.length}개</p>
        </div>
        <a href="/admin/products/new">Add product</a>
      </div>
      <div className="admin-library-toolbar">
        <label>
          Search
          <input placeholder="Search name, model code, slug..." />
        </label>
        <label>
          Visibility
          <select defaultValue="all">
            <option value="all">All products</option>
            <option value="public">Public on site</option>
            <option value="draft">Draft</option>
          </select>
        </label>
        <label>
          Sort
          <select defaultValue="sort">
            <option value="sort">Sort order</option>
            <option value="newest">Newest first</option>
            <option value="model">Model code</option>
          </select>
        </label>
      </div>
      <div className="admin-table">
        <div className="admin-table-row admin-table-head">
          <span>Media</span>
          <span>Model</span>
          <span>Name</span>
          <span>Featured</span>
          <span>Status</span>
          <span></span>
        </div>
        {products.length === 0 ? (
          <p className="admin-empty">No products yet.</p>
        ) : (
          products.map((product) => (
            <div className="admin-table-row" key={product.id}>
              <span
                className="admin-product-thumb"
                style={mainImageUrl(product) ? { backgroundImage: `url("${mainImageUrl(product)}")` } : undefined}
              >
                {product.model_code}
              </span>
              <span>{product.model_code}</span>
              <span>{koreanName(product)}</span>
              <span>{product.featured ? "Yes" : "No"}</span>
              <span>{product.published ? "Published" : "Draft"}</span>
              <a href={`/admin/products/${product.id}`}>Edit</a>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
