import { describe, expect, it } from "vitest";
import { buildPublicArchiveItems, sortArchiveItemsNewest, type ArchiveItem } from "@/lib/archive-content";
import { parseArchiveCollection } from "@/lib/archive-collections";

const fallback = [
  { id: "fallback", label: "Fallback", image: "/fallback.jpg", category: "campaign" as const }
];

const items: ArchiveItem[] = [
  {
    id: "older",
    collection_key: "oogo",
    asset_id: null,
    image_url: "/older.jpg",
    alt_text: "Older",
    published: true,
    created_at: "2026-07-10T00:00:00.000Z",
    published_at: "2026-07-10T00:00:00.000Z"
  },
  {
    id: "draft",
    collection_key: "oogo",
    asset_id: null,
    image_url: "/draft.jpg",
    alt_text: "Draft",
    published: false,
    created_at: "2026-07-12T00:00:00.000Z",
    published_at: null
  },
  {
    id: "newer",
    collection_key: "oogo",
    asset_id: null,
    image_url: "/newer.jpg",
    alt_text: "Newer",
    published: true,
    created_at: "2026-07-11T00:00:00.000Z",
    published_at: "2026-07-11T00:00:00.000Z"
  }
  ,
  {
    id: "youngbin",
    collection_key: "youngbin-edition",
    asset_id: null,
    image_url: "/youngbin.jpg",
    alt_text: "Youngbin",
    published: true,
    created_at: "2026-07-13T00:00:00.000Z",
    published_at: "2026-07-13T00:00:00.000Z"
  }
];

describe("Archive content", () => {
  it("falls back invalid or missing collection queries to OOGO", () => {
    expect(parseArchiveCollection(undefined)).toBe("oogo");
    expect(parseArchiveCollection("unknown")).toBe("oogo");
    expect(parseArchiveCollection("youngbin-edition")).toBe("youngbin-edition");
  });

  it("sorts Archive items newest first", () => {
    expect(sortArchiveItemsNewest(items, "oogo").map((item) => item.id)).toEqual(["draft", "newer", "older"]);
  });

  it("maps only published rows to the public gallery in newest order", () => {
    expect(buildPublicArchiveItems(items, fallback, "oogo")).toEqual([
      expect.objectContaining({ id: "newer", image: "/newer.jpg", label: "Newer" }),
      expect.objectContaining({ id: "older", image: "/older.jpg", label: "Older" })
    ]);
  });

  it("keeps Youngbin Edition images out of the OOGO gallery", () => {
    expect(buildPublicArchiveItems(items, [], "youngbin-edition")).toEqual([
      expect.objectContaining({ id: "youngbin", image: "/youngbin.jpg" })
    ]);
  });

  it("keeps the legacy gallery when the Archive table is empty", () => {
    expect(buildPublicArchiveItems([], fallback)).toEqual(fallback);
  });
});
