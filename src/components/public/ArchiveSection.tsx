import type { CSSProperties } from "react";
import { landingText, type LandingContent } from "@/lib/home-landing";

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

export function ArchiveSection({ content }: { content?: LandingContent }) {
  return (
    <section className="archive-section" id="archive">
      <div className="archive-heading">
        <p className="eyebrow">{landingText(content, "eyebrow", "Archive")}</p>
        <a href={landingText(content, "primaryHref", "/archive")}>
          {landingText(content, "primaryLabel", "View archive")}
        </a>
      </div>
      <div className="archive-grid">
        {archiveItems.map((item) => (
          <article className="archive-card" key={item.className}>
            <div
              className={`archive-image ${item.className}`}
              style={{ "--archive-image": `url("${item.imageUrl}")` } as ArchiveStyle}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
