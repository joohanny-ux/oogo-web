import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export { assetKindOptions, normalizeAssetKind, type AssetKind } from "@/lib/asset-kinds";
import type { AssetKind } from "@/lib/asset-kinds";

type AssetRow = {
  id: string;
  bucket: string;
  path: string;
  public_url: string;
  alt: string | null;
  kind: string;
  created_at: string;
};

type ProductImageUsageRow = {
  asset_id: string;
  role: string | null;
  products:
    | {
        model_code: string | null;
        product_translations?: Array<{ locale: string | null; name: string | null }> | null;
      }
    | Array<{
        model_code: string | null;
        product_translations?: Array<{ locale: string | null; name: string | null }> | null;
      }>
    | null;
};

type SpecialEditionUsageRow = {
  hero_asset_id: string | null;
  slug: string | null;
  collaborator: string | null;
};

type ArchiveUsageRow = {
  asset_id: string | null;
  published: boolean;
};

function firstItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function listAssets() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("assets")
    .select("id, bucket, path, public_url, alt, kind, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const assets = (data ?? []) as AssetRow[];
  const assetIds = assets.map((asset) => asset.id);

  if (assetIds.length === 0) {
    return [];
  }

  const [
    { data: productImageUsage, error: productImageError },
    { data: specialEditionUsage, error: specialEditionError },
    { data: archiveUsage, error: archiveUsageError }
  ] = await Promise.all([
      supabase
        .from("product_images")
        .select("asset_id, role, products(model_code, product_translations(locale, name))")
        .in("asset_id", assetIds),
      supabase.from("special_editions").select("hero_asset_id, slug, collaborator").in("hero_asset_id", assetIds),
      supabase.from("archive_items").select("asset_id, published").in("asset_id", assetIds)
  ]);

  if (productImageError) {
    throw new Error(productImageError.message);
  }

  if (specialEditionError) {
    throw new Error(specialEditionError.message);
  }

  if (archiveUsageError) {
    throw new Error(archiveUsageError.message);
  }

  const usageByAsset = new Map<string, Array<{ label: string; detail: string }>>();

  for (const usage of (productImageUsage ?? []) as ProductImageUsageRow[]) {
    const product = firstItem(usage.products);
    const koreanName = product?.product_translations?.find((translation) => translation.locale === "ko")?.name;
    const modelCode = product?.model_code ?? "Product";
    const role = usage.role ? usage.role.charAt(0).toUpperCase() + usage.role.slice(1) : "Image";
    const label = koreanName ? `${modelCode} · ${koreanName}` : modelCode;
    const existing = usageByAsset.get(usage.asset_id) ?? [];
    existing.push({ label, detail: role });
    usageByAsset.set(usage.asset_id, existing);
  }

  for (const usage of (specialEditionUsage ?? []) as SpecialEditionUsageRow[]) {
    if (!usage.hero_asset_id) {
      continue;
    }

    const existing = usageByAsset.get(usage.hero_asset_id) ?? [];
    existing.push({
      label: usage.collaborator ?? usage.slug ?? "Special edition",
      detail: "Special hero"
    });
    usageByAsset.set(usage.hero_asset_id, existing);
  }

  for (const usage of (archiveUsage ?? []) as ArchiveUsageRow[]) {
    if (!usage.asset_id) continue;

    const existing = usageByAsset.get(usage.asset_id) ?? [];
    existing.push({
      label: "Archive gallery",
      detail: usage.published ? "Published" : "Draft"
    });
    usageByAsset.set(usage.asset_id, existing);
  }

  return assets.map((asset) => ({
    ...asset,
    usage: usageByAsset.get(asset.id) ?? []
  }));
}

export async function uploadAsset(file: File, kind: AssetKind, alt: string) {
  const supabase = createSupabaseBrowserClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${kind}/${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from("oogo-assets").upload(path, file);

  if (uploadError) {
    return { ok: false, message: uploadError.message };
  }

  const { data } = supabase.storage.from("oogo-assets").getPublicUrl(path);
  const { error: insertError } = await supabase.from("assets").insert({
    bucket: "oogo-assets",
    path,
    public_url: data.publicUrl,
    kind,
    alt: alt || null
  });

  if (insertError) {
    return { ok: false, message: insertError.message };
  }

  return { ok: true, message: "Asset uploaded." };
}
