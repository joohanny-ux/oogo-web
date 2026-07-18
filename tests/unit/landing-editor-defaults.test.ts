// 공개 fallback 문구가 언어별 Landing Editor 초기값으로 제공되는지 검증한다.
import { describe, expect, it } from "vitest";
import { getLandingEditorContent, getLandingEditorDefaultContent } from "@/lib/landing-editor-defaults";

describe("Landing Editor public text defaults", () => {
  it("provides locale-specific values for every public language", () => {
    expect(getLandingEditorDefaultContent("home", "hero", "ko").line).toBe("빛과 얼굴, 조용한 태도를 위한 프레임.");
    expect(getLandingEditorDefaultContent("home", "hero", "zh").line).toBe("为光、面容与安静态度而设计的镜框。");
    expect(getLandingEditorDefaultContent("special-edition", "special-hero", "ko").body).toContain("시즌 에디트");
    expect(getLandingEditorDefaultContent("special-edition", "collaboration-statement", "zh").statementEn).toContain("光线");
    expect(getLandingEditorDefaultContent("home", "collection-preview", "ko").primaryLabel).toBe("전체 보기");
    expect(getLandingEditorDefaultContent("brand-story", "about", "en").heading).toBe("Eyewear for a refined gaze");
    expect(getLandingEditorDefaultContent("brand-story", "essence", "zh").item6Body).toBe("整理视线的构图");
    expect(getLandingEditorDefaultContent("special-edition", "photographer-profile", "zh").quoteEn).toBe("每一个瞬间都可以成为艺术。");
    expect(getLandingEditorDefaultContent("inquiry", "inquiry-main", "ko").heading).toBe("제품 및 비즈니스 문의");
    expect(getLandingEditorDefaultContent("footer", "contact-legal", "zh").privacyLabel).toBe("隐私政策");
  });

  it("covers every text-bearing Landing Editor block", () => {
    const blocks = [
      ["header", "main"],
      ["home", "hero"],
      ["home", "collection-preview"],
      ["home", "special-preview"],
      ["home", "archive-preview"],
      ["brand-story", "story-hero"],
      ["brand-story", "about"],
      ["brand-story", "statement"],
      ["brand-story", "essence"],
      ["brand-story", "philosophy"],
      ["brand-story", "experience"],
      ["brand-story", "closing-cta"],
      ["collection", "collection-hero"],
      ["projects", "intro"],
      ["projects", "featured-project"],
      ["projects", "collaboration-cta"],
      ["product-detail", "detail-template"],
      ["special-edition", "special-hero"],
      ["special-edition", "collaboration-statement"],
      ["special-edition", "limited-edition"],
      ["special-edition", "photographer-profile"],
      ["special-edition", "footer-cta"],
      ["special-edition", "youngbin-archive"],
      ["archive", "intro"],
      ["inquiry", "inquiry-main"],
      ["inquiry", "direct-channel"],
      ["inquiry", "topic-guide"],
      ["inquiry", "response-note"],
      ["footer", "brand"],
      ["footer", "navigation"],
      ["footer", "contact-legal"]
    ] as const;

    for (const locale of ["ko", "en", "zh"] as const) {
      for (const [pageKey, blockKey] of blocks) {
        const content = getLandingEditorDefaultContent(pageKey, blockKey, locale);
        expect(Object.keys(content).length, `${locale}:${pageKey}.${blockKey}`).toBeGreaterThan(0);
        expect(Object.values(content).every((value) => value.length > 0), `${locale}:${pageKey}.${blockKey}`).toBe(true);
      }
    }
  });

  it("keeps saved draft text while replacing empty values with the public fallback", () => {
    expect(
      getLandingEditorContent("brand-story", "story-hero", "ko", {
        heading: "Custom OOGO",
        line: ""
      })
    ).toMatchObject({
      eyebrow: "Brand Story",
      heading: "Custom OOGO",
      line: "조용하지만 분명한 존재감과 정제된 시선."
    });
  });

  it("does not create defaults for unknown blocks", () => {
    expect(getLandingEditorDefaultContent("unknown", "missing", "ko")).toEqual({});
  });
});
