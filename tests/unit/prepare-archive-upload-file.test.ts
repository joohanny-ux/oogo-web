import { describe, expect, it } from "vitest";
import {
  ARCHIVE_CLIENT_MAX_EDGE,
  shouldShrinkBeforeUpload,
  VERCEL_SAFE_UPLOAD_BYTES
} from "@/lib/prepare-archive-upload-file";

describe("prepareArchiveUploadFile helpers", () => {
  it("shrinks files above the Vercel-safe upload threshold", () => {
    expect(shouldShrinkBeforeUpload(VERCEL_SAFE_UPLOAD_BYTES)).toBe(false);
    expect(shouldShrinkBeforeUpload(VERCEL_SAFE_UPLOAD_BYTES + 1)).toBe(true);
    expect(shouldShrinkBeforeUpload(8 * 1024 * 1024)).toBe(true);
  });

  it("keeps the archive client resize edge aligned with the server preset", () => {
    expect(ARCHIVE_CLIENT_MAX_EDGE).toBe(2400);
  });
});
