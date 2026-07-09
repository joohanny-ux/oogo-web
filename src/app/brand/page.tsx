import type { CSSProperties } from "react";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";

const brandImages = [
  { label: "Showroom light", image: "/images/oogo-gallery.png", position: "center", tone: "dark" },
  { label: "Object balance", image: "/images/oogo-product-front.png", position: "center", tone: "light" },
  { label: "Side profile", image: "/images/oogo-product-side.png", position: "center", tone: "light" },
  { label: "Quiet shadow", image: "/images/oogo-hero.png", position: "58% center", tone: "dark" }
] as const;

const principles = [
  { index: "01", title: "Light", body: "A frame is read through shadow, reflection, and skin." },
  { index: "02", title: "Balance", body: "Calm proportions keep the object present without becoming loud." },
  { index: "03", title: "Everyday", body: "Designed to sit naturally with repeated daily gestures." }
] as const;

export default function BrandPage() {
  return (
    <>
      <SiteHeader />
      <main className="brand-page">
        <section className="brand-page-hero">
          <div className="brand-page-hero-copy">
            <p className="eyebrow">Brand Story</p>
            <h1>OOGO</h1>
            <p className="brand-page-lead">Frames for light, face, and quiet attitude.</p>
          </div>
          <div
            className="brand-page-hero-media"
            style={{ backgroundImage: 'url("/images/oogo-gallery.png")' } as CSSProperties}
            aria-label="OOGO brand image"
          />
        </section>

        <section className="brand-page-statement" aria-label="Brand statement">
          <p>
            OOGO studies the quiet distance between object and face. The frame is kept calm,
            wearable, and precise so light can do the rest.
          </p>
        </section>

        <section className="brand-page-principles" aria-label="OOGO principles">
          {principles.map((item) => (
            <article key={item.index}>
              <span>{item.index}</span>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
        </section>

        <section className="brand-page-grid" aria-label="OOGO visual notes">
          {brandImages.map((item) => (
            <figure className="brand-page-card" data-tone={item.tone} key={item.label}>
              <span
                style={
                  {
                    backgroundImage: `url("${item.image}")`,
                    backgroundPosition: item.position
                  } as CSSProperties
                }
              />
              <figcaption>{item.label}</figcaption>
            </figure>
          ))}
        </section>

        <section className="brand-page-cta">
          <a className="editorial-cta brand-page-cta-link" href="/collection">
            View collection
          </a>
          <a className="brand-page-cta-secondary" href="/inquiry">
            Inquiry
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
