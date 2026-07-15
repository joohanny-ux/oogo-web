import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/public/SiteHeader";

vi.mock("next/headers", () => ({
  headers: async () =>
    new Headers({
      "x-oogo-locale": "ko",
      "x-oogo-pathname": "/brand"
    }),
  cookies: async () => ({
    get: () => undefined
  })
}));

describe("SiteHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("restores Archive before Inquiry when saved navigation omitted it", async () => {
    const html = renderToStaticMarkup(
      await SiteHeader({
        content: {
          nav1Label: "Brand",
          nav1Href: "/brand",
          nav2Label: "Collection",
          nav2Href: "/collection",
          nav3Label: "Projects",
          nav3Href: "/projects",
          nav4Label: "Inquiry",
          nav4Href: "/inquiry"
        }
      })
    );

    expect(html).toContain('href="/archive"');
    expect(html.indexOf('href="/archive"')).toBeLessThan(html.indexOf('href="/inquiry"'));
    expect(html.match(/href="\/inquiry"/g)).toHaveLength(1);
  });

  it("exposes the overlay state when used on Home", async () => {
    const html = renderToStaticMarkup(await SiteHeader({ content: {}, overlay: true }));
    expect(html).toContain('class="site-header is-overlay"');
  });

  it("links language options to locale-prefixed routes", async () => {
    const html = renderToStaticMarkup(await SiteHeader({ content: {} }));
    expect(html).toContain('href="/en/brand"');
    expect(html).toContain('href="/zh/brand"');
    expect(html).toContain(">KR<");
  });
});
