import { describe, expect, it } from "vitest";
import {
  applyHomeMediaFromSource,
  applyLandingMediaFromSource,
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

  it("reuses Korean home media while keeping locale copy", () => {
    const merged = applyHomeMediaFromSource(
      {
        hero: {
          heading: "OOGO EN",
          line: "English line",
          mediaUrl: "/images/oogo-hero.png",
          slides: [{ heading: "EN slide", mediaUrl: "/images/old-en.webp" }]
        },
        "special-preview": {
          heading: "Youngbin Edition",
          mediaUrl: "/images/oogo-gallery.png"
        },
        "archive-preview": {
          eyebrow: "Archive",
          image1Url: "/images/old-en-archive.webp"
        }
      },
      {
        hero: {
          heading: "OOGO KO",
          mediaUrl: "/images/ko-hero.webp",
          autoplay: false,
          intervalMs: 3000,
          slides: [{ heading: "KO slide", mediaType: "video", mediaUrl: "/images/ko-slide.webm", posterUrl: "/images/ko-poster.webp" }]
        },
        "special-preview": {
          heading: "Youngbin KO",
          mediaUrl: "https://cdn.example.com/ko-special.png"
        },
        "archive-preview": {
          eyebrow: "아카이브",
          image1Url: "/images/ko-archive-1.webp",
          image4Url: "/images/ko-archive-4.webp"
        }
      }
    );

    expect(merged.hero).toMatchObject({
      heading: "OOGO EN",
      line: "English line",
      mediaUrl: "/images/ko-hero.webp",
      autoplay: false,
      intervalMs: 3000
    });
    expect(merged.hero.slides).toEqual([
      {
        heading: "EN slide",
        mediaType: "video",
        mediaUrl: "/images/ko-slide.webm",
        posterUrl: "/images/ko-poster.webp"
      }
    ]);
    expect(merged["special-preview"]).toMatchObject({
      heading: "Youngbin Edition",
      mediaUrl: "https://cdn.example.com/ko-special.png"
    });
    expect(merged["archive-preview"]).toMatchObject({
      eyebrow: "Archive",
      image1Url: "/images/ko-archive-1.webp",
      image4Url: "/images/ko-archive-4.webp"
    });
  });

  it("shares KO brand media into EN copy while keeping English text", () => {
    const merged = applyLandingMediaFromSource(
      {
        "story-hero": { heading: "OOGO", mediaUrl: "/images/old-en.webp" },
        statement: { headline: "EN statement", mediaUrl: "/images/old-statement.webp" }
      },
      {
        "story-hero": { heading: "OOGO KO", mediaUrl: "/images/ko-brand.webp" },
        statement: { headline: "KO statement", mediaUrl: "/images/ko-statement.webp" },
        experience: { image1Url: "/images/ko-experience-1.webp", image6Url: "/images/ko-experience-6.webp" }
      }
    );

    expect(merged["story-hero"]).toMatchObject({ heading: "OOGO", mediaUrl: "/images/ko-brand.webp" });
    expect(merged.statement).toMatchObject({ headline: "EN statement", mediaUrl: "/images/ko-statement.webp" });
    expect(merged.experience).toMatchObject({
      image1Url: "/images/ko-experience-1.webp",
      image6Url: "/images/ko-experience-6.webp"
    });
  });

  it("normalizes at most five valid hero slides", () => {
    const slides = Array.from({ length: 7 }, (_, index) => ({
      mediaUrl: ` /hero-${index + 1}.webp `,
      heading: `Slide ${index + 1}`
    }));

    expect(getHomeHeroSettings({ slides: [null, {}, ...slides] }).slides).toHaveLength(5);
    expect(getHomeHeroSettings({ slides }).slides[0]).toMatchObject({
      mediaType: "image",
      mediaUrl: "/hero-1.webp",
      posterUrl: "",
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
        mediaType: "image",
        mediaUrl: "/legacy-hero.webp",
        posterUrl: "",
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
