import { LandingEditor } from "@/components/admin/LandingEditor";
import { getLandingBlocksForPage, hasSupabaseEnv, landingPageOptions } from "@/lib/admin-content";
import { listAssets } from "@/lib/assets";
import { normalizeLocale } from "@/lib/i18n";
import { publishLandingBlockAction, saveLandingBlockAction } from "@/app/admin/landing/actions";

export const dynamic = "force-dynamic";

export default async function AdminLandingPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; locale?: string }>;
}) {
  const params = await searchParams;
  const pageKey = landingPageOptions.some((option) => option.key === params.page) ? params.page! : "home";
  const locale = normalizeLocale(params.locale);
  const [blocks, assets] = await Promise.all([getLandingBlocksForPage(pageKey, locale), listAssets()]);

  return (
    <main className="admin-page">
      <h1>Landing Page</h1>
      <p className="admin-page-note">Pick a page, edit blocks, save drafts, and publish visible content.</p>
      <LandingEditor
        pageKey={pageKey}
        locale={locale}
        blocks={blocks}
        assets={assets}
        saveAction={saveLandingBlockAction}
        publishAction={publishLandingBlockAction}
        supabaseConfigured={hasSupabaseEnv()}
      />
    </main>
  );
}
