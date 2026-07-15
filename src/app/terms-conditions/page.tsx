import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { resolveLegalDocument, termsCopy } from "@/lib/legal-copy";
import { getRequestLocale } from "@/lib/public-locale";

export default async function TermsConditionsPage() {
  const locale = await getRequestLocale();
  const copy = resolveLegalDocument(termsCopy, locale);

  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <section className="legal-page-intro">
          <p className="eyebrow">LEGAL</p>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
          <p className="legal-page-meta">{copy.effective}</p>
        </section>
        <section className="legal-page-body" aria-label="Terms sections">
          {copy.sections.map((section) => (
            <article className="legal-block" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </section>
        <p className="legal-page-note">{copy.note}</p>
      </main>
      <SiteFooter />
    </>
  );
}
