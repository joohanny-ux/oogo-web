import { InquirySection } from "@/components/public/InquirySection";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getLandingPageContent } from "@/lib/home-landing";
import { getLandingBlocks } from "@/lib/public-content";

export default async function InquiryPage() {
  const content = getLandingPageContent(await getLandingBlocks("ko"), "inquiry");
  return (
    <>
      <SiteHeader />
      <main className="inquiry-page">
        <InquirySection content={content} />
      </main>
      <SiteFooter />
    </>
  );
}
