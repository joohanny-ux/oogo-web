import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AdminDashboardOverview } from "@/components/admin/AdminDashboardOverview";

describe("AdminDashboardOverview", () => {
  it("renders a focused operational summary with live values", () => {
    const html = renderToStaticMarkup(
      <AdminDashboardOverview summary={{ products: 2, publishedProducts: 2, openInquiries: 1 }} />
    );

    expect(html).toContain("Dashboard");
    expect(html).toContain("현재 공개 콘텐츠와 문의 현황을 빠르게 확인합니다.");
    expect(html).toContain("Products");
    expect(html).toContain("Public on site");
    expect(html).toContain("Open inquiries");
    expect(html).toContain(">2<");
    expect(html).toContain(">1<");
    expect(html).toContain("Add product");
    expect(html).toContain("Landing page");
    expect(html).toContain("Files");
  });

  it("removes one-time setup and duplicated landing page sections", () => {
    const html = renderToStaticMarkup(
      <AdminDashboardOverview summary={{ products: 0, publishedProducts: 0, openInquiries: 0 }} />
    );

    expect(html).not.toContain("Setup Status");
    expect(html).not.toContain("Supabase env");
    expect(html).not.toContain("Landing Pages");
    expect(html).not.toContain("Landing drafts");
  });
});
