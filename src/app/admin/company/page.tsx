import { saveCompanySettingsAction } from "@/app/admin/company/actions";
import { getCompanySettings } from "@/lib/admin-content";
import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type CompanyTranslation = {
  locale: string;
  brand_description: string;
  footer_note: string;
};

function translationFor(translations: CompanyTranslation[], locale: Locale) {
  return translations.find((item) => item.locale === locale);
}

export default async function AdminCompanyPage() {
  const { settings, translations } = await getCompanySettings();

  return (
    <main className="admin-page">
      <h1>Company & Brand</h1>
      <p className="admin-page-note">공개 Footer, 연락 채널, 언어별 브랜드 문구를 관리합니다.</p>
      <form className="admin-form" action={saveCompanySettingsAction}>
        <div className="admin-form-grid">
          <label>
            Email
            <input name="email" defaultValue={settings?.email ?? ""} />
          </label>
          <label>
            Phone
            <input name="phone" defaultValue={settings?.phone ?? ""} />
          </label>
          <label>
            KakaoTalk
            <input name="kakao" defaultValue={settings?.kakao ?? ""} />
          </label>
          <label>
            Instagram
            <input name="instagram" defaultValue={settings?.instagram ?? ""} />
          </label>
          <label>
            Facebook
            <input name="facebook" defaultValue={settings?.facebook ?? ""} />
          </label>
          <label>
            TikTok
            <input name="tiktok" defaultValue={settings?.tiktok ?? ""} />
          </label>
          <label className="admin-wide-field">
            Address
            <input name="address" defaultValue={settings?.address ?? ""} />
          </label>
        </div>
        <div className="translation-panels">
          {LOCALES.map((locale) => {
            const translation = translationFor(translations, locale);

            return (
              <fieldset key={locale}>
                <legend>{LOCALE_LABELS[locale]}</legend>
                <label>
                  Brand description
                  <textarea name={`${locale}.brandDescription`} defaultValue={translation?.brand_description ?? ""} />
                </label>
                <label>
                  Footer note
                  <input name={`${locale}.footerNote`} defaultValue={translation?.footer_note ?? ""} />
                </label>
              </fieldset>
            );
          })}
        </div>
        <button type="submit">Save company settings</button>
      </form>
    </main>
  );
}
