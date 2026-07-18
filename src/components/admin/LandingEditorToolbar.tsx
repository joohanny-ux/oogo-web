"use client";

// 랜딩 페이지 선택과 현재 페이지 전체 저장·게시를 제어하는 상단 도구 모음
import React, { useState, useTransition } from "react";
import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n";

type EditorPageOption = {
  key: string;
  label: string;
  routeLabel: string;
};

type LandingEditorToolbarProps = {
  pages: EditorPageOption[];
  pageKey: string;
  locale: Locale;
  publicHref: string;
  canPersist: boolean;
  savePublishAction: (formData: FormData) => void | Promise<void>;
};

export function LandingEditorToolbar({
  pages,
  pageKey,
  locale,
  publicHref,
  canPersist,
  savePublishAction
}: LandingEditorToolbarProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function changePage(nextPageKey: string) {
    window.location.assign(`/admin/landing?page=${encodeURIComponent(nextPageKey)}&locale=${locale}`);
  }

  function saveAndPublishPage() {
    const forms = Array.from(document.querySelectorAll<HTMLFormElement>("[data-landing-block-form]"));

    startTransition(async () => {
      setMessage(`0 / ${forms.length} 섹션 처리 중`);

      try {
        for (const [index, form] of forms.entries()) {
          const formData = new FormData(form);
          formData.set("_batch", "1");
          await savePublishAction(formData);
          setMessage(`${index + 1} / ${forms.length} 섹션 처리 중`);
        }
        setMessage("현재 페이지를 저장하고 게시했습니다.");
        window.location.assign(
          `/admin/landing?page=${encodeURIComponent(pageKey)}&locale=${locale}&status=published`
        );
      } catch {
        setMessage("저장 중 오류가 발생했습니다. 열린 섹션에서 다시 시도해 주세요.");
      }
    });
  }

  return (
    <div className="site-editor-toolbar">
      <div className="site-editor-selection">
        <label>
          <span>페이지</span>
          <select value={pageKey} onChange={(event) => changePage(event.target.value)} aria-label="편집할 랜딩 페이지">
            {pages.map((page) => (
              <option key={page.key} value={page.key}>
                {page.label} · {page.routeLabel}
              </option>
            ))}
          </select>
        </label>
        <div className="admin-locale-tabs" aria-label="편집 언어">
          {LOCALES.map((item) => (
            <a key={item} className={item === locale ? "active" : undefined} href={`/admin/landing?page=${pageKey}&locale=${item}`}>
              {LOCALE_LABELS[item]}
            </a>
          ))}
        </div>
        <a className="landing-open-public" href={publicHref} target="_blank" rel="noreferrer">
          공개 페이지 보기
        </a>
      </div>
      <div className="site-editor-publish">
        <span aria-live="polite">{message}</span>
        <button type="button" onClick={saveAndPublishPage} disabled={!canPersist || isPending}>
          {isPending ? "저장 중..." : canPersist ? "저장 후 전체 게시" : "Supabase 연결 필요"}
        </button>
      </div>
    </div>
  );
}
