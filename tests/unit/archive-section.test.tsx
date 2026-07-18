// Home Archive 섹션이 CMS 이미지와 기본 이미지를 순서대로 렌더링하는지 검증한다.
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArchiveSection } from "@/components/public/ArchiveSection";

describe("ArchiveSection", () => {
  it("renders four CMS image slots without changing the gallery structure", () => {
    const html = renderToStaticMarkup(
      <ArchiveSection
        content={{
          image1Url: "/custom/archive-1.webp",
          image2Url: "/custom/archive-2.webp",
          image3Url: "/custom/archive-3.webp",
          image4Url: "/custom/archive-4.webp"
        }}
      />
    );

    expect(html.match(/class="archive-card"/g)).toHaveLength(4);
    for (let number = 1; number <= 4; number += 1) {
      expect(html).toContain(`/custom/archive-${number}.webp`);
    }
  });

  it("keeps the existing local images as fallbacks", () => {
    const html = renderToStaticMarkup(<ArchiveSection />);

    expect(html).toContain("/images/home-archive/OG26001C2_07.png");
    expect(html).toContain("/images/home-archive/OG26014C3_07.png");
  });
});
