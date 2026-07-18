import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    from: () => {
      throw new TypeError("fetch failed");
    }
  }))
}));

import { getFeaturedProducts, getLandingBlocks, getPublishedProducts } from "@/lib/public-content";

describe("public content Supabase fallback", () => {
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-key";
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = previousKey;
  });

  it("keeps public pages available when Supabase fetch fails", async () => {
    await expect(getLandingBlocks("ko")).resolves.toEqual([]);
    await expect(getFeaturedProducts("ko")).resolves.not.toHaveLength(0);
    await expect(getPublishedProducts("ko")).resolves.not.toHaveLength(0);
  });
});
