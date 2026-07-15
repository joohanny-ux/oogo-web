import { InquirySection } from "@/components/public/InquirySection";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getLandingPageContent } from "@/lib/home-landing";
import { getLandingBlocks } from "@/lib/public-content";
import { getRequestLocale } from "@/lib/public-locale";

export default async function InquiryPage() {
  const locale = await getRequestLocale();
  const content = getLandingPageContent(await getLandingBlocks(locale), "inquiry");
  return (
    <>
      <SiteHeader />
      <main className="inquiry-page">
        <InquirySection content={content} locale={locale} />
      </main>
      <SiteFooter />
    </>
  );
}
