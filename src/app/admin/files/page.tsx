import { assetKindOptions, listAssets } from "@/lib/assets";
import { AssetLibrary } from "@/components/admin/AssetLibrary";
import { deleteUnusedAssetAction } from "@/app/admin/files/actions";
import { hasSupabaseEnv } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function AdminFilesPage() {
  const assets = await listAssets();
  const supabaseConfigured = hasSupabaseEnv();

  return (
    <main className="admin-page">
      <h1>Files</h1>
      <p className="admin-page-note">브랜드, 상품, 프로젝트에 사용할 이미지와 파일을 관리합니다.</p>
      {!supabaseConfigured ? (
        <div className="admin-config-warning" role="status">
          <strong>Supabase connection required</strong>
          <p>파일 업로드와 삭제는 Supabase Storage 연결 후 사용할 수 있습니다.</p>
        </div>
      ) : null}
      <form className="admin-form">
        <div className="admin-form-grid">
          <label>
            File
            <input name="file" type="file" disabled={!supabaseConfigured} />
          </label>
          <label>
            Kind
            <select name="kind" defaultValue="brand" disabled={!supabaseConfigured}>
              {assetKindOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-wide-field">
            Alt text
            <input name="alt" disabled={!supabaseConfigured} />
          </label>
        </div>
        <button type="button" disabled={!supabaseConfigured}>
          {supabaseConfigured ? "Upload file" : "Upload requires Supabase connection"}
        </button>
      </form>
      <AssetLibrary assets={assets} deleteAction={deleteUnusedAssetAction} />
    </main>
  );
}
