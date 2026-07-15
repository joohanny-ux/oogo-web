import { HomeHeroSlider } from "@/components/public/HomeHeroSlider";
import { getHomeHeroSettings, type LandingContent } from "@/lib/home-landing";

export function HeroSection({ content }: { content?: LandingContent }) {
  const settings = getHomeHeroSettings(content);

  return <HomeHeroSlider {...settings} />;
}
