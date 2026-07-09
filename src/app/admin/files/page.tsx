import { assetKindOptions, listAssets } from "@/lib/assets";
import { AssetLibrary } from "@/components/admin/AssetLibrary";
import { deleteUnusedAssetAction } from "@/app/admin/files/actions";

export const dynamic = "force-dynamic";

export default async function AdminFilesPage() {
  const assets = await listAssets();

  return (
    <main className="admin-page">
      <h1>Files</h1>
      <p className="admin-page-note">Upload and manage brand, product, special edition, and general assets.</p>
      <form className="admin-form">
        <div className="admin-form-grid">
          <label>
            File
            <input name="file" type="file" />
          </label>
          <label>
            Kind
            <select name="kind" defaultValue="brand">
              {assetKindOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-wide-field">
            Alt text
            <input name="alt" />
          </label>
        </div>
        <button type="button">Upload requires Supabase connection</button>
      </form>
      <AssetLibrary assets={assets} deleteAction={deleteUnusedAssetAction} />
    </main>
  );
}
