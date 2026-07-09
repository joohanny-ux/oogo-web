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
          문의 유형
          <select name="type" defaultValue="buyer" required>
            <option value="buyer">Buyer</option>
            <option value="retail">Retail</option>
            <option value="collaboration">Collaboration</option>
            <option value="press">Press</option>
          </select>
        </label>
        <label>
          이름
          <input name="name" minLength={2} required autoComplete="name" />
        </label>
        <label>
          이메일
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          회사명
          <input name="company" autoComplete="organization" />
        </label>
        <label>
          국가
          <input name="country" autoComplete="country-name" />
        </label>
        <label>
          연락처 또는 웹사이트
          <input name="phone" autoComplete="tel" />
        </label>
        <label className="wide-field">
          문의 내용
          <textarea name="message" minLength={10} required />
        </label>
        <label className="inquiry-consent wide-field">
          <input name="privacyConsent" type="checkbox" required value="yes" />
          <span>
            개인정보 수집 및 이용에 동의합니다.{" "}
            <a className="inquiry-policy-link" href="/privacy-policy">
              개인정보 처리방침
            </a>
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
