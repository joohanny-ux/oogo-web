import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LandingEditor } from "@/components/admin/LandingEditor";

describe("LandingEditor", () => {
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
});
