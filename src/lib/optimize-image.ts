import sharp from "sharp";

export type WebImagePreset = "product" | "archive" | "landing";

const presets: Record<
  WebImagePreset,
  {
    maxEdge: number;
    quality: number;
    /** Reject source files larger than this before processing. */
    maxSourceBytes: number;
  }
> = {
  product: { maxEdge: 1800, quality: 78, maxSourceBytes: 12 * 1024 * 1024 },
  archive: { maxEdge: 2000, quality: 78, maxSourceBytes: 12 * 1024 * 1024 },
  landing: { maxEdge: 2200, quality: 80, maxSourceBytes: 12 * 1024 * 1024 }
};

export const webImageInputTypes = ["image/jpeg", "image/png", "image/webp"] as const;

export function getWebImagePreset(preset: WebImagePreset) {
  return presets[preset];
}

export type OptimizedWebImage = {
  buffer: Buffer;
  contentType: "image/webp";
  extension: "webp";
  width: number;
  height: number;
  bytes: number;
  sourceBytes: number;
};

/**
 * Normalize uploads for public web delivery.
 * Keeps originals out of Storage by converting to resized WebP.
 */
export async function optimizeWebImage(
  input: Buffer | ArrayBuffer | Uint8Array,
  preset: WebImagePreset
): Promise<OptimizedWebImage> {
  const source = Buffer.isBuffer(input)
    ? input
    : Buffer.from(input instanceof ArrayBuffer ? new Uint8Array(input) : input);
  const config = presets[preset];

  if (source.byteLength > config.maxSourceBytes) {
    throw new Error(`Image is over ${Math.round(config.maxSourceBytes / 1024 / 1024)}MB.`);
  }

  if (source.byteLength === 0) {
    throw new Error("Image file is empty.");
  }

  const pipeline = sharp(source, { failOn: "none" }).rotate();
  const result = await pipeline
    .resize({
      width: config.maxEdge,
      height: config.maxEdge,
      fit: "inside",
      withoutEnlargement: true
    })
    .webp({ quality: config.quality, effort: 4 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: result.data,
    contentType: "image/webp",
    extension: "webp",
    width: result.info.width,
    height: result.info.height,
    bytes: result.data.byteLength,
    sourceBytes: source.byteLength
  };
}

export function replaceExtensionWithWebp(fileName: string) {
  const base = fileName.replace(/\.[^.]+$/, "") || "image";
  return `${base}.webp`;
}
