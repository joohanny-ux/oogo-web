import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyTurnstileToken } from "@/lib/turnstile";

describe("turnstile verification", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("skips verification when both keys are missing", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    const result = await verifyTurnstileToken(undefined);

    expect(result).toEqual({ ok: true, skipped: true });
  });

  it("skips verification in production when Turnstile is not configured", async () => {
    Object.defineProperty(process.env, "NODE_ENV", { value: "production", configurable: true });
    delete process.env.TURNSTILE_SECRET_KEY;
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    const result = await verifyTurnstileToken(undefined);

    expect(result).toEqual({ ok: true, skipped: true });
  });

  it("blocks submit when only one Turnstile key is set", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "site-key";

    const result = await verifyTurnstileToken("token");

    expect(result.ok).toBe(false);
  });

  it("verifies token with Cloudflare siteverify", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret-key";
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "site-key";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await verifyTurnstileToken("valid-token", "127.0.0.1");

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({ method: "POST" })
    );
  });
});
