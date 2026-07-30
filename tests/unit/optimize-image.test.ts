import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getWebImagePreset, optimizeWebImage, replaceExtensionWithWebp } from "@/lib/optimize-image";

describe("optimizeWebImage", () => {
  it("converts a large PNG into a smaller webp under the product edge limit", async () => {
    const source = readFileSync(path.join(process.cwd(), "public/images/home-archive/OG26001C2_07.png"));
    expect(source.byteLength).toBeGreaterThan(1.5 * 1024 * 1024);

    const optimized = await optimizeWebImage(source, "product");

    expect(optimized.contentType).toBe("image/webp");
    expect(optimized.extension).toBe("webp");
    expect(optimized.bytes).toBeLessThan(source.byteLength);
    expect(optimized.bytes).toBeLessThan(600 * 1024);
    expect(Math.max(optimized.width, optimized.height)).toBeLessThanOrEqual(getWebImagePreset("product").maxEdge);
  }, 20000);

  it("rewrites filenames to webp", () => {
    expect(replaceExtensionWithWebp("OG26001C2_07.PNG")).toBe("OG26001C2_07.webp");
    expect(replaceExtensionWithWebp("photo")).toBe("photo.webp");
  });

  it("keeps archive lightbox sharper than product thumbs", () => {
    expect(getWebImagePreset("archive").maxEdge).toBeGreaterThan(getWebImagePreset("product").maxEdge);
    expect(getWebImagePreset("archive").quality).toBeGreaterThan(getWebImagePreset("product").quality);
  });
});
