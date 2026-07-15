import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HomeHeroSlider, getAdjacentHeroIndex } from "@/components/public/HomeHeroSlider";
import type { HomeHeroSlide } from "@/lib/home-landing";

function createSlide(index: number): HomeHeroSlide {
  return {
    id: `hero-${index}`,
    mediaUrl: `/hero-${index}.webp`,
    alt: `OOGO campaign ${index}`,
    eyebrow: "OOGO 2026",
    heading: `OOGO ${index}`,
    line: "Frames for light."
  };
}

describe("HomeHeroSlider", () => {
  it("renders one slide without progress controls", () => {
    const html = renderToStaticMarkup(
      <HomeHeroSlider slides={[createSlide(1)]} autoplay intervalMs={6000} />
    );

    expect(html).toContain('aria-roledescription="carousel"');
    expect(html).toContain('data-interval-ms="6000"');
    expect(html).not.toContain("hero-progress");
  });

  it("renders one progress button for each supplied slide", () => {
    const html = renderToStaticMarkup(
      <HomeHeroSlider
        slides={Array.from({ length: 5 }, (_, index) => createSlide(index + 1))}
        autoplay
        intervalMs={8000}
      />
    );

    expect(html.match(/class="hero-progress-button/g)).toHaveLength(5);
    expect(html).toContain('aria-label="슬라이드 5 보기"');
    expect(html).toContain('data-interval-ms="8000"');
  });

  it("wraps slide navigation at both ends", () => {
    expect(getAdjacentHeroIndex(0, -1, 5)).toBe(4);
    expect(getAdjacentHeroIndex(4, 1, 5)).toBe(0);
  });
});
