import { describe, expect, it } from "vitest";
import { hasSupabaseMiddlewareEnv } from "../../middleware";

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
