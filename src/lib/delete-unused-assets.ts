import { collectLandingContentUrls } from "@/lib/landing-asset-urls";
import type { SupabaseClient } from "@supabase/supabase-js";

type AssetRef = {
  id: string;
  bucket: string;
  path: string;
  public_url: string;
};

export async function getLandingReferencedUrls(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("landing_blocks")
    .select("draft_content, published_content");

  if (error) {
    throw new Error(error.message);
  }

  const urls = new Set<string>();
  for (const block of data ?? []) {
    for (const url of collectLandingContentUrls(block.draft_content as Record<string, unknown> | null)) {
      urls.add(url);
    }
    for (const url of collectLandingContentUrls(block.published_content as Record<string, unknown> | null)) {
      urls.add(url);
    }
  }
  return urls;
}

export async function getReferencedAssetIds(supabase: SupabaseClient) {
  const [
    { data: productImages, error: productError },
    { data: specialEditions, error: specialError },
    { data: archiveItems, error: archiveError }
  ] = await Promise.all([
    supabase.from("product_images").select("asset_id"),
    supabase.from("special_editions").select("hero_asset_id"),
    supabase.from("archive_items").select("asset_id")
  ]);

  if (productError) throw new Error(productError.message);
  if (specialError) throw new Error(specialError.message);
  if (archiveError) throw new Error(archiveError.message);

  const ids = new Set<string>();
  for (const row of productImages ?? []) {
    if (row.asset_id) ids.add(row.asset_id);
  }
  for (const row of specialEditions ?? []) {
    if (row.hero_asset_id) ids.add(row.hero_asset_id);
  }
  for (const row of archiveItems ?? []) {
    if (row.asset_id) ids.add(row.asset_id);
  }
  return ids;
}

export async function assertAssetIsUnused(supabase: SupabaseClient, asset: AssetRef) {
  const [referencedIds, landingUrls] = await Promise.all([
    getReferencedAssetIds(supabase),
    getLandingReferencedUrls(supabase)
  ]);

  if (referencedIds.has(asset.id) || landingUrls.has(asset.public_url)) {
    throw new Error("This asset is currently used and cannot be deleted.");
  }
}

export async function listUnusedAssets(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("assets")
    .select("id, bucket, path, public_url");

  if (error) {
    throw new Error(error.message);
  }

  const [referencedIds, landingUrls] = await Promise.all([
    getReferencedAssetIds(supabase),
    getLandingReferencedUrls(supabase)
  ]);

  return ((data ?? []) as AssetRef[]).filter(
    (asset) => !referencedIds.has(asset.id) && !landingUrls.has(asset.public_url)
  );
}

export async function deleteAssetRecords(supabase: SupabaseClient, assets: AssetRef[]) {
  if (assets.length === 0) {
    return { deleted: 0 };
  }

  const storagePaths = assets.filter((asset) => asset.bucket === "oogo-assets").map((asset) => asset.path);
  const chunkSize = 50;

  for (let index = 0; index < storagePaths.length; index += chunkSize) {
    const chunk = storagePaths.slice(index, index + chunkSize);
    const { error: storageError } = await supabase.storage.from("oogo-assets").remove(chunk);
    if (storageError) {
      throw new Error(storageError.message);
    }
  }

  for (let index = 0; index < assets.length; index += chunkSize) {
    const chunk = assets.slice(index, index + chunkSize);
    const { error: deleteError } = await supabase
      .from("assets")
      .delete()
      .in(
        "id",
        chunk.map((asset) => asset.id)
      );
    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  return { deleted: assets.length };
}
