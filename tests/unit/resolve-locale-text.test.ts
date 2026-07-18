// resolveLocaleText가 Hangul 혼입·EN 기본값 잔존을 처리하는지 검증한다.
import { describe, expect, it } from "vitest";
import { resolveLocaleText } from "@/lib/public-copy";

const heroLine = {
  ko: "빛과 얼굴, 조용한 태도를 위한 프레임.",
  en: "Frames for light, face, and quiet attitude.",
  zh: "为光、面容与安静态度而设计的镜框。"
};

describe("resolveLocaleText", () => {
  it("replaces Hangul leftovers on non-Korean locales", () => {
    expect(resolveLocaleText("황혼의 산책", "en", heroLine)).toBe(heroLine.en);
    expect(resolveLocaleText("황혼의 산책", "zh", heroLine)).toBe(heroLine.zh);
  });

  it("replaces English defaults left on KO/ZH drafts", () => {
    expect(resolveLocaleText(heroLine.en, "ko", heroLine)).toBe(heroLine.ko);
    expect(resolveLocaleText(heroLine.en, "zh", heroLine)).toBe(heroLine.zh);
  });

  it("keeps intentional custom English that differs from the default", () => {
    expect(resolveLocaleText("Light & Shadow Gallery.", "ko", heroLine)).toBe("Light & Shadow Gallery.");
  });
});
