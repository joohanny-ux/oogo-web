"use client";

import React, { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Locale } from "@/lib/i18n";
import type { HomeHeroSlide } from "@/lib/home-landing";
import { pickLocaleCopy, publicCopy } from "@/lib/public-copy";

type HeroSlideStyle = CSSProperties & { "--hero-slide-image": string };

type HomeHeroSliderProps = {
  slides: HomeHeroSlide[];
  autoplay: boolean;
  intervalMs: number;
  locale?: Locale;
};

export function getAdjacentHeroIndex(index: number, direction: number, count: number) {
  if (count <= 0) return 0;
  return (index + direction + count) % count;
}

export function HomeHeroSlider({ slides, autoplay, intervalMs, locale = "ko" }: HomeHeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const hasMultipleSlides = slides.length > 1;

  useEffect(() => {
    if (!autoplay || !hasMultipleSlides || paused) return;
    if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => getAdjacentHeroIndex(current, 1, slides.length));
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [autoplay, hasMultipleSlides, intervalMs, paused, slides.length]);

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    pointerStart.current = event.clientX;
    setPaused(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerUp(event: PointerEvent<HTMLElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    setPaused(false);
    if (start === null) return;

    const distance = event.clientX - start;
    const threshold = Math.max(48, event.currentTarget.clientWidth * 0.08);
    if (Math.abs(distance) < threshold) return;

    setActiveIndex((current) => getAdjacentHeroIndex(current, distance < 0 ? 1 : -1, slides.length));
  }

  return (
    <section
      className="home-hero-slider"
      aria-label={pickLocaleCopy(locale, publicCopy.a11y.heroCarousel)}
      aria-roledescription="carousel"
      data-interval-ms={intervalMs}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onPointerDown={hasMultipleSlides ? handlePointerDown : undefined}
      onPointerUp={hasMultipleSlides ? handlePointerUp : undefined}
      onPointerCancel={() => {
        pointerStart.current = null;
        setPaused(false);
      }}
    >
      <div className="home-hero-track" style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}>
        {slides.map((slide, index) => {
          const backgroundUrl = slide.mediaType === "video" ? slide.posterUrl || "/images/oogo-hero.png" : slide.mediaUrl;
          const style: HeroSlideStyle = { "--hero-slide-image": `url("${backgroundUrl}")` };

          return (
            <article
              className={`home-hero-slide${slide.mediaType === "video" ? " is-video" : ""}`}
              style={style}
              key={slide.id}
              aria-hidden={index !== activeIndex}
              aria-label={slide.alt}
            >
              {slide.mediaType === "video" && index === activeIndex ? (
                <video
                  className="home-hero-video"
                  src={slide.mediaUrl}
                  poster={slide.posterUrl || undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                />
              ) : null}
              <div className="hero-copy">
                <p className="eyebrow">{slide.eyebrow}</p>
                <h1>{slide.heading}</h1>
                <p className="hero-line">{slide.line}</p>
              </div>
            </article>
          );
        })}
      </div>

      {hasMultipleSlides ? (
        <div className="hero-progress" aria-label="Hero slides">
          {slides.map((slide, index) => (
            <button
              type="button"
              className={`hero-progress-button${index === activeIndex ? " is-active" : ""}`}
              aria-label={
                locale === "ko"
                  ? `슬라이드 ${index + 1} 보기`
                  : `${pickLocaleCopy(locale, publicCopy.a11y.slideView)} ${index + 1}`
              }
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
              key={slide.id}
            >
              <span />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
