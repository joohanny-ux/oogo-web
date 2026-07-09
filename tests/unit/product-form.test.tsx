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
});
