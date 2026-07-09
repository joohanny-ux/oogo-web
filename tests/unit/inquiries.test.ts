import { describe, expect, it } from "vitest";
import { validateInquiryInput } from "@/lib/inquiries";

describe("inquiry validation", () => {
  it("accepts valid inquiry data", () => {
    const result = validateInquiryInput({
      type: "buyer",
      name: "Jane",
      email: "jane@example.com",
      message: "I want to discuss wholesale.",
      company: "Studio",
      country: "Korea",
      phone: "",
      privacyConsent: true
    });

    expect(result.ok).toBe(true);
  });

  it("keeps press inquiries as press", () => {
    const result = validateInquiryInput({
      type: "press",
      name: "Jane",
      email: "jane@example.com",
      message: "Press request for campaign images.",
      privacyConsent: true
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.type).toBe("press");
    }
  });

  it("rejects invalid email", () => {
    const result = validateInquiryInput({
      type: "buyer",
      name: "Jane",
      email: "bad",
      message: "Hello"
    });

    expect(result.ok).toBe(false);
  });
});
