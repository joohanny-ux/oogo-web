import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Youngbin Edition project page", () => {
  it("maps all six CMS blocks and keeps the photo archive separate", () => {
    const source = readFileSync("src/app/projects/youngbin-edition/page.tsx", "utf8");

    for (const key of [
      "special-hero",
      "collaboration-statement",
      "limited-edition",
      "edition-gallery",
      "photographer-profile",
      "footer-cta"
    ]) {
      expect(source).toContain(`content["${key}"]`);
    }

    expect(source).toContain("/archive/youngbin-edition");
    expect(source).not.toContain("edition.editorial.map");
  });

  it("renders the compact four-chapter narrative in order", () => {
    const source = readFileSync("src/app/projects/youngbin-edition/page.tsx", "utf8");
    const classes = [
      "youngbin-project-hero",
      "youngbin-project-story-edition",
      "youngbin-project-gallery",
      "youngbin-project-profile"
    ];

    classes.forEach((className, index) => {
      expect(source).toContain(className);
      if (index > 0) {
        expect(source.indexOf(className)).toBeGreaterThan(source.indexOf(classes[index - 1]));
      }
    });

    expect(source).toContain(".slice(0, 4)");
    expect(source).toContain('landingTextForLocale(galleryBlock, "eyebrow"');
    expect(source).toContain('landingTextForLocale(galleryBlock, "heading"');
    expect(source).not.toContain('<section className="youngbin-project-statement"');
    expect(source).not.toContain('<section className="youngbin-project-limited"');
    expect(source).not.toContain('<section className="youngbin-project-footer-cta"');
  });

  it("keeps the collaboration story concise", () => {
    const source = readFileSync("src/app/projects/youngbin-edition/page.tsx", "utf8");

    expect(source).not.toContain('className="youngbin-project-themes"');
    expect(source).not.toContain('className="youngbin-project-features"');
    expect(source).toContain('className="youngbin-project-edition-meta"');
    expect(source).toContain("limitedFeatures.map((feature) => feature.title).join");
  });

  it("keeps navigation actions once at the bottom of the page", () => {
    const source = readFileSync("src/app/projects/youngbin-edition/page.tsx", "utf8");

    expect(source).not.toContain('<div className="youngbin-project-actions">');
    expect(source).not.toContain('>View Photo Archive</a>');
    expect(source).not.toContain('"All projects"');
    expect(source.match(/youngbin-project-profile-actions/g)).toHaveLength(1);
    expect(source).toContain('landingTextForLocale(hero, "body", locale, publicCopy.youngbin.heroBody)');
    expect(source).toContain('landingTextForLocale(statement, "statementEn", locale, publicCopy.youngbin.statementHeadline)');
    expect(source).toContain('landingTextForLocale(footerCta, "primaryLabel", locale, publicCopy.youngbin.buyerInquiry)');
  });
});
