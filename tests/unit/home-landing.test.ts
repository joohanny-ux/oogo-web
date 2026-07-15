import { describe, expect, it } from "vitest";
import {
  getHomeHeroSettings,
  getHomeLandingContent,
  getLandingPageContent,
  landingText
} from "@/lib/home-landing";

describe("home landing content", () => {
  it("maps only published Home blocks by block key", () => {
    expect(
      getHomeLandingContent([
        { page_key: "home", block_key: "hero", published_content: { heading: "Published OOGO" } },
        { page_key: "collection", block_key: "hero", published_content: { heading: "Other page" } }
      ])
    ).toEqual({ hero: { heading: "Published OOGO" } });
  });

  it("uses saved text when present and otherwise keeps the public fallback", () => {
    expect(landingText({ heading: "  New heading  " }, "heading", "OOGO")).toBe("New heading");
    expect(landingText({}, "heading", "OOGO")).toBe("OOGO");
  });

  it("maps published content for any requested public page", () => {
    expect(
      getLandingPageContent(
        [
          { page_key: "brand-story", block_key: "statement", published_content: { body: "Brand copy" } },
          { page_key: "projects", block_key: "intro", published_content: { heading: "Projects" } }
        ],
        "brand-story"
      )
    ).toEqual({ statement: { body: "Brand copy" } });
  });

  it("normalizes at most five valid hero slides", () => {
    const slides = Array.from({ length: 7 }, (_, index) => ({
      mediaUrl: ` /hero-${index + 1}.webp `,
      heading: `Slide ${index + 1}`
    }));

    expect(getHomeHeroSettings({ slides: [null, {}, ...slides] }).slides).toHaveLength(5);
    expect(getHomeHeroSettings({ slides }).slides[0]).toMatchObject({
      mediaUrl: "/hero-1.webp",
      heading: "Slide 1"
    });
  });

  it("keeps the existing single hero content as a fallback slide", () => {
    expect(
      getHomeHeroSettings({
        mediaUrl: "/legacy-hero.webp",
        eyebrow: "OOGO 2026",
        heading: "OOGO",
        line: "Quiet confidence."
      }).slides
    ).toEqual([
      {
        id: "hero-1",
        mediaUrl: "/legacy-hero.webp",
        alt: "OOGO",
        eyebrow: "OOGO 2026",
        heading: "OOGO",
        line: "Quiet confidence."
      }
    ]);
  });

  it("clamps hero autoplay timing between three and fifteen seconds", () => {
    expect(getHomeHeroSettings({ intervalMs: 1200 }).intervalMs).toBe(3000);
    expect(getHomeHeroSettings({ intervalMs: 24000 }).intervalMs).toBe(15000);
    expect(getHomeHeroSettings({ autoplay: false }).autoplay).toBe(false);
  });
});
