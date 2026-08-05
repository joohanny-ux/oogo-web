const landingUrlFields = [
  "mediaUrl",
  "imageUrl",
  "posterUrl",
  "image1Url",
  "image2Url",
  "image3Url",
  "image4Url",
  "image5Url",
  "image6Url"
] as const;

function isHttpUrl(value: unknown): value is string {
  return typeof value === "string" && /^https?:\/\//.test(value.trim());
}

export function collectLandingContentUrls(content: Record<string, unknown> | null | undefined) {
  if (!content) {
    return [] as string[];
  }

  const urls = new Set<string>();

  for (const key of landingUrlFields) {
    const value = content[key];
    if (isHttpUrl(value)) {
      urls.add(value.trim());
    }
  }

  const slides = content.slides;
  if (Array.isArray(slides)) {
    for (const slide of slides) {
      if (!slide || typeof slide !== "object") continue;
      const record = slide as Record<string, unknown>;
      if (isHttpUrl(record.mediaUrl)) {
        urls.add(record.mediaUrl.trim());
      }
      if (isHttpUrl(record.posterUrl)) {
        urls.add(record.posterUrl.trim());
      }
    }
  }

  return [...urls];
}

export function buildLandingUsageLabel(pageKey: string, blockKey: string) {
  return `${pageKey} · ${blockKey}`;
}
