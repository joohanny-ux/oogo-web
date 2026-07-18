import { describe, expect, it } from "vitest";
import { getFeaturedSpecialEdition } from "@/lib/special-editions";

describe("special editions", () => {
  it("returns a featured collaboration with campaign metadata", () => {
    const edition = getFeaturedSpecialEdition();

    expect(edition.title).toBe("Youngbin Edition");
    expect(edition.collaborator).toBe("Youngbin");
    expect(edition.tags).toEqual(["Photography", "Limited color", "Buyer catalog"]);
    expect(edition.relatedProducts).toContain("OG26001C2");
  });

  it("provides the complete Youngbin editorial fallback", () => {
    const edition = getFeaturedSpecialEdition();

    expect(edition.images.collaborationHero).toContain("youngbin-edition");
    expect(edition.statement.statementEn).toBe(
      "Photography and eyewear begin with light. Both shape what we choose to remember."
    );
    expect(edition.statement.bodyKo).toBe(
      "사진가의 시선과 OOGO의 프레임이 만나 빛과 순간을 기록합니다."
    );
    expect(edition.statement.themes).toEqual(["Light", "Gaze", "Memory"]);
    expect(edition.limited.features).toHaveLength(3);
    expect(edition.profile.archiveHref).toBe("/archive/youngbin-edition");
    expect(edition.gallery).toHaveLength(5);
  });
});
