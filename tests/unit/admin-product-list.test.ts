import { describe, expect, it } from "vitest";
import { buildAdminProductListHref, parseAdminProductListParams } from "@/lib/admin-product-list";

describe("admin product list parameters", () => {
  it("uses recent updates and 20 rows as the default view", () => {
    expect(parseAdminProductListParams({})).toEqual({
      search: "",
      visibility: "all",
      sort: "updated",
      page: 1,
      pageSize: 20
    });
  });

  it("accepts supported filters and rejects invalid pagination values", () => {
    expect(
      parseAdminProductListParams({
        search: "  OG26001  ",
        visibility: "draft",
        sort: "model",
        page: "-2",
        pageSize: "12"
      })
    ).toEqual({
      search: "OG26001",
      visibility: "draft",
      sort: "model",
      page: 1,
      pageSize: 20
    });
  });

  it("preserves list filters in pagination links", () => {
    expect(
      buildAdminProductListHref({
        search: "Black Moon",
        visibility: "public",
        sort: "order",
        page: 2,
        pageSize: 10
      })
    ).toBe("/admin/products?search=Black+Moon&visibility=public&sort=order&page=2&pageSize=10");
  });
});
