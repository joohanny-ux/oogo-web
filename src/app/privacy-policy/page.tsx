import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";

const sections = [
  {
    title: "Information We Collect",
    body: "When you submit an inquiry, we may collect your name, email address, company name, country, contact or website details, inquiry type, and message content."
  },
  {
    title: "How We Use Information",
    body: "Collected information is used to respond to buyer, retail, collaboration, press, and archive requests, and to improve related communication."
  },
  {
    title: "Inquiry Form Data",
    body: "Inquiry form submissions, including privacy consent confirmation, are processed for business follow-up only. We do not sell inquiry data to third parties."
  },
  {
    title: "Cookies / Security",
    body: "Essential security and anti-spam measures, such as Cloudflare Turnstile verification, may process technical request data when enabled. Access controls are applied to protect inquiry records."
  },
  {
    title: "Data Retention",
    body: "Inquiry records are retained as needed for business communication and internal follow-up, then reviewed for deletion or anonymization when no longer required."
  },
  {
    title: "Contact",
    body: "For privacy-related requests, contact contact@oogolabs.com. By submitting the inquiry form and checking the consent box, you agree to this privacy notice."
  }
] as const;

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
        <section className="legal-page-intro">
          <p className="eyebrow">Legal</p>
          <h1>Privacy Policy</h1>
          <p>How OOGO handles personal information submitted through this website, including the inquiry form.</p>
        </section>
        <section className="legal-page-body" aria-label="Privacy sections">
          {sections.map((section) => (
            <article className="legal-block" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </section>
        <p className="legal-page-note">
          This privacy notice may be updated as services expand. The inquiry form consent refers to this policy.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
