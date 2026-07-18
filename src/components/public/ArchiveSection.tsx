import React, { type CSSProperties } from "react";
import type { Locale } from "@/lib/i18n";
import { landingText, type LandingContent } from "@/lib/home-landing";
import { withLocalePrefix } from "@/lib/locale-path";
import { landingTextForLocale, publicCopy } from "@/lib/public-copy";

const archiveItems = [
  {
    className: "archive-image-wearing",
    imageUrl: "/images/home-archive/OG26001C2_07.png"
  },
  {
    className: "archive-image-front",
    imageUrl: "/images/home-archive/OG26002C3_08.png"
  },
  {
    className: "archive-image-side",
    imageUrl: "/images/home-archive/OG26003C4_07.png"
  },
  {
    className: "archive-image-space",
    imageUrl: "/images/home-archive/OG26014C3_07.png"
  }
];

type ArchiveStyle = CSSProperties & { "--archive-image": string };

export function ArchiveSection({
  content,
  locale = "ko"
}: {
  content?: LandingContent;
  locale?: Locale;
}) {
  return (
    <section className="archive-section" id="archive">
      <div className="archive-heading">
        <p className="eyebrow">{landingTextForLocale(content, "eyebrow", locale, publicCopy.home.archiveEyebrow)}</p>
        <a href={withLocalePrefix(landingText(content, "primaryHref", "/archive"), locale)}>
          {landingTextForLocale(content, "primaryLabel", locale, publicCopy.common.viewArchive)}
        </a>
      </div>
      <div className="archive-grid">
        {archiveItems.map((item, index) => {
          const imageUrl = landingText(content, `image${index + 1}Url`, item.imageUrl);

          return (
            <article className="archive-card" key={item.className}>
              <div
                className={`archive-image ${item.className}`}
                style={{ "--archive-image": `url("${imageUrl}")` } as ArchiveStyle}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}
