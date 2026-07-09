import { InquiryForm } from "@/components/public/InquiryForm";

export function InquirySection() {
  return (
    <section className="inquiry-page-layout" id="inquiry">
      <div className="inquiry-page-copy">
        <p className="eyebrow">Contact &amp; Support</p>
        <h1>Product &amp; Business Inquiry</h1>
        <p className="inquiry-page-body">
          OOGO welcomes buyer, retail, collaboration, press, and archive requests. Share your message and we will
          respond by email.
        </p>
        <div className="inquiry-page-contact">
          <span className="inquiry-page-contact-label">Direct channel</span>
          <a href="mailto:contact@oogolabs.com">contact@oogolabs.com</a>
          <span>Seoul, Korea</span>
        </div>
        <ul className="inquiry-page-guides" aria-label="Inquiry topics">
          <li>Buyer catalogue</li>
          <li>Retail partnership</li>
          <li>Collaboration / campaign</li>
          <li>Press / archive request</li>
        </ul>
        <p className="inquiry-page-response">We usually respond within 1-2 business days.</p>
      </div>
      <InquiryForm />
    </section>
  );
}
