import { LandingEditor } from "@/components/admin/LandingEditor";
import { getLandingBlocksForPage, hasSupabaseEnv, landingPageOptions } from "@/lib/admin-content";
import { listAssets } from "@/lib/assets";
import { normalizeLocale } from "@/lib/i18n";
import {
  publishLandingBlockAction,
  saveAndPublishLandingBlockAction,
  saveLandingBlockAction
} from "@/app/admin/landing/actions";

export const dynamic = "force-dynamic";

export default async function AdminLandingPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; locale?: string; status?: string; block?: string }>;
}) {
  const params = await searchParams;
  const pageKey = landingPageOptions.some((option) => option.key === params.page) ? params.page! : "home";
  const locale = normalizeLocale(params.locale);
  const [blocks, assets] = await Promise.all([getLandingBlocksForPage(pageKey, locale), listAssets()]);
  const statusMessage =
    params.status === "published"
      ? "저장하고 공개 페이지에 게시했습니다."
      : params.status === "saved"
        ? "초안을 저장했습니다. 공개하려면 저장 후 게시를 눌러 주세요."
        : null;

  return (
    <main className="admin-page">
      <h1>Landing Page</h1>
      <p className="admin-page-note">페이지와 언어를 선택한 뒤 콘텐츠를 초안 저장하고 공개합니다.</p>
      {statusMessage ? <p className="admin-config-warning">{statusMessage}</p> : null}
      <LandingEditor
        pageKey={pageKey}
        locale={locale}
        blocks={blocks}
        assets={assets}
        openBlockKey={params.block}
        saveAction={saveLandingBlockAction}
        publishAction={publishLandingBlockAction}
        savePublishAction={saveAndPublishLandingBlockAction}
        supabaseConfigured={hasSupabaseEnv()}
      />
    </main>
  );
}
