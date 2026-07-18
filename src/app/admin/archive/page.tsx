import { ArchiveGalleryEditor } from "@/components/admin/ArchiveGalleryEditor";
import { getAdminArchiveState } from "@/lib/archive-content";
import { parseArchiveCollection } from "@/lib/archive-collections";
import {
  deleteArchiveItemAction,
  replaceArchiveItemAction,
  saveAndPublishArchiveAction,
} from "@/app/admin/archive/actions";

export const dynamic = "force-dynamic";

export default async function AdminArchivePage({
  searchParams
}: {
  searchParams: Promise<{ collection?: string | string[] }>;
}) {
  const collectionKey = parseArchiveCollection((await searchParams).collection);
  const state = await getAdminArchiveState(collectionKey);

  return (
    <main className="admin-page admin-archive-page">
      <ArchiveGalleryEditor
        items={state.items}
        collectionKey={collectionKey}
        publishAction={saveAndPublishArchiveAction}
        replaceAction={replaceArchiveItemAction}
        deleteAction={deleteArchiveItemAction}
        supabaseConfigured={state.ready}
        setupMessage={state.message}
      />
    </main>
  );
}
