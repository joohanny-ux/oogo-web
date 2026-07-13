import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LandingEditor } from "@/components/admin/LandingEditor";

describe("LandingEditor", () => {
  it("matches the four sections rendered on the public Home page", () => {
    const html = renderToStaticMarkup(
      <LandingEditor
        pageKey="home"
        locale="ko"
        blocks={[]}
        saveAction={() => undefined}
        publishAction={() => undefined}
      />
    );

    expect(html).toContain("Hero");
    expect(html).toContain("Collection");
    expect(html).toContain("Projects");
    expect(html).toContain("Archive");
    expect(html).not.toContain('name="blockKey" value="brand-essence"');
    expect(html).not.toContain('name="blockKey" value="wearing"');
    expect(html).not.toContain('name="blockKey" value="inquiry-preview"');
    expect(html).toContain("4개 섹션 편집");
  });

  it("disables draft, publish, and media upload controls when Supabase is not configured", () => {
    const html = renderToStaticMarkup(
      <LandingEditor
        pageKey="home"
        locale="ko"
        blocks={[
          {
            id: "block-1",
            block_key: "hero",
            draft_content: {},
            published_content: {},
            published: false
          }
        ]}
        saveAction={() => undefined}
        publishAction={() => undefined}
        supabaseConfigured={false}
      />
    );

    expect(html).toContain("Supabase connection required");
    expect(html).toContain("랜딩 페이지 초안 저장, 게시, 미디어 업로드는 Supabase 연결 후 사용할 수 있습니다.");
    expect(html).toContain("Supabase 연결 후 저장 가능");
    expect(html).toContain("Supabase 연결 필요");
    expect(html).toContain("disabled=\"\"");
  });

  it.each([
    ["brand-story", ["Brand Hero", "About OOGO", "Brand Statement", "Brand Essence", "Design Philosophy", "Brand Experience", "Closing & CTA"]],
    ["collection", ["Collection Intro"]],
    ["projects", ["Projects Intro", "Featured Project", "Collaboration CTA"]],
    ["special-edition", ["Collaboration Hero", "Light, Gaze, Memory", "Limited Edition", "Edition Gallery", "Photographer Profile", "Footer CTA"]],
    ["archive", ["Archive Intro"]],
    ["inquiry", ["Inquiry Intro", "Direct Channel", "Topic Guide", "Response Note"]],
    ["footer", ["Brand", "Navigation", "Contact & Legal"]]
  ])("matches the public section order for %s", (pageKey, titles) => {
    const html = renderToStaticMarkup(
      <LandingEditor
        pageKey={pageKey}
        locale="ko"
        blocks={[]}
        saveAction={() => undefined}
        publishAction={() => undefined}
      />
    );

    for (const title of titles) {
      expect(html).toContain(`<strong>${title.replace("&", "&amp;")}</strong>`);
    }
    expect(html).toContain(`${titles.length}개 섹션 편집`);
  });

  it("exposes only fields used by the Youngbin Edition public story", () => {
    const html = renderToStaticMarkup(
      <LandingEditor
        pageKey="special-edition"
        locale="ko"
        blocks={[]}
        saveAction={() => undefined}
        publishAction={() => undefined}
      />
    );

    for (const fieldName of ["statementEn", "feature1Title", "image5Url", "quoteKo", "archiveHref"]) {
      expect(html).toContain(`name="${fieldName}"`);
    }
    expect(html).not.toContain('name="item1Body"');
    expect(html).not.toContain('name="artistCredit"');
  });
});
