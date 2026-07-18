import { describe, expect, it } from "vitest";
import {
  getPathLocale,
  localizedHrefForLocale,
  stripLocalePrefix,
  withLocalePrefix
} from "@/lib/locale-path";

describe("public locale helpers", () => {
  it("detects prefixed locales and keeps Korean unprefixed", () => {
    expect(getPathLocale("/en/brand")).toBe("en");
    expect(getPathLocale("/zh/collection")).toBe("zh");
    expect(getPathLocale("/brand")).toBe("ko");
    expect(getPathLocale("/")).toBe("ko");
  });

  it("strips and prefixes locale segments around public paths", () => {
    expect(stripLocalePrefix("/en/brand")).toBe("/brand");
    expect(stripLocalePrefix("/zh")).toBe("/");
    expect(withLocalePrefix("/brand", "en")).toBe("/en/brand");
    expect(withLocalePrefix("/collection?category=sun", "zh")).toBe("/zh/collection?category=sun");
    expect(withLocalePrefix("/admin/login", "en")).toBe("/admin/login");
  });

  it("switches locale while preserving the current path", () => {
    expect(localizedHrefForLocale("/en/projects/youngbin-edition", "ko")).toBe(
      "/projects/youngbin-edition"
    );
    expect(localizedHrefForLocale("/brand", "zh")).toBe("/zh/brand");
  });
});
