import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LandingEditor } from "@/components/admin/LandingEditor";
import { LANDING_CONTENT_FIELDS, readLandingContentFields } from "@/lib/landing-content-fields";

const pageKeys = [
  "header",
  "home",
  "brand-story",
  "collection",
  "projects",
  "product-detail",
  "special-edition",
  "archive",
  "inquiry",
  "footer"
] as const;

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

  it("groups the Youngbin project and photo archive in public route order", () => {
    const html = renderToStaticMarkup(
      <LandingEditor
        pageKey="special-edition"
        locale="ko"
        blocks={[]}
        saveAction={() => undefined}
        publishAction={() => undefined}
      />
    );

    for (const group of ["Hero", "Story & Edition", "Gallery", "Photographer & Links", "Photo Archive"]) {
      expect(html).toContain(`data-editor-group="${group.replaceAll("&", "&amp;")}"`);
    }
    for (const key of [
      "special-hero",
      "collaboration-statement",
      "limited-edition",
      "edition-gallery",
      "photographer-profile",
      "footer-cta",
      "youngbin-archive"
    ]) {
      expect(html).toContain(`name="blockKey" value="${key}"`);
    }
    expect(html).toContain("5개 챕터 편집");
  });

  it("exposes only fields used by the Youngbin public pages", () => {
    const html = renderToStaticMarkup(
      <LandingEditor
        pageKey="special-edition"
        locale="ko"
        blocks={[]}
        saveAction={() => undefined}
        publishAction={() => undefined}
      />
    );

    for (const fieldName of ["statementEn", "feature1Title", "image5Url", "quoteKo", "archiveHref", "artistCredit"]) {
      expect(html).toContain(`name="${fieldName}"`);
    }
    expect(html).not.toContain('name="item1Body"');
    expect(html).not.toContain('name="theme1"');
    expect(html).not.toContain('name="feature1Body"');
    expect(html).not.toContain('name="secondaryLabel"');
  });

  it("only renders editable content fields accepted by the save action", () => {
    const acceptedFields = new Set<string>([
      ...LANDING_CONTENT_FIELDS,
      "id",
      "pageKey",
      "locale",
      "blockKey",
      "mediaType",
      "mediaUrl",
      "mediaFile"
    ]);

    for (const pageKey of pageKeys) {
      const html = renderToStaticMarkup(
        <LandingEditor
          pageKey={pageKey}
          locale="ko"
          blocks={[]}
          saveAction={() => undefined}
          publishAction={() => undefined}
        />
      );
      const renderedNames = Array.from(html.matchAll(/name="([^"]+)"/g), (match) => match[1]);

      expect(renderedNames.filter((name) => !acceptedFields.has(name)), pageKey).toEqual([]);
    }
  });

  it("opens the public preview for the selected locale", () => {
    const html = renderToStaticMarkup(
      <LandingEditor
        pageKey="brand-story"
        locale="zh"
        blocks={[]}
        saveAction={() => undefined}
        publishAction={() => undefined}
      />
    );

    expect(html).toContain('class="landing-open-public" href="/zh/brand"');
  });

  it("directs EN and CN Home media updates to the shared KO content", () => {
    const html = renderToStaticMarkup(
      <LandingEditor
        pageKey="home"
        locale="en"
        blocks={[]}
        saveAction={() => undefined}
        publishAction={() => undefined}
      />
    );

    expect(html).toContain("KO 탭에서 변경하세요.");
    expect(html).not.toContain('name="mediaUrl"');
  });

  it("persists only fields submitted by the active public section", () => {
    const formData = new FormData();
    formData.set("headline", "Quietly distinct");
    formData.set("item6Title", "FRAME");

    expect(readLandingContentFields(formData)).toEqual({
      headline: "Quietly distinct",
      item6Title: "FRAME"
    });
    expect(readLandingContentFields(formData, { mediaType: "image", mediaUrl: "/hero.webp" })).toMatchObject({
      mediaType: "image",
      mediaUrl: "/hero.webp",
      imageUrl: "/hero.webp"
    });
  });
});
