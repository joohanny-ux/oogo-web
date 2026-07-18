import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = fs.readFileSync(path.join(process.cwd(), "src/app/brand/page.tsx"), "utf8");
const publicStyles = fs.readFileSync(path.join(process.cwd(), "src/app/public-final.css"), "utf8");

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

  it("renders concise descriptions for all six Essence cards", () => {
    expect(pageSource).not.toContain('landingText(essence, "intro"');
    expect(pageSource).not.toContain('landingText(philosophy, "intro"');
    expect(pageSource).not.toContain('landingText(experience, "intro"');
    expect(pageSource).toContain("<span>{item.index}</span>");
    expect(pageSource).toContain("<p>{item.body}</p>");
    expect(pageSource).toContain("--brand-essence-image");
    expect(publicStyles).toContain("var(--brand-essence-image");
  });

  it("uses CMS media for Hero, Statement, Philosophy, and six Experience images", () => {
    expect(pageSource).toContain('landingMediaUrl(hero, "/images/oogo-gallery.png")');
    expect(pageSource).toContain('landingMediaUrl(statement, "/images/oogo-hero.png")');
    expect(pageSource).toContain("resolvedPhilosophies");
    expect(pageSource).toContain("resolvedExperienceImages");
    expect(pageSource).toContain("experienceImages.map");
    expect(pageSource).toContain("`image${index + 1}Url`");
    expect(publicStyles).toContain("var(--brand-statement-image");
  });

  it("keeps both Closing CTA links centered together", () => {
    expect(pageSource).toContain('className="brand-page-cta"');
    expect(pageSource).toContain('className="brand-page-cta-secondary"');
    expect(publicStyles).toContain("body .brand-page-closing .brand-page-cta");
    expect(publicStyles).toContain("justify-content: center !important;");
    expect(publicStyles).toContain("body .brand-page-closing .brand-page-cta .editorial-cta");
    expect(publicStyles).toContain("margin-top: 0 !important;");
  });

  it("keeps brand closing copy readable without oversized mid-line breaks", () => {
    expect(publicStyles).toContain("body .brand-page-closing > p");
    expect(publicStyles).toContain("word-break: keep-all !important;");
    expect(publicStyles).toContain("max-width: min(38em, 680px) !important;");
    expect(publicStyles).toContain("font-size: clamp(1.02rem, 1.6vw, 1.35rem) !important;");
    expect(publicStyles).not.toContain("font-size: clamp(1.5rem, 3vw, 2.8rem) !important;");
  });
});
