"use server";

import { LOCALES, type Locale } from "@/lib/i18n";
import { saveCompanySettings } from "@/lib/admin-content";

function readTranslation(formData: FormData, locale: Locale) {
  return {
    brandDescription: String(formData.get(`${locale}.brandDescription`) ?? ""),
    footerNote: String(formData.get(`${locale}.footerNote`) ?? "")
  };
}

export async function saveCompanySettingsAction(formData: FormData) {
  const translations = Object.fromEntries(
    LOCALES.map((locale) => [locale, readTranslation(formData, locale)])
  ) as Record<Locale, { brandDescription: string; footerNote: string }>;

  const result = await saveCompanySettings({
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    kakao: String(formData.get("kakao") ?? ""),
    instagram: String(formData.get("instagram") ?? ""),
    facebook: String(formData.get("facebook") ?? ""),
    tiktok: String(formData.get("tiktok") ?? ""),
    address: String(formData.get("address") ?? ""),
    translations
  });

  if (!result.ok) {
    throw new Error(result.message);
  }
}
