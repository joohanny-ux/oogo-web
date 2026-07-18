// Footer 소셜 링크 배열과 기존 URL 필드의 호환 동작을 검증한다.
import { describe, expect, it } from "vitest";
import { resolveSocialLinks } from "@/components/public/SiteFooter";

describe("Footer social links", () => {
  it("uses the ordered social link array and omits hidden entries", () => {
    expect(
      resolveSocialLinks({
        socialLinks: [
          { platform: "youtube", href: "https://youtube.com/@oogo", label: "OOGO Films", visible: true },
          { platform: "instagram", href: "https://instagram.com/oogo", visible: false }
        ]
      })
    ).toEqual([{ icon: "youtube", href: "https://youtube.com/@oogo", label: "OOGO Films" }]);
  });

  it("allows all social links to be removed", () => {
    expect(resolveSocialLinks({ socialLinks: [] })).toEqual([]);
  });

  it("keeps existing fixed social URLs as a migration fallback", () => {
    expect(resolveSocialLinks({ instagram: "https://instagram.com/custom" })[0]).toMatchObject({
      icon: "instagram",
      href: "https://instagram.com/custom"
    });
  });

  it("uses defaults when the Footer contact block does not exist", () => {
    expect(resolveSocialLinks(undefined)).toHaveLength(5);
  });
});
