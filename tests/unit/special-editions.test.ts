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
});
