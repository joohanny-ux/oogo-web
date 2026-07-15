import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

describe("AdminSidebar", () => {
  it("renders OOGO admin navigation links", () => {
    const html = renderToStaticMarkup(<AdminSidebar />);

    expect(html).toContain("Dashboard");
    expect(html).toContain("Products");
    expect(html).toContain("Landing Page");
    expect(html).toContain('href="/admin/archive"');
    expect(html).toContain("Archive");
    expect(html).toContain("Files");
    expect(html).toContain("Inquiries");
    expect(html).toContain("Company &amp; Brand");
    expect(html).toContain("Users &amp; Roles");
  });
});
