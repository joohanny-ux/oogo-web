import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { initialProductSaveState } from "@/lib/admin-product-save";

describe("product save error handling", () => {
  it("keeps save state outside the use server module", () => {
    expect(initialProductSaveState).toEqual({ ok: false, message: "" });

    const actions = fs.readFileSync(path.join(process.cwd(), "src/app/admin/products/actions.ts"), "utf8");
    const form = fs.readFileSync(path.join(process.cwd(), "src/components/admin/ProductForm.tsx"), "utf8");

    expect(actions).toContain('"use server"');
    expect(actions).not.toContain("throw new Error");
    expect(actions).not.toContain("redirect(");
    expect(actions).not.toContain("useActionState");
    expect(form).toContain("useActionState");
    expect(form).toContain("Save failed");
    expect(form).toContain("window.location.assign");
  });
});
