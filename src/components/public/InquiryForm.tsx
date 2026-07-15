"use client";

import Script from "next/script";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { initialInquirySubmitState, submitInquiry } from "@/app/inquiry/actions";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      theme?: "light" | "dark" | "auto";
    }
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

function InquirySubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="inquiry-submit wide-field" disabled={pending} type="submit">
      {pending ? "전송 중..." : "문의 보내기"}
    </button>
  );
}

export function InquiryForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [token, setToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [state, formAction] = useActionState(submitInquiry, initialInquirySubmitState);

  useEffect(() => {
    if (!siteKey || !turnstileReady || !containerRef.current || !window.turnstile) {
      return;
    }

    if (widgetIdRef.current) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "light",
      callback: (nextToken) => setToken(nextToken),
      "expired-callback": () => setToken("")
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [turnstileReady]);

  useEffect(() => {
    if (!state.ok) {
      return;
    }

    formRef.current?.reset();
    setToken("");
  }, [state]);

  return (
    <div className="inquiry-form-shell">
      {siteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setTurnstileReady(true)}
        />
      ) : null}
      <form ref={formRef} className="inquiry-form inquiry-form-card" action={formAction}>
        <label>
          <span className="inquiry-field-label">문의 유형 <span className="field-required">필수</span></span>
          <select name="type" defaultValue="buyer" required>
            <option value="buyer">바이어</option>
            <option value="retail">리테일</option>
            <option value="collaboration">협업</option>
            <option value="press">프레스 및 아카이브</option>
          </select>
        </label>
        <label>
          <span className="inquiry-field-label">이름 <span className="field-required">필수</span></span>
          <input name="name" minLength={2} required autoComplete="name" />
        </label>
        <label>
          <span className="inquiry-field-label">이메일 <span className="field-required">필수</span></span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          <span className="inquiry-field-label">회사명 <span className="field-optional">선택</span></span>
          <input name="company" autoComplete="organization" />
        </label>
        <label>
          <span className="inquiry-field-label">국가 <span className="field-optional">선택</span></span>
          <input name="country" autoComplete="country-name" />
        </label>
        <label>
          <span className="inquiry-field-label">연락처 또는 웹사이트 <span className="field-optional">선택</span></span>
          <input name="phone" autoComplete="tel" />
        </label>
        <label className="wide-field">
          <span className="inquiry-field-label">문의 내용 <span className="field-required">필수</span></span>
          <textarea name="message" minLength={10} required />
        </label>
        <label className="inquiry-consent wide-field">
          <input name="privacyConsent" type="checkbox" required value="yes" />
          <span className="inquiry-consent-copy">
            <span>개인정보 수집 및 이용에 동의합니다. <span className="field-required">필수</span></span>
            <span className="inquiry-consent-detail">
              문의 접수와 답변을 위해 이름, 이메일, 문의 유형 및 내용을 수집하며 문의 처리 완료 후 3년간 보관합니다.
              동의를 거부할 수 있으나 문의 접수가 제한됩니다. {" "}
              <a className="inquiry-policy-link" href="/privacy-policy">개인정보 처리방침</a>
            </span>
          </span>
        </label>
        {siteKey ? <div className="turnstile-widget wide-field" ref={containerRef} /> : null}
        <input name="cf-turnstile-response" readOnly type="hidden" value={token} />
        <InquirySubmitButton />
        {state.message ? (
          <p
            aria-live="polite"
            className={`inquiry-form-status wide-field${state.ok ? " is-success" : " is-error"}`}
            role="status"
          >
            {state.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
