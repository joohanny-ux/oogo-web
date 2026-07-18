import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getLandingEditorFieldContract, LandingEditor } from "@/components/admin/LandingEditor";
import { getLandingEditorDefaultContent } from "@/lib/landing-editor-defaults";
import {
  LANDING_CONTENT_FIELDS,
  readHeroSlidesFields,
  readLandingContentFields,
  readSocialLinksFields
} from "@/lib/landing-content-fields";

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
      "mediaFile",
      "socialLinksManaged"
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

      expect(
        renderedNames.filter(
          (name) =>
            !acceptedFields.has(name) &&
            !name.startsWith("landing-") &&
            !/^image[1-6]File$/.test(name) &&
            !/^slide[1-5](Id|Eyebrow|Heading|Line|MediaType|MediaUrl|PosterUrl|Alt|File)$/.test(name) &&
            !/^social[1-8](Id|Platform|Href|Label|Visible)$/.test(name)
        ),
        pageKey
      ).toEqual([]);
    }
  });

  it("provides a public fallback value for every editable text field in every locale", () => {
    for (const locale of ["ko", "en", "zh"] as const) {
      for (const pageKey of pageKeys) {
        for (const block of getLandingEditorFieldContract(pageKey)) {
          const defaults = getLandingEditorDefaultContent(pageKey, block.blockKey, locale);

          for (const fieldName of block.fieldNames) {
            expect(defaults[fieldName], `${locale}:${pageKey}.${block.blockKey}.${fieldName}`).toBeTruthy();
          }
        }
      }
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

  it("uses a page dropdown and starts with one collapsed accordion group", () => {
    const html = renderToStaticMarkup(
      <LandingEditor
        pageKey="home"
        locale="ko"
        blocks={[]}
        saveAction={() => undefined}
        publishAction={() => undefined}
      />
    );

    expect(html).toContain('aria-label="편집할 랜딩 페이지"');
    expect(html.match(/name="landing-home"/g)).toHaveLength(4);
    expect(html).not.toContain("<details open");
    expect(html).toContain("저장 후 전체 게시");
  });

  it("keeps the saved section open after a draft save redirect", () => {
    const html = renderToStaticMarkup(
      <LandingEditor
        pageKey="home"
        locale="ko"
        blocks={[]}
        openBlockKey="hero"
        saveAction={() => undefined}
        publishAction={() => undefined}
      />
    );

    expect(html).toContain('id="landing-block-hero"');
    expect(html).toContain('name="landing-home"');
    // Open state is applied after mount to avoid hydration mismatches.
    expect(html).not.toMatch(/<details name="landing-home" open(?:=|"")?>/);
  });

  it("renders and serializes editable Footer social links", () => {
    const html = renderToStaticMarkup(
      <LandingEditor
        pageKey="footer"
        locale="ko"
        blocks={[]}
        saveAction={() => undefined}
        publishAction={() => undefined}
      />
    );

    expect(html).toContain("소셜 링크 추가");
    expect(html).toContain('name="social1Platform"');
    expect(html).toContain('name="social5Href"');
    expect(html).not.toContain('name="instagram"');

    const formData = new FormData();
    formData.set("social1Id", "instagram-main");
    formData.set("social1Platform", "instagram");
    formData.set("social1Href", "https://instagram.com/oogo");
    formData.set("social1Label", "OOGO Instagram");
    formData.set("social1Visible", "true");
    formData.set("social2Platform", "youtube");
    formData.set("social2Href", "https://youtube.com/@oogo");

    expect(readSocialLinksFields(formData)).toEqual([
      {
        id: "instagram-main",
        platform: "instagram",
        href: "https://instagram.com/oogo",
        label: "OOGO Instagram",
        visible: true
      },
      {
        id: "social-2",
        platform: "youtube",
        href: "https://youtube.com/@oogo",
        label: "",
        visible: false
      }
    ]);
  });

  it("directs EN and CN media updates to the shared KO content across pages", () => {
    for (const pageKey of ["home", "brand-story", "header", "footer", "projects", "special-edition"] as const) {
      const html = renderToStaticMarkup(
        <LandingEditor
          pageKey={pageKey}
          locale="en"
          blocks={[]}
          saveAction={() => undefined}
          publishAction={() => undefined}
        />
      );

      expect(html, pageKey).toContain("KO 탭에서 변경하세요.");
      expect(html, pageKey).not.toContain('name="mediaFile"');
    }
  });

  it("renders four editable Home Archive image uploads for KO", () => {
    const html = renderToStaticMarkup(
      <LandingEditor
        pageKey="home"
        locale="ko"
        blocks={[]}
        saveAction={() => undefined}
        publishAction={() => undefined}
      />
    );

    expect(html.match(/class="image-gallery-editor-card"/g)).toHaveLength(4);
    expect(html).toContain('name="image1Url"');
    expect(html).toContain('name="image4Url"');
    expect(html).toContain('name="image1File"');
    expect(html).toContain('name="image4File"');
    expect(html).toContain("/images/home-archive/OG26001C2_07.png");
  });

  it("matches all Brand image slots with upload controls", () => {
    const html = renderToStaticMarkup(
      <LandingEditor
        pageKey="brand-story"
        locale="ko"
        blocks={[]}
        saveAction={() => undefined}
        publishAction={() => undefined}
      />
    );

    expect(html).toContain("Brand Hero");
    expect(html).toContain("Brand Statement");
    expect(html).toContain("Design Philosophy 이미지");
    expect(html).toContain("Brand Experience 이미지");
    expect(html.match(/class="image-gallery-editor-card"/g)).toHaveLength(11);
    expect(html).toContain('name="image5File"');
    expect(html).toContain('name="image6File"');
    expect(html.match(/name="mediaFile"/g)).toHaveLength(3);
    expect(html).toContain('name="item1Body"');
    expect(html).toContain('name="item6Body"');
  });

  it("renders four uploadable Youngbin Edition gallery images", () => {
    const html = renderToStaticMarkup(
      <LandingEditor
        pageKey="special-edition"
        locale="ko"
        blocks={[]}
        saveAction={() => undefined}
        publishAction={() => undefined}
      />
    );

    expect(html).toContain("Edition Gallery 이미지");
    expect(html).toContain('name="image2File"');
    expect(html).toContain('name="image5File"');
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

  it("renders and serializes up to five Home Hero image or video slides", () => {
    const slides = Array.from({ length: 5 }, (_, index) => ({
      id: `hero-${index + 1}`,
      mediaType: index === 1 ? "video" : "image",
      mediaUrl: index === 1 ? "/hero-2.mp4" : `/hero-${index + 1}.webp`,
      posterUrl: index === 1 ? "/hero-2-poster.webp" : "",
      alt: `Hero ${index + 1}`
    }));
    const html = renderToStaticMarkup(
      <LandingEditor
        pageKey="home"
        locale="ko"
        blocks={[
          {
            id: "hero-block",
            block_key: "hero",
            draft_content: { slides },
            published_content: {},
            published: false
          }
        ]}
        saveAction={() => undefined}
        publishAction={() => undefined}
      />
    );

    expect(html.match(/class="hero-slide-editor-card"/g)).toHaveLength(5);
    expect(html).toContain('name="slide2MediaType"');
    expect(html).toContain('value="video" selected=""');
    expect(html).toContain("Slideshow autoplay");
    expect(html).toContain("Interval (sec)");
    expect(html).toContain('name="autoplay"');
    expect(html).toContain('name="intervalMs"');
    expect(html).not.toContain("슬라이드 추가");

    const formData = new FormData();
    formData.set("autoplay", "false");
    formData.set("intervalMs", "3000");
    formData.set("slide1Id", "hero-1");
    formData.set("slide1MediaType", "image");
    formData.set("slide1MediaUrl", "/hero-1.webp");
    formData.set("slide2Id", "hero-2");
    formData.set("slide2MediaType", "video");
    formData.set("slide2MediaUrl", "/hero-2.mp4");
    formData.set("slide2PosterUrl", "/hero-2-poster.webp");

    expect(readLandingContentFields(formData)).toMatchObject({
      autoplay: "false",
      intervalMs: "3000"
    });
    expect(readHeroSlidesFields(formData)).toEqual([
      expect.objectContaining({ id: "hero-1", mediaType: "image", mediaUrl: "/hero-1.webp" }),
      expect.objectContaining({
        id: "hero-2",
        mediaType: "video",
        mediaUrl: "/hero-2.mp4",
        posterUrl: "/hero-2-poster.webp"
      })
    ]);
  });
});
