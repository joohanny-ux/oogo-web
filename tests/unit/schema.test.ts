import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(join(process.cwd(), "supabase/migrations/0002_manageable_content.sql"), "utf8");
const imageRoleMigration = readFileSync(
  join(process.cwd(), "supabase/migrations/0003_unique_product_image_roles.sql"),
  "utf8"
);
const storageBucketMigration = readFileSync(
  join(process.cwd(), "supabase/migrations/0006_create_oogo_assets_bucket.sql"),
  "utf8"
);
const localizedProductSpecsMigration = readFileSync(
  join(process.cwd(), "supabase/migrations/0007_localized_product_specs.sql"),
  "utf8"
);
const productReferenceColorMigration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260710114036_add_product_reference_color.sql"),
  "utf8"
);
const localizedFrameSizeMigration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260711072540_localize_product_frame_size.sql"),
  "utf8"
);
const ss26CatalogMigration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260711091617_sync_ss26_catalog_content.sql"),
  "utf8"
);
const productUpdatedAtMigration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260711120411_touch_product_updated_at.sql"),
  "utf8"
);
const archiveItemsMigration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260712090000_create_archive_items.sql"),
  "utf8"
);
const archiveCollectionsMigrationPath = join(
  process.cwd(),
  "supabase/migrations/20260713103000_split_archive_collections.sql"
);
const archiveCollectionsMigration = existsSync(archiveCollectionsMigrationPath)
  ? readFileSync(archiveCollectionsMigrationPath, "utf8")
  : "";
const resetScript = readFileSync(join(process.cwd(), "supabase/reset-oogo-content.sql"), "utf8");
const verifyScript = readFileSync(join(process.cwd(), "supabase/verify-oogo-setup.sql"), "utf8");

describe("manageable content schema", () => {
  it("stores public footer social links", () => {
    expect(migration).toContain("add column if not exists facebook text");
    expect(migration).toContain("add column if not exists tiktok text");
  });

  it("tracks product image roles used by the public catalog", () => {
    expect(migration).toContain("add column if not exists role text");
    expect(migration).toContain("'angle'");
    expect(migration).toContain("'wearing'");
    expect(migration).toContain("'front'");
    expect(migration).toContain("'side'");
  });

  it("adds special edition tables for future collaborations", () => {
    expect(migration).toContain("create table if not exists public.special_editions");
    expect(migration).toContain("create table if not exists public.special_edition_translations");
    expect(migration).toContain("create table if not exists public.special_edition_products");
  });

  it("keeps one managed image per product role", () => {
    expect(imageRoleMigration).toContain("product_images_product_id_role_unique");
    expect(imageRoleMigration).toContain("on public.product_images(product_id, role)");
  });

  it("creates the public oogo assets storage bucket", () => {
    expect(storageBucketMigration).toContain("insert into storage.buckets");
    expect(storageBucketMigration).toContain("'oogo-assets'");
    expect(storageBucketMigration).toContain("'image/webp'");
    expect(storageBucketMigration).toContain("'video/webm'");
    expect(storageBucketMigration).toContain("on conflict (id) do update");
  });

  it("adds localized product specifications and backfills existing translations", () => {
    expect(localizedProductSpecsMigration).toContain("add column if not exists size_note text");
    expect(localizedProductSpecsMigration).toContain("add column if not exists frame_material text");
    expect(localizedProductSpecsMigration).toContain("add column if not exists lens_material text");
    expect(localizedProductSpecsMigration).toContain("add column if not exists lens_features text[]");
    expect(localizedProductSpecsMigration).toContain("update public.product_translations as translations");
    expect(localizedProductSpecsMigration).toContain("from public.products as products");
  });

  it("adds a shared reference color and preserves the existing Korean color value", () => {
    expect(productReferenceColorMigration).toContain("add column if not exists reference_color_name text");
    expect(productReferenceColorMigration).toContain("from public.product_translations as translations");
    expect(productReferenceColorMigration).toContain("translations.locale = 'ko'");
  });

  it("localizes frame size and backfills size and color values", () => {
    expect(localizedFrameSizeMigration).toContain("add column if not exists frame_size text");
    expect(localizedFrameSizeMigration).toContain("frame_size = coalesce");
    expect(localizedFrameSizeMigration).toContain("colorway = coalesce");
    expect(localizedFrameSizeMigration).toContain("from public.products as products");
  });

  it("syncs all SS26 catalog products without publishing new records", () => {
    const modelCodes = [...ss26CatalogMigration.matchAll(/'OG\d{5}C\d'/g)].map(([code]) => code);

    expect(new Set(modelCodes).size).toBe(24);
    expect(ss26CatalogMigration).toContain("New products start as drafts");
    expect(ss26CatalogMigration).toContain("false,\n  false\nfrom ss26_catalog_import");
    expect(ss26CatalogMigration).toContain("and not exists (");
    expect(ss26CatalogMigration).toContain("on conflict (product_id, locale) do update");
  });

  it("automatically updates product modification timestamps", () => {
    expect(productUpdatedAtMigration).toContain("before update on public.products");
    expect(productUpdatedAtMigration).toContain("new.updated_at = now()");
    expect(productUpdatedAtMigration).toContain("execute function public.touch_updated_at()");
  });

  it("creates an expandable Archive collection with legacy import and RLS", () => {
    expect(archiveItemsMigration).toContain("create table if not exists public.archive_items");
    expect(archiveItemsMigration).toContain("asset_id uuid references public.assets(id)");
    expect(archiveItemsMigration).toContain("published_at timestamptz");
    expect(archiveItemsMigration).toContain("archive_items_public_newest_idx");
    expect(archiveItemsMigration).toContain("alter table public.archive_items enable row level security");
    expect(archiveItemsMigration).toContain("public can read published archive items");
    expect(archiveItemsMigration).toContain("admins and editors can manage archive items");
    expect(archiveItemsMigration).toContain("image12Url");
    expect(archiveItemsMigration).toContain("landing_blocks");
    expect(archiveItemsMigration).toContain("from public.assets");
    expect(archiveItemsMigration).toContain("archive/%");
  });

  it("separates OOGO and Youngbin archive collections without changing existing ownership", () => {
    expect(archiveCollectionsMigration).toContain("add column if not exists collection_key");
    expect(archiveCollectionsMigration).toContain("default 'oogo'");
    expect(archiveCollectionsMigration).toContain("'youngbin-edition'");
    expect(archiveCollectionsMigration).toContain("archive_items_collection_public_newest_idx");
  });

  it("resets only OOGO-owned public content and storage assets", () => {
    expect(resetScript).toContain("drop table if exists public.products cascade");
    expect(resetScript).toContain("drop table if exists public.landing_blocks cascade");
    expect(resetScript).toContain("drop table if exists public.profiles cascade");
    expect(resetScript).toContain("drop table if exists public.archive_items cascade");
    expect(resetScript).toContain("delete from storage.objects where bucket_id = 'oogo-assets'");
    expect(resetScript).not.toContain("drop schema auth");
    expect(resetScript).not.toContain("delete from auth.users");
  });

  it("verifies Supabase setup without mutating data", () => {
    expect(verifyScript).toContain("information_schema.tables");
    expect(verifyScript).toContain("bucket:oogo-assets");
    expect(verifyScript).toContain("admin_profiles");
    expect(verifyScript).toContain("published_landing_blocks");
    expect(verifyScript).toContain("archive_items");
    expect(verifyScript).not.toContain("insert into");
    expect(verifyScript).not.toContain("drop table");
    expect(verifyScript).not.toContain("delete from");
  });
});
