import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = fs.readFileSync(path.join(process.cwd(), "src/app/brand/page.tsx"), "utf8");

describe("public Brand page", () => {
  it("renders the brand book sections in editorial order", () => {
    const sections = [
      'content["story-hero"]',
      "content.about",
      "content.statement",
      "content.essence",
      "content.philosophy",
      "content.experience",
      'content["closing-cta"]'
    ];

    for (const section of sections) {
      expect(pageSource).toContain(section);
    }

    expect(pageSource).toContain("brand-page-about");
    expect(pageSource).toContain("brand-page-essence");
    expect(pageSource).toContain("brand-page-philosophy");
    expect(pageSource).toContain("brand-page-experience");
    expect(pageSource).toContain("brand-page-closing");
  });

  it("provides all six brand essences and five design principles", () => {
    for (const title of ["QUIET", "HUMAN", "LIGHT", "SHADOW", "MEMORY", "FRAME"]) {
      expect(pageSource).toContain(`title: "${title}"`);
    }

    for (const title of ["Proportion", "Balance", "Comfort", "Clarity", "Timeless Form"]) {
      expect(pageSource).toContain(`title: "${title}"`);
    }
  });

  it("keeps section headers and repeated cards concise", () => {
    expect(pageSource).not.toContain('landingText(essence, "intro"');
    expect(pageSource).not.toContain('landingText(philosophy, "intro"');
    expect(pageSource).not.toContain('landingText(experience, "intro"');
    expect(pageSource).not.toContain("<p>{item.body}</p>");
  });
});
