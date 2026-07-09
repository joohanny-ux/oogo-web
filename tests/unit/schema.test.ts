import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(join(process.cwd(), "supabase/migrations/0002_manageable_content.sql"), "utf8");
const imageRoleMigration = readFileSync(
  join(process.cwd(), "supabase/migrations/0003_unique_product_image_roles.sql"),
  "utf8"
);

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
});
