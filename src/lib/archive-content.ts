import type { ArchiveGridItem } from "@/lib/archive-items";
import type { ArchiveCollectionKey } from "@/lib/archive-collections";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ArchiveItem = {
  id: string;
  collection_key: ArchiveCollectionKey;
  asset_id: string | null;
  image_url: string;
  alt_text: string;
  published: boolean;
  created_at: string;
  published_at: string | null;
};

const archiveSelect = "id, collection_key, asset_id, image_url, alt_text, published, created_at, published_at";

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function timestamp(item: ArchiveItem, publicOrder = false) {
  return Date.parse((publicOrder ? item.published_at : null) ?? item.created_at);
}

export function sortArchiveItemsNewest(items: ArchiveItem[], collectionKey: ArchiveCollectionKey = "oogo") {
  return items
    .filter((item) => item.collection_key === collectionKey)
    .sort((left, right) => timestamp(right) - timestamp(left));
}

export function buildPublicArchiveItems(
  items: ArchiveItem[],
  fallback: ArchiveGridItem[],
  collectionKey: ArchiveCollectionKey = "oogo"
) {
  const published = items
    .filter((item) => item.published && item.collection_key === collectionKey)
    .sort((left, right) => timestamp(right, true) - timestamp(left, true))
    .map<ArchiveGridItem>((item) => ({
      id: item.id,
      label: item.alt_text || "OOGO archive image",
      image: item.image_url,
      category: "campaign",
      position: "center"
    }));

  return published.length > 0 ? published : fallback;
}

export async function getPublicArchiveItems(collectionKey: ArchiveCollectionKey = "oogo"): Promise<ArchiveItem[]> {
  if (!hasSupabaseEnv()) return [];

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("archive_items")
      .select(archiveSelect)
      .eq("collection_key", collectionKey)
      .eq("published", true)
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });

    return error ? [] : ((data ?? []) as ArchiveItem[]);
  } catch {
    return [];
  }
}

export async function getAdminArchiveItems(collectionKey: ArchiveCollectionKey = "oogo"): Promise<ArchiveItem[]> {
  return (await getAdminArchiveState(collectionKey)).items;
}

export async function getAdminArchiveState(collectionKey: ArchiveCollectionKey = "oogo"): Promise<{
  items: ArchiveItem[];
  ready: boolean;
  message: string;
}> {
  if (!hasSupabaseEnv()) {
    return { items: [], ready: false, message: "Supabase 연결 정보가 필요합니다." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("archive_items")
      .select(archiveSelect)
      .eq("collection_key", collectionKey)
      .order("created_at", { ascending: false });

    if (error) {
      const missingTable = error.code === "PGRST205" || error.message.includes("archive_items");
      return {
        items: [],
        ready: false,
        message: missingTable
          ? "Archive DB 마이그레이션을 먼저 적용해야 합니다."
          : `Archive 데이터를 불러오지 못했습니다: ${error.message}`
      };
    }

    return {
      items: sortArchiveItemsNewest((data ?? []) as ArchiveItem[], collectionKey),
      ready: true,
      message: ""
    };
  } catch {
    return { items: [], ready: false, message: "Archive DB 연결을 확인해 주세요." };
  }
}
