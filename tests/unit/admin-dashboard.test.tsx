import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AdminDashboardPage from "@/app/admin/page";

describe("AdminDashboardPage", () => {
  it("renders landing page shortcuts matched to public routes", () => {
    const html = renderToStaticMarkup(<AdminDashboardPage />);

    expect(html).toContain("Landing Pages");
    expect(html).toContain("/admin/landing?page=home&amp;locale=ko");
    expect(html).toContain("/admin/landing?page=brand-story&amp;locale=ko");
    expect(html).toContain("/admin/landing?page=collection&amp;locale=ko");
    expect(html).toContain("/admin/landing?page=product-detail&amp;locale=ko");
    expect(html).toContain("/projects/youngbin-edition");
    expect(html).toContain("/inquiry");
  });
});
