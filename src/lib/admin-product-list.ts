export type AdminProductVisibility = "all" | "public" | "draft";
export type AdminProductSort = "updated" | "order" | "model";
export type AdminProductPageSize = 10 | 20 | 50;

export type AdminProductListParams = {
  search: string;
  visibility: AdminProductVisibility;
  sort: AdminProductSort;
  page: number;
  pageSize: AdminProductPageSize;
};

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseAdminProductListParams(params: RawParams): AdminProductListParams {
  const visibilityValue = first(params.visibility);
  const sortValue = first(params.sort);
  const pageValue = Number(first(params.page));
  const pageSizeValue = Number(first(params.pageSize));

  return {
    search: (first(params.search) ?? "").trim(),
    visibility: visibilityValue === "public" || visibilityValue === "draft" ? visibilityValue : "all",
    sort: sortValue === "order" || sortValue === "model" ? sortValue : "updated",
    page: Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1,
    pageSize: pageSizeValue === 10 || pageSizeValue === 50 ? pageSizeValue : 20
  };
}

export function buildAdminProductListHref(params: AdminProductListParams) {
  const query = new URLSearchParams({
    search: params.search,
    visibility: params.visibility,
    sort: params.sort,
    page: String(params.page),
    pageSize: String(params.pageSize)
  });

  return `/admin/products?${query.toString()}`;
}
