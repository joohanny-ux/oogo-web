import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LoginForm } from "@/components/admin/LoginForm";

describe("LoginForm", () => {
  it("disables sign-in when Supabase is not configured", () => {
    const html = renderToStaticMarkup(<LoginForm supabaseConfigured={false} />);

    expect(html).toContain("Supabase connection required");
    expect(html).toContain("관리자 로그인은 Supabase Auth 연결 후 사용할 수 있습니다.");
    expect(html).toContain("Connect Supabase to sign in");
    expect(html).toContain("disabled=\"\"");
  });
});
