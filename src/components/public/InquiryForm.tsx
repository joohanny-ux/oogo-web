"use client";

import Script from "next/script";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { initialInquirySubmitState, submitInquiry } from "@/app/inquiry/actions";
import type { Locale } from "@/lib/i18n";
import { withLocalePrefix } from "@/lib/locale-path";
import { pickLocaleCopy, publicCopy } from "@/lib/public-copy";

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

const formCopy = {
  type: {
    ko: "문의 유형",
    en: "Inquiry type",
    zh: "咨询类型"
  },
  required: { ko: "필수", en: "Required", zh: "必填" },
  optional: { ko: "선택", en: "Optional", zh: "选填" },
  buyer: { ko: "바이어", en: "Buyer", zh: "采购" },
  retail: { ko: "리테일", en: "Retail", zh: "零售" },
  collaboration: { ko: "협업", en: "Collaboration", zh: "合作" },
  press: { ko: "프레스 및 아카이브", en: "Press & archive", zh: "媒体与档案" },
  company: { ko: "회사명", en: "Company", zh: "公司" },
  phone: { ko: "연락처 또는 웹사이트", en: "Phone or website", zh: "电话或网站" },
  consent: {
    ko: "개인정보 수집 및 이용에 동의합니다.",
    en: "I agree to the collection and use of personal information.",
    zh: "我同意收集并使用个人信息。"
  },
  consentDetail: {
    ko: "문의 접수와 답변을 위해 이름, 이메일, 문의 유형 및 내용을 수집하며 문의 처리 완료 후 3년간 보관합니다. 동의를 거부할 수 있으나 문의 접수가 제한됩니다.",
    en: "We collect your name, email, inquiry type, and message to process and reply. Records are kept for 3 years after completion. You may refuse consent, but submission may be limited.",
    zh: "为受理与回复咨询，我们将收集姓名、邮箱、咨询类型与内容，并在处理完成后保存 3 年。您可以拒绝同意，但可能会限制提交。"
  },
  privacy: { ko: "개인정보 처리방침", en: "Privacy Policy", zh: "隐私政策" }
} as const;

function InquirySubmitButton({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus();

  return (
    <button className="inquiry-submit wide-field" disabled={pending} type="submit">
      {pending
        ? pickLocaleCopy(locale, publicCopy.inquiry.submitting)
        : pickLocaleCopy(locale, publicCopy.inquiry.submit)}
    </button>
  );
}

export function InquiryForm({ locale = "ko" }: { locale?: Locale }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [token, setToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [state, formAction] = useActionState(submitInquiry, initialInquirySubmitState);
  const inquiry = publicCopy.inquiry;

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
          <span className="inquiry-field-label">
            {pickLocaleCopy(locale, formCopy.type)} <span className="field-required">{pickLocaleCopy(locale, formCopy.required)}</span>
          </span>
          <select name="type" defaultValue="buyer" required>
            <option value="buyer">{pickLocaleCopy(locale, formCopy.buyer)}</option>
            <option value="retail">{pickLocaleCopy(locale, formCopy.retail)}</option>
            <option value="collaboration">{pickLocaleCopy(locale, formCopy.collaboration)}</option>
            <option value="press">{pickLocaleCopy(locale, formCopy.press)}</option>
          </select>
        </label>
        <label>
          <span className="inquiry-field-label">
            {pickLocaleCopy(locale, inquiry.name)} <span className="field-required">{pickLocaleCopy(locale, formCopy.required)}</span>
          </span>
          <input name="name" minLength={2} required autoComplete="name" />
        </label>
        <label>
          <span className="inquiry-field-label">
            {pickLocaleCopy(locale, inquiry.email)} <span className="field-required">{pickLocaleCopy(locale, formCopy.required)}</span>
          </span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          <span className="inquiry-field-label">
            {pickLocaleCopy(locale, formCopy.company)} <span className="field-optional">{pickLocaleCopy(locale, formCopy.optional)}</span>
          </span>
          <input name="company" autoComplete="organization" />
        </label>
        <label>
          <span className="inquiry-field-label">
            {pickLocaleCopy(locale, inquiry.country)} <span className="field-optional">{pickLocaleCopy(locale, formCopy.optional)}</span>
          </span>
          <input name="country" autoComplete="country-name" />
        </label>
        <label>
          <span className="inquiry-field-label">
            {pickLocaleCopy(locale, formCopy.phone)} <span className="field-optional">{pickLocaleCopy(locale, formCopy.optional)}</span>
          </span>
          <input name="phone" autoComplete="tel" />
        </label>
        <label className="wide-field">
          <span className="inquiry-field-label">
            {pickLocaleCopy(locale, inquiry.message)} <span className="field-required">{pickLocaleCopy(locale, formCopy.required)}</span>
          </span>
          <textarea name="message" minLength={10} required />
        </label>
        <label className="inquiry-consent wide-field">
          <input name="privacyConsent" type="checkbox" required value="yes" />
          <span className="inquiry-consent-copy">
            <span>
              {pickLocaleCopy(locale, formCopy.consent)}{" "}
              <span className="field-required">{pickLocaleCopy(locale, formCopy.required)}</span>
            </span>
            <span className="inquiry-consent-detail">
              {pickLocaleCopy(locale, formCopy.consentDetail)}{" "}
              <a className="inquiry-policy-link" href={withLocalePrefix("/privacy-policy", locale)}>
                {pickLocaleCopy(locale, formCopy.privacy)}
              </a>
            </span>
          </span>
        </label>
        {siteKey ? <div className="turnstile-widget wide-field" ref={containerRef} /> : null}
        <input name="cf-turnstile-response" readOnly type="hidden" value={token} />
        <InquirySubmitButton locale={locale} />
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
