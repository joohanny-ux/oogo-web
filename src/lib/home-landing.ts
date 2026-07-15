import type { Locale } from "@/lib/i18n";
import { landingTextForLocale, publicCopy, resolveLocaleText } from "@/lib/public-copy";

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

const HOME_MEDIA_KEYS = ["mediaUrl", "imageUrl", "image2Url", "image3Url", "image4Url"] as const;

function copyLandingMediaFields(target: LandingContent, source: LandingContent): LandingContent {
  const next: LandingContent = { ...target };

  for (const key of HOME_MEDIA_KEYS) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      next[key] = value.trim();
    }
  }

  if (Array.isArray(source.slides) && source.slides.length > 0) {
    const targetSlides = Array.isArray(target.slides) ? target.slides : [];
    next.slides = source.slides.map((slide, index) => {
      if (!isLandingContent(slide)) {
        return slide;
      }

      const existing = isLandingContent(targetSlides[index]) ? targetSlides[index] : {};
      return copyLandingMediaFields(existing, slide);
    });
  }

  return next;
}

/** EN/CN Home은 문구만 유지하고, 최신 공개 이미지는 KO Home 미디어를 공유한다. */
export function applyHomeMediaFromSource(
  content: Record<string, LandingContent>,
  mediaSource: Record<string, LandingContent>
) {
  const blockKeys = ["hero", "collection-preview", "special-preview", "archive-preview"] as const;
  const next = { ...content };

  for (const key of blockKeys) {
    const sourceBlock = mediaSource[key];
    if (!sourceBlock) continue;
    next[key] = copyLandingMediaFields(content[key] ?? {}, sourceBlock);
  }

  return next;
}

export function getHomeHeroSettings(content: LandingContent = {}, locale: Locale = "ko"): HomeHeroSettings {
  const globalEyebrow = landingTextForLocale(content, "eyebrow", locale, publicCopy.home.heroEyebrow);
  const globalHeading = landingTextForLocale(content, "heading", locale, publicCopy.home.heroHeading);
  const globalLine = landingTextForLocale(content, "line", locale, publicCopy.home.heroLine);
  const savedSlides = Array.isArray(content.slides) ? content.slides : [];
  const slides = savedSlides
    .filter(isLandingContent)
    .filter((slide) => landingMediaUrl(slide, "") !== "")
    .slice(0, 5)
    .map((slide, index) => {
      const heading = resolveLocaleText(
        typeof slide.heading === "string" ? slide.heading : undefined,
        locale,
        { ko: globalHeading, en: globalHeading, zh: globalHeading }
      );

      return {
        id: landingText(slide, "id", `hero-${index + 1}`),
        mediaUrl: landingMediaUrl(slide, ""),
        alt: resolveLocaleText(typeof slide.alt === "string" ? slide.alt : undefined, locale, {
          ko: heading,
          en: heading,
          zh: heading
        }),
        eyebrow: resolveLocaleText(typeof slide.eyebrow === "string" ? slide.eyebrow : undefined, locale, {
          ko: globalEyebrow,
          en: globalEyebrow,
          zh: globalEyebrow
        }),
        heading,
        line: resolveLocaleText(typeof slide.line === "string" ? slide.line : undefined, locale, {
          ko: globalLine,
          en: globalLine,
          zh: globalLine
        })
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
              alt: landingTextForLocale(content, "alt", locale, {
                ko: globalHeading,
                en: globalHeading,
                zh: globalHeading
              }),
              eyebrow: globalEyebrow,
              heading: globalHeading,
              line: globalLine
            }
          ],
    autoplay: content.autoplay !== false && content.autoplay !== "false",
    intervalMs
  };
}
