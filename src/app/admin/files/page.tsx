import { listAssets } from "@/lib/assets";
import { AssetLibrary } from "@/components/admin/AssetLibrary";
import { deleteUnusedAssetAction } from "@/app/admin/files/actions";
import { hasSupabaseEnv } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

export default async function AdminFilesPage() {
  const assets = await listAssets();
  const supabaseConfigured = hasSupabaseEnv();
  const unusedCount = assets.filter((asset) => asset.usage.length === 0).length;

  return (
    <main className="admin-page">
      <h1>Files</h1>
      <p className="admin-page-note">
        Storage에 올라간 파일 목록입니다. 상품·Archive·Landing 업로드는 각 메뉴에서 하고, 이 페이지는{" "}
        <strong>사용하지 않는 파일 정리</strong>용입니다. Unused 파일은 Supabase Storage 용량만 차지하며, 삭제해도
        공개 페이지에 연결된 파일은 Used로 표시됩니다.
      </p>
      {!supabaseConfigured ? (
        <div className="admin-config-warning" role="status">
          <strong>Supabase connection required</strong>
          <p>파일 삭제는 Supabase Storage 연결 후 사용할 수 있습니다.</p>
        </div>
      ) : null}
      {supabaseConfigured && unusedCount > 0 ? (
        <div className="admin-config-warning" role="status">
          <strong>Unused {unusedCount}개</strong>
          <p>
            재업로드 후 남은 예전 PNG/JPG가 Unused로 남아 있을 수 있습니다. 경로가 <code>products/</code>,{" "}
            <code>archive/</code>이고 Unused인 파일은 Storage 정리 후보입니다. Landing Used 표시는 이제 랜딩 콘텐츠
            URL과 연결됩니다.
          </p>
        </div>
      ) : null}
      <AssetLibrary assets={assets} deleteAction={deleteUnusedAssetAction} />
    </main>
  );
}
