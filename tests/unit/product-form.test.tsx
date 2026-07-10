import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProductForm } from "@/components/admin/ProductForm";

describe("ProductForm", () => {
  it("renders shared product fields and locale-tabbed detail copy", () => {
    const html = renderToStaticMarkup(<ProductForm action={() => undefined} />);

    expect(html).toContain("Shared product");
    expect(html).toContain("OOGO No.");
    expect(html).toContain(">Spec ");
    expect(html).toContain('name="size"');
    expect(html).toContain('name="referenceColorName"');
    expect(html).toContain('aria-label="Product content language"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('name="ko.frame"');
    expect(html).toContain('name="en.lens"');
    expect(html).toContain('name="zh.lens"');
    expect(html).not.toContain('name="ko.colorway"');
    expect(html).not.toContain('name="ko.description"');
    expect(html).not.toContain('name="ko.sizeNote"');
    expect(html).not.toContain('name="ko.lensFeaturesText"');
    expect(html).not.toContain('name="frameMaterial"');
    expect(html.indexOf("Front balance")).toBeLessThan(html.indexOf("Angle view"));
    expect(html.indexOf("Angle view")).toBeLessThan(html.indexOf("Side profile"));
    expect(html.indexOf("Side profile")).toBeLessThan(html.indexOf("Wearing / Lifestyle"));
    expect(html).toContain('class="admin-form-actions admin-product-actions"');
    expect(html).toContain("Create product");
    expect(html).toContain("Cancel");
  });

  it("uses an edit-specific compact save command", () => {
    const html = renderToStaticMarkup(
      <ProductForm product={{ id: "product-id", model_code: "OG26001C2" }} action={() => undefined} />
    );

    expect(html).toContain("Save changes");
    expect(html).not.toContain(">Save product<");
  });

  it("disables product saving when Supabase is not configured", () => {
    const html = renderToStaticMarkup(<ProductForm action={() => undefined} supabaseConfigured={false} />);

    expect(html).toContain("Supabase connection required");
    expect(html).toContain("상품 저장과 이미지 업로드는 Supabase 연결 후 사용할 수 있습니다.");
    expect(html).toContain("disabled=\"\"");
    expect(html).toContain("Supabase 연결 필요");
  });
});
