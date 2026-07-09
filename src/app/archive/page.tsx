import type { CSSProperties } from "react";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { archiveGridItems } from "@/lib/archive-items";

export default function ArchivePage() {
  return (
    <>
      <SiteHeader />
      <main className="archive-page">
        <section className="archive-page-intro">
          <p className="eyebrow">Archive</p>
          <h1>Archive</h1>
          <p>Visual records of OOGO frames, light, faces, and campaigns.</p>
        </section>
        <section className="archive-page-grid" aria-label="OOGO visual archive">
          {archiveGridItems.map((item) => (
            <article className={`archive-page-card archive-page-card-${item.category}`} key={item.id}>
              <span
                style={
                  {
                    backgroundImage: `url("${item.image}")`,
                    backgroundPosition: item.position ?? "center"
                  } as CSSProperties
                }
              />
              <strong>{item.label}</strong>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
