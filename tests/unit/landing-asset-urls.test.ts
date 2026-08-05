import { describe, expect, it } from "vitest";
import { buildLandingUsageLabel, collectLandingContentUrls } from "@/lib/landing-asset-urls";

describe("landing asset urls", () => {
  it("collects media, gallery, and slide urls from landing content", () => {
    const urls = collectLandingContentUrls({
      mediaUrl: "https://example.supabase.co/storage/v1/object/public/oogo-assets/landing/home/hero.webp",
      image1Url: "https://example.supabase.co/storage/v1/object/public/oogo-assets/landing/home/image-1.webp",
      slides: [
        {
          mediaUrl: "https://example.supabase.co/storage/v1/object/public/oogo-assets/landing/home/slide-1.webp",
          posterUrl: "https://example.supabase.co/storage/v1/object/public/oogo-assets/landing/home/poster.webp"
        }
      ]
    });

    expect(urls).toHaveLength(4);
    expect(urls.every((url) => url.includes("supabase.co"))).toBe(true);
  });

  it("builds a readable landing usage label", () => {
    expect(buildLandingUsageLabel("home", "hero")).toBe("home · hero");
  });
});
