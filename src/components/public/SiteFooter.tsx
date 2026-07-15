import { getProductCatalogHref } from "@/lib/products";
import { getLandingPageContent, landingText } from "@/lib/home-landing";
import { getLandingBlocks } from "@/lib/public-content";

const socialLinks = [
  { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/oogolabs" },
  { label: "Facebook", icon: "facebook", href: "https://www.facebook.com/oogolabs" },
  { label: "TikTok", icon: "tiktok", href: "https://www.tiktok.com/@oogolabs" },
  { label: "YouTube", icon: "youtube", href: "https://www.youtube.com/@oogolabs" },
  { label: "Pinterest", icon: "pinterest", href: "https://www.pinterest.com/oogolabs" }
] as const;

type SocialIconName = (typeof socialLinks)[number]["icon"];

function SocialIcon({ icon }: { icon: SocialIconName }) {
  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="5" width="14" height="14" rx="4" />
        <circle cx="12" cy="12" r="3.2" />
        <circle className="filled-icon" cx="16.2" cy="7.8" r="1" />
      </svg>
    );
  }

  if (icon === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 8h2V5h-2.4c-2.6 0-4.1 1.5-4.1 4v2H7v3h2.5v5h3.2v-5h2.7l.4-3h-3.1V9.2c0-.8.4-1.2 1.3-1.2Z" />
      </svg>
    );
  }

  if (icon === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 5v9.2a4 4 0 1 1-3.6-4" />
        <path d="M14 5c.5 2.8 2.2 4.4 5 4.8" />
      </svg>
    );
  }

  if (icon === "youtube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="7" width="16" height="10" rx="3" />
        <path className="filled-icon" d="m10.5 10 4 2-4 2Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11.7 13.8c-.5 2.4-1 4.7-2.6 6.2-.5-3.4.7-6 1.3-8.7-1-1.7.1-5.2 2.4-4.3 2.8 1.1-2.4 6.8 1.1 7.5 3.6.7 5.1-6.3 2.8-8.6-3.3-3.3-9.7-.1-8.9 4.7.2 1.2 1.4 1.6.5 3.3-2.2-.5-2.9-2.2-2.8-4.5.2-3.8 3.4-6.4 6.6-6.8 4.1-.5 7.9 1.5 8.4 5.3.6 4.3-1.8 9-6.2 8.7-1.2-.1-2.1-.7-2.6-1.8Z" />
    </svg>
  );
}

export async function SiteFooter() {
  const blocks = await getLandingBlocks("ko");
  const content = getLandingPageContent(blocks, "footer");
  const brand = content.brand;
  const navigation = content.navigation;
  const contact = content["contact-legal"];
  const navLinks = [
    ["nav1Label", "nav1Href", "Collection", getProductCatalogHref()],
    ["nav2Label", "nav2Href", "Projects", "/projects"],
    ["nav3Label", "nav3Href", "Archive", "/archive"],
    ["nav4Label", "nav4Href", "Inquiry", "/inquiry"],
    ["nav5Label", "nav5Href", "Brand Story", "/brand"]
  ];
  const resolvedSocialLinks = socialLinks.map((link) => ({
    ...link,
    href: landingText(contact, link.icon, link.href)
  }));

  return (
    <footer className="site-footer">
      <div>
        <img className="footer-logo" src="/images/oogo-logo-white.png" alt="OOGO" />
        <p>{landingText(brand, "brandDescription", "Frames for light, face, and quiet attitude.")}</p>
      </div>
      <nav aria-label="Footer navigation">
        {navLinks.map(([labelKey, hrefKey, fallbackLabel, fallbackHref]) => (
          <a href={landingText(navigation, hrefKey, fallbackHref)} key={labelKey}>
            {landingText(navigation, labelKey, fallbackLabel)}
          </a>
        ))}
      </nav>
      <div className="footer-contact">
        <span>{landingText(contact, "email", "contact@oogolabs.com")}</span>
        <span>Buyer / Retail / Collaboration</span>
        <span>{landingText(contact, "address", "Seoul, Korea")}</span>
        <nav className="footer-legal" aria-label="Legal links">
          <a href={landingText(contact, "termsHref", "/terms-conditions")}>{landingText(contact, "termsLabel", "Terms & Conditions")}</a>
          <a href={landingText(contact, "privacyHref", "/privacy-policy")}>{landingText(contact, "privacyLabel", "Privacy Policy")}</a>
        </nav>
        <div className="footer-socials" aria-label="Social links">
          {resolvedSocialLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
              <SocialIcon icon={link.icon} />
            </a>
          ))}
        </div>
        <p className="copyright">{landingText(contact, "copyright", "© 2026 OOGO. All rights reserved.")}</p>
      </div>
    </footer>
  );
}
