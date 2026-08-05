"use client";

import React, { type FormEvent, type ReactNode, useState } from "react";
import { buildLandingSubmitFormData } from "@/lib/landing-upload-client";

type LandingBlockFormProps = {
  pageKey: string;
  blockKey: string;
  canPersist: boolean;
  saveAction: (formData: FormData) => void | Promise<void>;
  savePublishAction: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
};

export function LandingBlockForm({
  pageKey,
  blockKey,
  canPersist,
  saveAction,
  savePublishAction,
  children
}: LandingBlockFormProps) {
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canPersist || pending) {
      return;
    }

    const form = event.currentTarget;
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const shouldPublish = submitter?.dataset.intent === "publish";

    setPending(true);
    setStatus("미디어 업로드 중...");

    try {
      const formData = await buildLandingSubmitFormData(form, pageKey, blockKey);
      setStatus(shouldPublish ? "저장 및 게시 중..." : "초안 저장 중...");
      const action = shouldPublish ? savePublishAction : saveAction;
      await action(formData);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "랜딩 콘텐츠를 저장하지 못했습니다.");
      setPending(false);
    }
  }

  return (
    <>
      <form className="admin-form" onSubmit={handleSubmit} data-landing-block-form>
        {children}
        <div className="landing-form-actions">
          <button type="submit" data-intent="draft" disabled={!canPersist || pending}>
            {pending ? "저장 중..." : canPersist ? "초안 저장" : "Supabase 연결 후 저장 가능"}
          </button>
          <button
            className="admin-secondary-button"
            type="submit"
            data-intent="publish"
            disabled={!canPersist || pending}
          >
            {pending ? "저장 중..." : canPersist ? "저장 후 게시" : "Supabase 연결 필요"}
          </button>
        </div>
      </form>
      {status ? (
        <p className="archive-admin-upload-status" role="status">
          {status}
        </p>
      ) : null}
    </>
  );
}
