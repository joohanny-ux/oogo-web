"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function deleteUnusedAssetAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Asset id is required.");
  }

  const supabase = await createSupabaseServerClient();

  const { count: productImageCount, error: productImageError } = await supabase
    .from("product_images")
    .select("asset_id", { count: "exact", head: true })
    .eq("asset_id", id);

  if (productImageError) {
    throw new Error(productImageError.message);
  }

  const { count: specialEditionCount, error: specialEditionError } = await supabase
    .from("special_editions")
    .select("hero_asset_id", { count: "exact", head: true })
    .eq("hero_asset_id", id);

  if (specialEditionError) {
    throw new Error(specialEditionError.message);
  }

  if ((productImageCount ?? 0) + (specialEditionCount ?? 0) > 0) {
    throw new Error("This asset is currently used and cannot be deleted.");
  }

  const { data: asset, error: assetError } = await supabase
    .from("assets")
    .select("id, bucket, path")
    .eq("id", id)
    .single();

  if (assetError) {
    throw new Error(assetError.message);
  }

  if (asset.bucket === "oogo-assets") {
    const { error: storageError } = await supabase.storage.from("oogo-assets").remove([asset.path]);

    if (storageError) {
      throw new Error(storageError.message);
    }
  }

  const { error: deleteError } = await supabase.from("assets").delete().eq("id", id);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  revalidatePath("/admin/files");
}
