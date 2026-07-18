import { HomeHeroSlider } from "@/components/public/HomeHeroSlider";
import type { Locale } from "@/lib/i18n";
import { getHomeHeroSettings, type LandingContent } from "@/lib/home-landing";

export function HeroSection({ content, locale = "ko" }: { content?: LandingContent; locale?: Locale }) {
  const settings = getHomeHeroSettings(content, locale);

  return <HomeHeroSlider {...settings} locale={locale} />;
}
