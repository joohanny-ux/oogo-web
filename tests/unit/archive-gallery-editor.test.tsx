import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ArchiveGalleryEditor } from "@/components/admin/ArchiveGalleryEditor";
import type { ArchiveItem } from "@/lib/archive-content";

const items: ArchiveItem[] = [
  {
    id: "draft-item",
    collection_key: "oogo",
    asset_id: null,
    image_url: "/draft.jpg",
    alt_text: "OOGO archive image",
    published: false,
    created_at: "2026-07-12T00:00:00.000Z",
    published_at: null
  },
  {
    id: "public-item",
    collection_key: "oogo",
    asset_id: null,
    image_url: "/public.jpg",
    alt_text: "OOGO archive image",
    published: true,
    created_at: "2026-07-11T00:00:00.000Z",
    published_at: "2026-07-11T00:00:00.000Z"
  }
];
const editorSource = readFileSync(
  join(process.cwd(), "src/components/admin/ArchiveGalleryEditor.tsx"),
  "utf8"
);

describe("ArchiveGalleryEditor", () => {
  it("renders compact newest-first items with top multi-upload actions", () => {
    const html = renderToStaticMarkup(
      <ArchiveGalleryEditor
        items={items}
        collectionKey="youngbin-edition"
        publishAction={() => undefined}
        replaceAction={() => undefined}
        deleteAction={() => undefined}
      />
    );

    expect(html).toContain("Archive Gallery");
    expect(html).toContain("OOGO Archive");
    expect(html).toContain("Youngbin Edition");
    expect(html).toContain('/admin/archive?collection=youngbin-edition');
    expect(html).toContain('name="collectionKey" value="youngbin-edition"');
    expect(html).toContain('href="/archive/youngbin-edition"');
    expect(html).toContain('name="archiveFiles"');
    expect(html).toContain("multiple");
    expect(html).toContain("선택한 이미지는 한 장씩 순서대로 저장됩니다.");
    expect(html).toContain("이미지 추가");
    expect(html).toContain("초안 저장");
    expect(html).toContain("게시하기");
    expect(html).toContain("초안 1");
    expect(html).toContain("공개 1");
    expect(html).toContain('class="archive-admin-card"');
    expect(html).not.toContain("Campaign light");
    expect(html).not.toContain('name="image1File"');
  });

  it("uses only the manual sequential submit path for file uploads", () => {
    expect(editorSource).not.toContain('<form action={saveAction} className="archive-admin-upload-form"');
    expect(editorSource).not.toContain('formAction={publishAction}');
    expect(editorSource).toContain('onSubmit={handleUpload}');
    expect(editorSource).toContain("buildArchiveUploadRequest");
    expect(editorSource).toContain("validateArchiveImage");
    expect(editorSource).toContain('onChange={handleFileSelection}');
    expect(editorSource).toContain('aria-live="polite"');
    expect(editorSource).toContain('hasInvalidSelection');
    expect(editorSource).toContain("await fetch(request.url, request.init)");
  });
});
