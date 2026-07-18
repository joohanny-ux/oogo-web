"use client";

import React, { type ChangeEvent, type FormEvent, useState } from "react";
import { archiveCollectionLabel, type ArchiveCollectionKey } from "@/lib/archive-collections";
import type { ArchiveItem } from "@/lib/archive-content";
import {
  buildArchiveUploadRequest,
  formatArchiveFileSize,
  validateArchiveImage
} from "@/lib/archive-upload";

type ArchiveAction = (formData: FormData) => void | Promise<void>;

type ArchiveGalleryEditorProps = {
  items: ArchiveItem[];
  collectionKey: ArchiveCollectionKey;
  publishAction: ArchiveAction;
  replaceAction: ArchiveAction;
  deleteAction: ArchiveAction;
  supabaseConfigured?: boolean;
  setupMessage?: string;
};

export function ArchiveGalleryEditor({
  items,
  collectionKey,
  publishAction,
  replaceAction,
  deleteAction,
  supabaseConfigured = true,
  setupMessage = "Supabase 연결 후 이미지 저장과 게시가 가능합니다."
}: ArchiveGalleryEditorProps) {
  const draftCount = items.filter((item) => !item.published).length;
  const publishedCount = items.length - draftCount;
  const publicHref = collectionKey === "youngbin-edition" ? "/archive/youngbin-edition" : "/archive";
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectionStatus, setSelectionStatus] = useState("");
  const [hasInvalidSelection, setHasInvalidSelection] = useState(false);

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);

    if (files.length === 0) {
      setSelectionStatus("");
      setHasInvalidSelection(false);
      return;
    }

    const invalidFile = files.find((file) => !validateArchiveImage(file).ok);
    if (invalidFile) {
      const validation = validateArchiveImage(invalidFile);
      setSelectionStatus(
        `${invalidFile.name} (${formatArchiveFileSize(invalidFile.size)}): ${validation.ok ? "" : validation.message}`
      );
      setHasInvalidSelection(true);
      return;
    }

    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    setSelectionStatus(`${files.length}개 선택 · 총 ${formatArchiveFileSize(totalBytes)} · 파일당 최대 8MB`);
    setHasInvalidSelection(false);
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploading) return;

    const form = event.currentTarget;
    const input = form.elements.namedItem("archiveFiles") as HTMLInputElement | null;
    const files = Array.from(input?.files ?? []);
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const shouldPublish = submitter?.dataset.intent === "publish";
    const invalidFile = files.find((file) => !validateArchiveImage(file).ok);

    if (files.length === 0 && !shouldPublish) {
      setUploadStatus("저장할 이미지를 선택해 주세요.");
      return;
    }
    if (invalidFile) {
      const validation = validateArchiveImage(invalidFile);
      setUploadStatus(`${invalidFile.name}: ${validation.ok ? "" : validation.message}`);
      return;
    }

    setUploading(true);
    setUploadStatus("");

    try {
      for (const [index, file] of files.entries()) {
        setUploadStatus(`저장 중 ${index + 1}/${files.length}`);
        const request = buildArchiveUploadRequest(file, collectionKey);
        const response = await fetch(request.url, request.init);
        if (!response.ok) {
          const result = await response.json().catch(() => null) as { message?: string } | null;
          throw new Error(result?.message ?? `${file.name} 파일을 저장하지 못했습니다.`);
        }
      }

      if (shouldPublish) {
        const publishForm = new FormData();
        publishForm.set("collectionKey", collectionKey);
        setUploadStatus("게시 중");
        await publishAction(publishForm);
      }

      setUploadStatus(shouldPublish ? "저장 및 게시가 완료됐습니다." : "초안 저장이 완료됐습니다.");
      window.location.reload();
    } catch (error) {
      setUploadStatus(error instanceof Error ? error.message : "이미지를 저장하지 못했습니다.");
      setUploading(false);
    }
  }

  return (
    <div className="archive-admin-editor">
      <nav className="archive-admin-collections" aria-label="Archive 컬렉션">
        <a className={collectionKey === "oogo" ? "is-active" : ""} href="/admin/archive?collection=oogo">
          OOGO Archive
        </a>
        <a
          className={collectionKey === "youngbin-edition" ? "is-active" : ""}
          href="/admin/archive?collection=youngbin-edition"
        >
          Youngbin Edition
        </a>
      </nav>
      <form className="archive-admin-upload-form" onSubmit={handleUpload}>
        <input type="hidden" name="collectionKey" value={collectionKey} />
        <header className="archive-admin-heading">
          <div className="archive-admin-title">
            <span>Archive Gallery</span>
            <h1>{archiveCollectionLabel(collectionKey)}</h1>
            <p>이미지를 계속 추가할 수 있으며, 공개 페이지에는 최신 게시 이미지부터 표시됩니다.</p>
          </div>

          <div className="archive-admin-toolbar">
            <div className="archive-admin-counts" aria-label="Archive 상태">
              <span>전체 {items.length}</span>
              <span>초안 {draftCount}</span>
              <span>공개 {publishedCount}</span>
            </div>
            <label className="archive-admin-file-picker">
              <span>이미지 추가</span>
              <input
                type="file"
                name="archiveFiles"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={!supabaseConfigured || uploading}
                onChange={handleFileSelection}
              />
            </label>
            <button type="submit" data-intent="draft" disabled={!supabaseConfigured || uploading || hasInvalidSelection}>초안 저장</button>
            <button type="submit" data-intent="publish" disabled={!supabaseConfigured || uploading || hasInvalidSelection}>게시하기</button>
            <a href={publicHref} target="_blank" rel="noreferrer">공개 페이지 보기</a>
          </div>
        </header>
        {selectionStatus ? (
          <p
            className={`archive-admin-selection-status${hasInvalidSelection ? " is-error" : ""}`}
            aria-live="polite"
          >
            {selectionStatus}
          </p>
        ) : null}
      </form>

      {uploadStatus ? <p className="archive-admin-upload-status" role="status">{uploadStatus}</p> : null}

      {!supabaseConfigured ? (
        <p className="admin-connection-notice">{setupMessage}</p>
      ) : null}

      <p className="archive-admin-help">
        JPG, PNG, WebP · 이미지당 최대 8MB · 여러 파일을 한 번에 선택할 수 있습니다. 선택한 이미지는 한 장씩 순서대로 저장됩니다.
      </p>

      {items.length > 0 ? (
        <section className="archive-admin-grid" aria-label="Archive 이미지 목록">
          {items.map((item, index) => (
            <article className="archive-admin-card" key={item.id} aria-label={`Archive 이미지 ${index + 1}`}>
              <div className="archive-admin-preview" style={{ backgroundImage: `url("${item.image_url}")` }}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small className={item.published ? "is-public" : "is-draft"}>
                  {item.published ? "공개" : "초안"}
                </small>
              </div>
              <div className="archive-admin-card-actions">
                <form action={replaceAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="collectionKey" value={collectionKey} />
                  <label title="이미지 교체">
                    <span>교체</span>
                    <input
                      type="file"
                      name="replacementFile"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={!supabaseConfigured}
                      onChange={(event) => {
                        if (event.currentTarget.files?.length) event.currentTarget.form?.requestSubmit();
                      }}
                    />
                  </label>
                </form>
                <form
                  action={deleteAction}
                  onSubmit={(event) => {
                    if (!window.confirm("이 Archive 이미지를 목록에서 삭제할까요?")) event.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="collectionKey" value={collectionKey} />
                  <button type="submit" disabled={!supabaseConfigured} title="이미지 삭제">삭제</button>
                </form>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="archive-admin-empty">
          <strong>등록된 Archive 이미지가 없습니다.</strong>
          <p>위에서 이미지를 선택한 뒤 초안 저장 또는 게시하기를 눌러 시작하세요.</p>
        </section>
      )}
    </div>
  );
}
