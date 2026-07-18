import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const missingTableError = {
  code: "PGRST205",
  message: "Could not find the table 'public.archive_items' in the schema cache"
};

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => {
    const query = {
      select: () => query,
      eq: () => query,
      order: async () => ({ data: null, error: missingTableError })
    };
    return { from: () => query };
  })
}));

import { getAdminArchiveState } from "@/lib/archive-content";

describe("Archive admin database state", () => {
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

  it("disables Archive editing when the required table is missing", async () => {
    await expect(getAdminArchiveState()).resolves.toEqual({
      items: [],
      ready: false,
      message: "Archive DB 마이그레이션을 먼저 적용해야 합니다."
    });
  });
});
