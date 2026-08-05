"use server";

import { revalidatePath } from "next/cache";
import { hasSupabaseEnv } from "@/lib/admin-content";
import {
  assertAssetIsUnused,
  deleteAssetRecords,
  listUnusedAssets
} from "@/lib/delete-unused-assets";
import type { BulkDeleteUnusedState } from "@/lib/files-bulk-delete";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function deleteUnusedAssetAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Asset id is required.");
  }

  if (!hasSupabaseEnv()) {
    throw new Error("Supabase environment variables are not configured. Connect Supabase before deleting files.");
  }

  const supabase = await createSupabaseServerClient();
  const { data: asset, error: assetError } = await supabase
    .from("assets")
    .select("id, bucket, path, public_url")
    .eq("id", id)
    .single();

  if (assetError) {
    throw new Error(assetError.message);
  }

  await assertAssetIsUnused(supabase, asset);
  await deleteAssetRecords(supabase, [asset]);
  revalidatePath("/admin/files");
}

export async function deleteAllUnusedAssetsAction(
  _prev: BulkDeleteUnusedState,
  formData: FormData
): Promise<BulkDeleteUnusedState> {
  if (String(formData.get("confirm") ?? "") !== "delete-unused") {
    return { ok: false, message: "삭제 확인이 필요합니다." };
  }

  if (!hasSupabaseEnv()) {
    return {
      ok: false,
      message: "Supabase environment variables are not configured. Connect Supabase before deleting files."
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const unused = await listUnusedAssets(supabase);
    const result = await deleteAssetRecords(supabase, unused);
    revalidatePath("/admin/files");
    return {
      ok: true,
      deleted: result.deleted,
      message:
        result.deleted === 0
          ? "삭제할 Unused 파일이 없습니다."
          : `Unused ${result.deleted}개를 삭제했습니다.`
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unused 파일을 삭제하지 못했습니다."
    };
  }
}
