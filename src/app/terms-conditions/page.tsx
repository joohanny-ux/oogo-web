import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";

const sections = [
  {
    title: "Website Use",
    body: "This website is provided by OOGO for brand introduction, product reference, and inquiry purposes. Content may be updated without prior notice."
  },
  {
    title: "Product Information",
    body: "Product images, specifications, and availability shown on this site are for reference. Final details for buyer and retail partners may differ and will be confirmed through direct inquiry."
  },
  {
    title: "Buyer / Retail Inquiry",
    body: "Catalogue requests, wholesale discussions, and collaboration proposals submitted through the inquiry form are reviewed by the OOGO team. Submission does not guarantee a partnership or delivery timeline."
  },
  {
    title: "Intellectual Property",
    body: "All brand assets, photographs, product designs, and written materials on this website belong to OOGO or its licensors. Content may not be copied, redistributed, or commercially reused without written permission."
  },
  {
    title: "Limitation of Liability",
    body: "OOGO aims to keep website information accurate, but does not warrant completeness or uninterrupted access. OOGO is not liable for indirect damages arising from use of this website."
  },
  {
    title: "Contact",
    body: "For questions about these terms, contact contact@oogolabs.com."
  }
] as const;

export default function TermsConditionsPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <section className="legal-page-intro">
          <p className="eyebrow">Legal</p>
          <h1>Terms &amp; Conditions</h1>
          <p>Operating guidelines for using the OOGO website and submitting business inquiries.</p>
        </section>
        <section className="legal-page-body" aria-label="Terms sections">
          {sections.map((section) => (
            <article className="legal-block" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </section>
        <p className="legal-page-note">
          This page is an interim operational summary and may be updated after final legal review.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
