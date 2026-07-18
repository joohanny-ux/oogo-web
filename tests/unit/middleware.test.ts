import { describe, expect, it } from "vitest";
import {
  hasSupabaseMiddlewareEnv,
  resolveMiddlewareLocale,
  resolveMiddlewarePathname
} from "../../middleware";

describe("middleware Supabase setup guard", () => {
  it("treats admin auth as unconfigured until both public Supabase values exist", () => {
    expect(hasSupabaseMiddlewareEnv({})).toBe(false);
    expect(hasSupabaseMiddlewareEnv({ NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co" })).toBe(false);
    expect(
      hasSupabaseMiddlewareEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key"
      })
    ).toBe(true);
  });
});

describe("middleware locale rewrite re-entry", () => {
  it("keeps the prefixed locale when middleware runs again on the rewritten path", () => {
    expect(resolveMiddlewareLocale("/en/brand", null)).toBe("en");
    expect(resolveMiddlewareLocale("/zh/brand", null)).toBe("zh");
    expect(resolveMiddlewareLocale("/brand", "en")).toBe("en");
    expect(resolveMiddlewareLocale("/brand", "zh")).toBe("zh");
    expect(resolveMiddlewareLocale("/brand", null)).toBe("ko");
    expect(resolveMiddlewareLocale("/brand", "ko")).toBe("ko");
  });

  it("preserves the public pathname across rewrite re-entry", () => {
    expect(resolveMiddlewarePathname("/en/brand", null)).toBe("/en/brand");
    expect(resolveMiddlewarePathname("/brand", "/en/brand")).toBe("/en/brand");
    expect(resolveMiddlewarePathname("/brand", null)).toBe("/brand");
  });
});
