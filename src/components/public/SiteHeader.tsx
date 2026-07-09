import { getProductCatalogHref } from "@/lib/products";

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
};

const fallbackNav = [
  { label: "Collection", href: getProductCatalogHref() },
  { label: "Projects", href: "/projects" },
  { label: "Archive", href: "/archive" },
  { label: "Inquiry", href: "/inquiry" }
];

export function SiteHeader({ content }: { content?: HeaderContent }) {
  const navItems = fallbackNav.map((item, index) => {
    const itemNumber = index + 1;
    const label = content?.[`nav${itemNumber}Label` as keyof HeaderContent];
    const href = content?.[`nav${itemNumber}Href` as keyof HeaderContent];

    return {
      label: typeof label === "string" && label.trim() ? label : item.label,
      href: typeof href === "string" && href.trim() ? href : item.href
    };
  });

  return (
    <header className="site-header">
      <a className="brand-mark" href={content?.logoHref || "/"} aria-label="OOGO home">
        <img src="/images/oogo-logo-white.png" alt={content?.logoText || "OOGO"} />
      </a>
      <nav className="site-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <details className="locale-switcher">
        <summary aria-label="Current language">KR</summary>
        <div aria-label="Language selector">
          <button type="button">EN</button>
          <button type="button">CN</button>
        </div>
      </details>
    </header>
  );
}
