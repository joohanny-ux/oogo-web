export const archiveCollectionKeys = ["oogo", "youngbin-edition"] as const;

export type ArchiveCollectionKey = (typeof archiveCollectionKeys)[number];

export function parseArchiveCollection(value: string | string[] | undefined): ArchiveCollectionKey {
  const candidate = Array.isArray(value) ? value[0] : value;
  return archiveCollectionKeys.includes(candidate as ArchiveCollectionKey)
    ? (candidate as ArchiveCollectionKey)
    : "oogo";
}

export function archiveCollectionLabel(collectionKey: ArchiveCollectionKey) {
  return collectionKey === "youngbin-edition" ? "Youngbin Edition" : "OOGO Archive";
}
