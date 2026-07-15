import React from "react";
import { SiteHeaderFrame } from "@/components/public/SiteHeaderFrame";
import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n";
import { getProductCatalogHref } from "@/lib/products";
import { getLandingPageContent, landingMediaUrl, landingText } from "@/lib/home-landing";
import { getLandingBlocks } from "@/lib/public-content";
import {
  getRequestLocale,
  getRequestPathname,
  localizedHrefForLocale,
  withLocalePrefix
} from "@/lib/public-locale";
import { landingTextForLocale, pickLocaleCopy, publicCopy } from "@/lib/public-copy";

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
  { labelKey: "brand" as const, href: "/brand" },
  { labelKey: "collection" as const, href: getProductCatalogHref() },
  { labelKey: "projects" as const, href: "/projects" },
  { labelKey: "archive" as const, href: "/archive" },
  { labelKey: "inquiry" as const, href: "/inquiry" }
];

export async function SiteHeader({ content, overlay = false }: { content?: HeaderContent; overlay?: boolean }) {
  const locale = await getRequestLocale();
  const pathname = await getRequestPathname();
  const blocks = content ? [] : await getLandingBlocks(locale);
  const saved = getLandingPageContent(blocks, "header").main;
  const navCopy = publicCopy.nav;
  const resolvedContent = content ?? {
    logoText: landingText(saved, "logoText", landingText(saved, "logoLabel", "OOGO")),
    logoHref: landingText(saved, "logoHref", "/"),
    nav1Label: landingTextForLocale(saved, "nav1Label", locale, navCopy.brand),
    nav1Href: landingText(saved, "nav1Href", "/brand"),
    nav2Label: landingTextForLocale(saved, "nav2Label", locale, navCopy.collection),
    nav2Href: landingText(saved, "nav2Href", getProductCatalogHref()),
    nav3Label: landingTextForLocale(saved, "nav3Label", locale, navCopy.projects),
    nav3Href: landingText(saved, "nav3Href", "/projects"),
    nav4Label: landingTextForLocale(saved, "nav4Label", locale, navCopy.archive),
    nav4Href: landingText(saved, "nav4Href", "/archive"),
    nav5Label: landingTextForLocale(saved, "nav5Label", locale, navCopy.inquiry),
    nav5Href: landingText(saved, "nav5Href", "/inquiry"),
    showLocale: landingText(saved, "showLocale", "true")
  };
  const configuredItems = fallbackNav.map((item, index) => {
    const itemNumber = index + 1;
    const label = resolvedContent?.[`nav${itemNumber}Label` as keyof HeaderContent];
    const href = resolvedContent?.[`nav${itemNumber}Href` as keyof HeaderContent];

    return {
      label:
        typeof label === "string" && label.trim()
          ? locale !== "ko" && /[\uAC00-\uD7A3]/.test(label)
            ? pickLocaleCopy(locale, navCopy[item.labelKey])
            : label
          : pickLocaleCopy(locale, navCopy[item.labelKey]),
      href: withLocalePrefix(typeof href === "string" && href.trim() ? href : item.href, locale)
    };
  });
  const uniqueItems = configuredItems.filter(
    (item, index, items) => items.findIndex((candidate) => candidate.href === item.href) === index
  );
  const navItems = uniqueItems.some((item) => item.href.endsWith("/archive") || item.label.toLowerCase() === "archive")
    ? uniqueItems
    : [
        ...uniqueItems.filter((item) => !item.href.endsWith("/inquiry")),
        { label: pickLocaleCopy(locale, navCopy.archive), href: withLocalePrefix("/archive", locale) },
        ...uniqueItems.filter((item) => item.href.endsWith("/inquiry"))
      ];

  return (
    <SiteHeaderFrame overlay={overlay}>
      <a
        className="brand-mark"
        href={withLocalePrefix(resolvedContent.logoHref || "/", locale)}
        aria-label="OOGO home"
      >
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
          <summary aria-label="Current language">{LOCALE_LABELS[locale]}</summary>
          <div aria-label="Language selector">
            {LOCALES.map((item: Locale) => (
              <a
                key={item}
                href={localizedHrefForLocale(pathname, item)}
                aria-current={item === locale ? "true" : undefined}
              >
                {LOCALE_LABELS[item]}
              </a>
            ))}
          </div>
        </details>
      ) : null}
    </SiteHeaderFrame>
  );
}
