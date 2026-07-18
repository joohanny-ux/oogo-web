import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = fs
  .readFileSync(path.join(process.cwd(), "src/app/public-final.css"), "utf8")
  .replace(/\r\n/g, "\n");

describe("public home visual hierarchy", () => {
  it("uses the collection section color behind product images", () => {
    expect(css).toMatch(/\.collection-wall \.product-visual[\s\S]*?background-color: #eeeae2 !important;/);
  });

  it("keeps footer copy readable without enlarging its icon controls", () => {
    expect(css).toContain(`body .site-footer p,
body .site-footer a,
body .footer-contact span,
body .copyright {
  font-size: 0.74rem !important;`);
    expect(css).toContain(`body .footer-legal a {
  color: rgba(244, 239, 230, 0.68) !important;
  font-size: 0.62rem !important;`);
  });

  it("defines a stable full-bleed hero track and progress controls", () => {
    expect(css).toMatch(/\.home-hero-slider[\s\S]*?min-height: 100svh !important;[\s\S]*?overflow: hidden !important;/);
    expect(css).toMatch(/\.home-hero-track[\s\S]*?display: flex !important;[\s\S]*?transition: transform 700ms/);
    expect(css).toMatch(/\.hero-progress-button[\s\S]*?width: 32px !important;[\s\S]*?height: 32px !important;/);
    expect(css).toMatch(/\.site-header\.is-overlay:not\(\.is-scrolled\)[\s\S]*?background: transparent !important;/);
  });

  it("uses comfortably readable inquiry typography and controls", () => {
    expect(css).toMatch(/\.inquiry-page[\s\S]*?min-height: auto !important;[\s\S]*?padding: 104px max\(32px, 6vw\) 88px !important;/);
    expect(css).toMatch(/\.inquiry-page-layout[\s\S]*?max-width: 1240px !important;/);
    expect(css).toMatch(/\.inquiry-page-body[\s\S]*?font-size: 0\.9rem !important;/);
    expect(css).toMatch(/\.inquiry-form-card label[\s\S]*?font-size: 0\.74rem !important;/);
    expect(css).toMatch(/\.inquiry-form-card input,[\s\S]*?min-height: 52px !important;[\s\S]*?font-size: 0\.88rem !important;/);
    expect(css).toMatch(/\.inquiry-submit[\s\S]*?min-height: 54px !important;[\s\S]*?font-size: 0\.78rem !important;/);
  });

  it("gives the Youngbin Edition a compact four-chapter responsive layout", () => {
    expect(css).toMatch(/\.youngbin-project-hero[\s\S]*?min-height: clamp\(560px, 70svh, 760px\) !important;/);
    expect(css).toMatch(/\.youngbin-project-hero-copy h1[\s\S]*?font-size: clamp\(2\.6rem, 5vw, 4\.75rem\) !important;/);
    expect(css).toMatch(/\.youngbin-project-story-edition[\s\S]*?grid-template-columns: minmax\(0, 1\.12fr\) minmax\(0, 0\.88fr\) !important;/);
    expect(css).toMatch(/\.youngbin-project-story-edition[\s\S]*?border-top: clamp\(28px, 3vw, 44px\) solid #211d18 !important;/);
    expect(css).toMatch(/\.youngbin-project-story-copy h2[\s\S]*?font-size: clamp\(1\.4rem, 1\.85vw, 2rem\) !important;/);
    expect(css).toMatch(/\.youngbin-project-story-edition[\s\S]*?min-height: 520px !important;/);
    expect(css).toMatch(/\.youngbin-project-edition-meta[\s\S]*?font-size: 0\.7rem !important;/);
    expect(css).toMatch(/\.youngbin-project-gallery-grid[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\) !important;/);
    expect(css).toMatch(/\.youngbin-project-gallery-item[\s\S]*?aspect-ratio: 4 \/ 5 !important;/);
    expect(css).toMatch(/\.youngbin-project-profile[\s\S]*?grid-template-columns: minmax\(0, 0\.82fr\) minmax\(0, 1\.18fr\) !important;[\s\S]*?min-height: 520px !important;/);
    expect(css).toMatch(/\.youngbin-project-profile-copy blockquote strong[\s\S]*?font-size: clamp\(1\.25rem, 2vw, 1\.8rem\) !important;/);
    expect(css).toMatch(/@media \(max-width: 840px\)[\s\S]*?\.youngbin-project-story-edition,[\s\S]*?\.youngbin-project-profile[\s\S]*?grid-template-columns: 1fr !important;/);
  });

  it("keeps the single-project index compact", () => {
    expect(css).toMatch(/\.projects-page[\s\S]*?min-height: auto !important;/);
  });

  it("shows the language switcher on mobile and tablet headers", () => {
    expect(css).toMatch(
      /@media \(max-width: 840px\)[\s\S]*?\.site-nav[\s\S]*?display: none !important;[\s\S]*?\.locale-switcher[\s\S]*?display: block !important;/
    );
    expect(css).not.toMatch(/@media \(max-width: 640px\)[\s\S]*?body \.locale-switcher \{\s*display: none !important;/);
  });
});
