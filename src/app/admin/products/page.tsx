import { getAdminProducts } from "@/lib/admin-content";
import {
  buildAdminProductListHref,
  parseAdminProductListParams
} from "@/lib/admin-product-list";
import { getProductThumbnailUrl } from "@/lib/product-images";

export const dynamic = "force-dynamic";

type AdminProductRow = Awaited<ReturnType<typeof getAdminProducts>>["products"][number];

type AdminProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function koreanName(product: AdminProductRow) {
  return product.product_translations?.find((item) => item.locale === "ko")?.name ?? product.model_code;
}

function mainImageUrl(product: AdminProductRow) {
  return getProductThumbnailUrl(product.product_images ?? []);
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul"
  }).format(new Date(value));
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = parseAdminProductListParams(await searchParams);
  const { products, count } = await getAdminProducts(params);
  const totalPages = Math.max(1, Math.ceil(count / params.pageSize));
  const firstItem = count === 0 ? 0 : (params.page - 1) * params.pageSize + 1;
  const lastItem = Math.min(params.page * params.pageSize, count);

  return (
    <main className="admin-page">
      <div className="admin-page-heading">
        <div>
          <h1>Product Library</h1>
          <p>현재 조건에 맞는 상품 {count}개</p>
        </div>
        <a href="/admin/products/new">Add product</a>
      </div>
      <form className="admin-library-toolbar" method="get">
        <label>
          Search
          <input name="search" defaultValue={params.search} placeholder="Search name, model code, slug..." />
        </label>
        <label>
          Visibility
          <select name="visibility" defaultValue={params.visibility}>
            <option value="all">All products</option>
            <option value="public">Public on site</option>
            <option value="draft">Draft</option>
          </select>
        </label>
        <label>
          Sort
          <select name="sort" defaultValue={params.sort}>
            <option value="updated">Recently updated</option>
            <option value="order">Public order</option>
            <option value="model">Model code</option>
          </select>
        </label>
        <label>
          Rows
          <select name="pageSize" defaultValue={String(params.pageSize)}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </label>
        <input type="hidden" name="page" value="1" />
        <button type="submit">Apply</button>
      </form>
      <div className="admin-table">
        <div className="admin-table-row admin-table-head">
          <span>Media</span>
          <span>Model</span>
          <span>Name</span>
          <span>Featured</span>
          <span>Status</span>
          <span>Updated</span>
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
              <time dateTime={product.updated_at}>{formatUpdatedAt(product.updated_at)}</time>
              <a href={`/admin/products/${product.id}`}>Edit</a>
            </div>
          ))
        )}
      </div>
      <nav className="admin-pagination" aria-label="상품 목록 페이지">
        <p>{firstItem}–{lastItem} / 총 {count}개</p>
        <div>
          {params.page > 1 ? (
            <a href={buildAdminProductListHref({ ...params, page: params.page - 1 })} aria-label="이전 페이지">‹</a>
          ) : (
            <span aria-hidden="true">‹</span>
          )}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <a
              href={buildAdminProductListHref({ ...params, page })}
              aria-current={page === params.page ? "page" : undefined}
              key={page}
            >
              {page}
            </a>
          ))}
          {params.page < totalPages ? (
            <a href={buildAdminProductListHref({ ...params, page: params.page + 1 })} aria-label="다음 페이지">›</a>
          ) : (
            <span aria-hidden="true">›</span>
          )}
        </div>
      </nav>
    </main>
  );
}
