import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const middlewarePath = join(process.cwd(), "src/middleware.ts");
const middlewareSource = existsSync(middlewarePath) ? readFileSync(middlewarePath, "utf8") : "";
const archiveActionsSource = readFileSync(join(process.cwd(), "src/app/admin/archive/actions.ts"), "utf8");

describe("admin authentication", () => {
  it("redirects expired admin sessions while leaving the login page public", () => {
    expect(middlewareSource).toContain('pathname.startsWith("/admin")');
    expect(middlewareSource).toContain('pathname !== "/admin/login"');
    expect(middlewareSource).toContain("supabase.auth.getUser()");
    expect(middlewareSource).toContain('loginUrl.searchParams.set("reason", "session-expired")');
  });

  it("checks the session before uploading Archive files", () => {
    expect(archiveActionsSource).toContain("requireAdminSession");
    expect(archiveActionsSource.indexOf("requireAdminSession")).toBeLessThan(
      archiveActionsSource.indexOf('.storage.from("oogo-assets")')
    );
  });
});
