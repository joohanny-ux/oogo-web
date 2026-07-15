import React from "react";
import { SiteHeaderFrame } from "@/components/public/SiteHeaderFrame";
import { getProductCatalogHref } from "@/lib/products";
import { getLandingPageContent, landingMediaUrl, landingText } from "@/lib/home-landing";
import { getLandingBlocks } from "@/lib/public-content";

export type HeaderContent = {
  logoText?: string;
  logoHref?: string;
  nav1Label?: string;
  nav1Href?: string;
  nav2Label?: string;
  nav2Href?: string;
  nav3Label?: string;
  nav3Href?: string;
  nav4Label?: string;
  nav4Href?: string;
  nav5Label?: string;
  nav5Href?: string;
  showLocale?: string;
};

const fallbackNav = [
  { label: "Brand", href: "/brand" },
  { label: "Collection", href: getProductCatalogHref() },
  { label: "Projects", href: "/projects" },
  { label: "Archive", href: "/archive" },
  { label: "Inquiry", href: "/inquiry" }
];

export async function SiteHeader({ content, overlay = false }: { content?: HeaderContent; overlay?: boolean }) {
  const blocks = content ? [] : await getLandingBlocks("ko");
  const saved = getLandingPageContent(blocks, "header").main;
  const resolvedContent = content ?? {
    logoText: landingText(saved, "logoLabel", "OOGO"),
    logoHref: landingText(saved, "logoHref", "/"),
    nav1Label: landingText(saved, "nav1Label", "Brand"),
    nav1Href: landingText(saved, "nav1Href", "/brand"),
    nav2Label: landingText(saved, "nav2Label", "Collection"),
    nav2Href: landingText(saved, "nav2Href", getProductCatalogHref()),
    nav3Label: landingText(saved, "nav3Label", "Projects"),
    nav3Href: landingText(saved, "nav3Href", "/projects"),
    nav4Label: landingText(saved, "nav4Label", "Archive"),
    nav4Href: landingText(saved, "nav4Href", "/archive"),
    nav5Label: landingText(saved, "nav5Label", "Inquiry"),
    nav5Href: landingText(saved, "nav5Href", "/inquiry"),
    showLocale: landingText(saved, "showLocale", "true")
  };
  const configuredItems = fallbackNav.map((item, index) => {
    const itemNumber = index + 1;
    const label = resolvedContent?.[`nav${itemNumber}Label` as keyof HeaderContent];
    const href = resolvedContent?.[`nav${itemNumber}Href` as keyof HeaderContent];

    return {
      label: typeof label === "string" && label.trim() ? label : item.label,
      href: typeof href === "string" && href.trim() ? href : item.href
    };
  });
  const uniqueItems = configuredItems.filter(
    (item, index, items) => items.findIndex((candidate) => candidate.href === item.href) === index
  );
  const navItems = uniqueItems.some((item) => item.href === "/archive" || item.label.toLowerCase() === "archive")
    ? uniqueItems
    : [
        ...uniqueItems.filter((item) => item.href !== "/inquiry"),
        { label: "Archive", href: "/archive" },
        ...uniqueItems.filter((item) => item.href === "/inquiry")
      ];

  return (
    <SiteHeaderFrame overlay={overlay}>
      <a className="brand-mark" href={resolvedContent.logoHref || "/"} aria-label="OOGO home">
        <img src={landingMediaUrl(saved, "/images/oogo-logo-white.png")} alt={resolvedContent.logoText || "OOGO"} />
      </a>
      <nav className="site-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      {resolvedContent.showLocale !== "false" ? (
        <details className="locale-switcher">
          <summary aria-label="Current language">KR</summary>
          <div aria-label="Language selector">
            <button type="button">EN</button>
            <button type="button">CN</button>
          </div>
        </details>
      ) : null}
    </SiteHeaderFrame>
  );
}
