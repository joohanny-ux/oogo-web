/** Vercel serverless request bodies are capped around 4.5MB. Stay under that before API upload. */
export const VERCEL_SAFE_UPLOAD_BYTES = 3.5 * 1024 * 1024;

export const CLIENT_MAX_EDGE = {
  archive: 2400,
  landing: 2200,
  product: 1800
} as const;

export function shouldShrinkBeforeUpload(bytes: number) {
  return bytes > VERCEL_SAFE_UPLOAD_BYTES;
}

/**
 * Downscale large images in the browser so they can reach upload APIs on Vercel.
 * Server-side sharp still produces the final WebP asset.
 */
export async function prepareClientUploadImage(
  file: File,
  maxEdge: number,
  fallbackBaseName = "upload-image"
): Promise<File> {
  if (typeof window === "undefined" || !shouldShrinkBeforeUpload(file.size)) {
    return file;
  }

  const type = file.type.toLowerCase();
  if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(type)) {
    return file;
  }

  const bitmap = await createImageBitmap(file);

  try {
    const longest = Math.max(bitmap.width, bitmap.height);
    const scale = Math.min(1, maxEdge / longest);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      return file;
    }

    context.drawImage(bitmap, 0, 0, width, height);

    const baseName = file.name.replace(/\.[^.]+$/, "") || fallbackBaseName;
    for (const quality of [0.88, 0.8, 0.72, 0.64, 0.56, 0.48]) {
      const blob = await canvasToJpegBlob(canvas, quality);
      if (blob && blob.size <= VERCEL_SAFE_UPLOAD_BYTES) {
        return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
      }
    }

    const fallback = await canvasToJpegBlob(canvas, 0.42);
    if (fallback) {
      return new File([fallback], `${baseName}.jpg`, { type: "image/jpeg" });
    }

    return file;
  } finally {
    bitmap.close();
  }
}

function canvasToJpegBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", quality);
  });
}
