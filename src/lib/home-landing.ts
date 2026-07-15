export type LandingContent = Record<string, unknown>;

export type HomeHeroSlide = {
  id: string;
  mediaUrl: string;
  alt: string;
  eyebrow: string;
  heading: string;
  line: string;
};

export type HomeHeroSettings = {
  slides: HomeHeroSlide[];
  autoplay: boolean;
  intervalMs: number;
};

type LandingBlock = {
  page_key: string;
  block_key: string;
  published_content: LandingContent | null;
};

export function getHomeLandingContent(blocks: LandingBlock[]) {
  return getLandingPageContent(blocks, "home");
}

export function getLandingPageContent(blocks: LandingBlock[], pageKey: string) {
  return Object.fromEntries(
    blocks
      .filter((block) => block.page_key === pageKey)
      .map((block) => [block.block_key, block.published_content ?? {}])
  ) as Record<string, LandingContent>;
}

export function landingText(content: LandingContent | undefined, key: string, fallback: string) {
  const value = content?.[key];

  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function landingMediaUrl(content: LandingContent | undefined, fallback: string) {
  return landingText(content, "mediaUrl", landingText(content, "imageUrl", fallback));
}

function isLandingContent(value: unknown): value is LandingContent {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getHomeHeroSettings(content: LandingContent = {}): HomeHeroSettings {
  const globalEyebrow = landingText(content, "eyebrow", "OOGO 2026");
  const globalHeading = landingText(content, "heading", "OOGO");
  const globalLine = landingText(content, "line", "Frames for light, face, and quiet attitude.");
  const savedSlides = Array.isArray(content.slides) ? content.slides : [];
  const slides = savedSlides
    .filter(isLandingContent)
    .filter((slide) => landingMediaUrl(slide, "") !== "")
    .slice(0, 5)
    .map((slide, index) => {
      const heading = landingText(slide, "heading", globalHeading);

      return {
        id: landingText(slide, "id", `hero-${index + 1}`),
        mediaUrl: landingMediaUrl(slide, ""),
        alt: landingText(slide, "alt", heading),
        eyebrow: landingText(slide, "eyebrow", globalEyebrow),
        heading,
        line: landingText(slide, "line", globalLine)
      };
    });

  const rawInterval = Number(content.intervalMs ?? content.autoplayInterval ?? 6000);
  const intervalMs = Math.min(15000, Math.max(3000, Number.isFinite(rawInterval) ? rawInterval : 6000));

  return {
    slides:
      slides.length > 0
        ? slides
        : [
            {
              id: "hero-1",
              mediaUrl: landingMediaUrl(content, "/images/oogo-hero.png"),
              alt: landingText(content, "alt", globalHeading),
              eyebrow: globalEyebrow,
              heading: globalHeading,
              line: globalLine
            }
          ],
    autoplay: content.autoplay !== false && content.autoplay !== "false",
    intervalMs
  };
}
