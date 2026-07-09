import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProductForm } from "@/components/admin/ProductForm";

describe("ProductForm", () => {
  it("renders product detail fields in a public-page-oriented order", () => {
    const html = renderToStaticMarkup(<ProductForm action={() => undefined} />);

    expect(html).toContain("Detail page order");
    expect(html).toContain("Code -&gt; Name -&gt; Specs -&gt; Buyer CTA");
    expect(html.indexOf("Detail header")).toBeLessThan(html.indexOf("Detail specs"));
    expect(html.indexOf("Detail specs")).toBeLessThan(html.indexOf("Detail copy"));
    expect(html.indexOf("Front balance")).toBeLessThan(html.indexOf("Angle view"));
    expect(html.indexOf("Angle view")).toBeLessThan(html.indexOf("Side profile"));
    expect(html.indexOf("Side profile")).toBeLessThan(html.indexOf("Wearing / Lifestyle"));
  });

  it("disables product saving when Supabase is not configured", () => {
    const html = renderToStaticMarkup(<ProductForm action={() => undefined} supabaseConfigured={false} />);

    expect(html).toContain("Supabase connection required");
    expect(html).toContain("상품 저장과 이미지 업로드는 Supabase 연결 후 사용할 수 있습니다.");
    expect(html).toContain("disabled=\"\"");
    expect(html).toContain("Connect Supabase to save product");
  });
});
