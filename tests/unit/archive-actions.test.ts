import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildArchiveUploadRequest,
  buildArchiveUploadForms,
  formatArchiveFileSize,
  getArchiveUploadFiles,
  requireArchiveUploadFiles,
  validateArchiveImage
} from "@/lib/archive-upload";

const actionsSource = readFileSync(join(process.cwd(), "src/app/admin/archive/actions.ts"), "utf8");
const fileActionsSource = readFileSync(join(process.cwd(), "src/app/admin/files/actions.ts"), "utf8");
const uploadRoutePath = join(process.cwd(), "src/app/api/admin/archive/upload/route.ts");
const uploadRouteSource = existsSync(uploadRoutePath) ? readFileSync(uploadRoutePath, "utf8") : "";

describe("Archive admin actions", () => {
  it("collects multiple non-empty Archive files", () => {
    const formData = new FormData();
    formData.append("archiveFiles", new File(["first"], "first.jpg", { type: "image/jpeg" }));
    formData.append("archiveFiles", new File(["second"], "second.webp", { type: "image/webp" }));
    formData.append("archiveFiles", new File([], "empty.png", { type: "image/png" }));

    expect(getArchiveUploadFiles(formData).map((file) => file.name)).toEqual(["first.jpg", "second.webp"]);
  });

  it("splits a large multi-select into one Server Action request per image", () => {
    const files = Array.from(
      { length: 9 },
      (_, index) => new File([`image-${index}`], `${index + 1}.jpg`, { type: "image/jpeg" })
    );

    const forms = buildArchiveUploadForms(files, "youngbin-edition");

    expect(forms).toHaveLength(9);
    expect(forms.every((form) => form.getAll("archiveFiles").length === 1)).toBe(true);
    expect(forms.every((form) => form.get("collectionKey") === "youngbin-edition")).toBe(true);
  });

  it("rejects an Archive save request when the multipart file is missing", () => {
    expect(() => requireArchiveUploadFiles(new FormData())).toThrow("저장할 이미지를 다시 선택해 주세요.");
  });

  it("builds a raw binary upload request instead of multipart FormData", () => {
    const file = new File(["photo"], "영빈 04.jpg", { type: "image/jpeg" });
    const request = buildArchiveUploadRequest(file, "youngbin-edition");

    expect(request.url).toBe("/api/admin/archive/upload");
    expect(request.init.method).toBe("POST");
    expect(request.init.body).toBe(file);
    expect(request.init.headers).toMatchObject({
      "content-type": "image/jpeg",
      "x-archive-collection": "youngbin-edition",
      "x-archive-file-name": encodeURIComponent("영빈 04.jpg")
    });
  });

  it("reads Archive API uploads as raw bytes without multipart parsing", () => {
    expect(uploadRouteSource).toContain("request.arrayBuffer()");
    expect(uploadRouteSource).not.toContain("request.formData()");
  });

  it("accepts web images up to 8MB and rejects other uploads", () => {
    expect(validateArchiveImage(new File(["image"], "image.png", { type: "image/png" }))).toEqual({ ok: true });
    expect(validateArchiveImage(new File(["text"], "notes.txt", { type: "text/plain" }))).toEqual({
      ok: false,
      message: "JPG, PNG, WebP 이미지만 업로드할 수 있습니다."
    });

    const oversized = new File([new Uint8Array(8 * 1024 * 1024 + 1)], "large.jpg", { type: "image/jpeg" });
    expect(validateArchiveImage(oversized)).toEqual({
      ok: false,
      message: "이미지당 최대 용량은 8MB입니다."
    });
  });

  it("formats selected file sizes for immediate upload feedback", () => {
    expect(formatArchiveFileSize(10 * 1024 * 1024)).toBe("10.0MB");
    expect(formatArchiveFileSize(7.25 * 1024 * 1024)).toBe("7.3MB");
  });

  it("persists drafts, publishes newest items, and supports replace and delete", () => {
    expect(actionsSource).toContain("getArchiveUploadFiles(formData)");
    expect(actionsSource).toContain('.from("archive_items")');
    expect(actionsSource).toContain("published: false");
    expect(actionsSource).toContain("published: true");
    expect(actionsSource).toContain("published_at");
    expect(actionsSource).toContain("replaceArchiveItemAction");
    expect(actionsSource).toContain("deleteArchiveItemAction");
    expect(actionsSource).toContain('revalidatePath("/archive")');
  });

  it("validates and scopes every Archive mutation to its selected collection", () => {
    expect(actionsSource).toContain("requireArchiveCollection");
    expect(actionsSource).toContain("collection_key: collectionKey");
    expect(actionsSource).toContain('.eq("collection_key", collectionKey)');
    expect(actionsSource).toContain('revalidatePath("/archive/youngbin-edition")');
  });

  it("prevents Files deletion while an asset is used by Archive", () => {
    expect(fileActionsSource).toContain('.from("archive_items")');
    expect(fileActionsSource).toContain('.eq("asset_id", id)');
  });
});
