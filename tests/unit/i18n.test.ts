import { describe, expect, it } from "vitest";
import { isLocale, LOCALES, normalizeLocale } from "@/lib/i18n";

describe("i18n helpers", () => {
  it("defines supported locales in display order", () => {
    expect(LOCALES).toEqual(["ko", "en", "zh"]);
  });

  it("accepts known locales", () => {
    expect(isLocale("ko")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("zh")).toBe(true);
  });

  it("normalizes unknown locales to Korean", () => {
    expect(normalizeLocale("fr")).toBe("ko");
    expect(normalizeLocale(undefined)).toBe("ko");
  });
});
