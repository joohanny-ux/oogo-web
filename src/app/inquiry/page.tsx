import { InquirySection } from "@/components/public/InquirySection";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";

export default function InquiryPage() {
  return (
    <>
      <SiteHeader />
      <main className="inquiry-page">
        <InquirySection />
      </main>
      <SiteFooter />
    </>
  );
}
