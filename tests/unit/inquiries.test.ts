import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { initialInquirySubmitState, validateInquiryInput } from "@/lib/inquiries";

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

  it("keeps inquiry form initial state outside the use server module", () => {
    expect(initialInquirySubmitState).toEqual({ ok: false, message: "" });

    const actions = fs.readFileSync(path.join(process.cwd(), "src/app/inquiry/actions.ts"), "utf8");
    const form = fs.readFileSync(path.join(process.cwd(), "src/components/public/InquiryForm.tsx"), "utf8");

    expect(actions).toContain('"use server"');
    expect(actions).not.toContain("initialInquirySubmitState");
    expect(form).toContain('from "@/lib/inquiries"');
    expect(form).toContain("initialInquirySubmitState");
  });
});
