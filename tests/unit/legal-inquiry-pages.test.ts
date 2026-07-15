import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function read(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("Korean inquiry and legal pages", () => {
  it("uses Korean public inquiry defaults and clear field requirements", () => {
    const copy = read("src/lib/public-copy.ts");
    const section = read("src/components/public/InquirySection.tsx");
    const form = read("src/components/public/InquiryForm.tsx");

    expect(copy).toContain("제품 및 비즈니스 문의");
    expect(copy).toContain("바이어 카탈로그");
    expect(section).toContain("publicCopy.inquiry");
    expect(form).toContain("바이어");
    expect(form).toContain("필수");
    expect(form).toContain("선택");
    expect(form).toContain("문의 처리 완료 후 3년");
  });

  it("provides substantial Korean terms and privacy notices", () => {
    const legal = read("src/lib/legal-copy.ts");
    const terms = read("src/app/terms-conditions/page.tsx");
    const privacy = read("src/app/privacy-policy/page.tsx");

    expect(legal).toContain("웹사이트 이용약관");
    expect(legal).toContain("준거법 및 관할");
    expect(legal).not.toContain("interim operational summary");
    expect(legal).toContain("개인정보 처리방침");
    expect(legal).toContain("개인정보의 파기");
    expect(legal).toContain("문의 처리 완료 후 3년");
    expect(terms).toContain("resolveLegalDocument");
    expect(privacy).toContain("resolveLegalDocument");
  });
});
