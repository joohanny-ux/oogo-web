import { describe, expect, it } from "vitest";
import { getServiceHighlights } from "@/lib/service";

describe("service highlights", () => {
  it("returns quality and inquiry trust points for the public homepage", () => {
    expect(getServiceHighlights().map((item) => item.title)).toEqual([
      "UV400 Protection",
      "Lightweight Frame",
      "Buyer & Retail",
      "Response Guide"
    ]);
  });
});
