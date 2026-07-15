import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ArchiveGallery, getAdjacentArchiveIndex } from "@/components/public/ArchiveGallery";

const archivePageSource = readFileSync(join(process.cwd(), "src/app/archive/page.tsx"), "utf8");
const youngbinArchivePagePath = join(process.cwd(), "src/app/archive/youngbin-edition/page.tsx");
const youngbinArchivePageSource = existsSync(youngbinArchivePagePath)
  ? readFileSync(youngbinArchivePagePath, "utf8")
  : "";

const items = [
  { id: "one", label: "First image", image: "/first.jpg", category: "campaign" as const },
  { id: "two", label: "Second image", image: "/second.jpg", category: "product" as const }
];

describe("ArchiveGallery", () => {
  it("wraps previous and next navigation at the gallery edges", () => {
    expect(getAdjacentArchiveIndex(0, -1, items.length)).toBe(1);
    expect(getAdjacentArchiveIndex(1, 1, items.length)).toBe(0);
  });

  it("renders every archive image as an accessible modal trigger", () => {
    const html = renderToStaticMarkup(<ArchiveGallery items={items} />);

    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="원본 이미지 보기: First image"');
    expect(html).toContain('aria-label="원본 이미지 보기: Second image"');
    expect(html).not.toContain(">First image<");
    expect(html).not.toContain(">Second image<");
  });

  it("loads the expandable Archive collection with legacy fallback", () => {
    expect(archivePageSource).toContain('getPublicArchiveItems("oogo")');
    expect(archivePageSource).toContain("buildPublicArchiveItems");
  });

  it("renders a separate Youngbin Edition archive with a project return link", () => {
    expect(youngbinArchivePageSource).toContain('getPublicArchiveItems("youngbin-edition")');
    expect(youngbinArchivePageSource).toContain('buildPublicArchiveItems(rows, [], "youngbin-edition")');
    expect(youngbinArchivePageSource).toContain('withLocalePrefix("/projects/youngbin-edition", locale)');
    expect(youngbinArchivePageSource).toContain("ArchiveGallery");
  });

  it("exposes both archive collections from the main and Youngbin archive pages", () => {
    expect(archivePageSource).toContain('className="archive-collection-nav"');
    expect(archivePageSource).toContain('withLocalePrefix("/archive/youngbin-edition", locale)');
    expect(archivePageSource).toContain("Youngbin Edition");
    expect(youngbinArchivePageSource).toContain('className="archive-collection-nav"');
    expect(youngbinArchivePageSource).toContain('withLocalePrefix("/archive", locale)');
    expect(youngbinArchivePageSource).toContain('aria-current="page"');
  });
});
