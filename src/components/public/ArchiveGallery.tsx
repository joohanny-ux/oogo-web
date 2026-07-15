"use client";

import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, TouchEvent } from "react";
import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ArchiveGridItem } from "@/lib/archive-items";
import type { Locale } from "@/lib/i18n";
import { pickLocaleCopy, publicCopy } from "@/lib/public-copy";

export function getAdjacentArchiveIndex(current: number, direction: -1 | 1, length: number) {
  return (current + direction + length) % length;
}

export function ArchiveGallery({
  items,
  label = "OOGO visual archive",
  locale = "ko"
}: {
  items: ArchiveGridItem[];
  label?: string;
  locale?: Locale;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => {
    const index = activeIndex;
    setActiveIndex(null);
    window.setTimeout(() => {
      if (index !== null) triggerRefs.current[index]?.focus();
    });
  }, [activeIndex]);

  const move = useCallback(
    (direction: -1 | 1) => {
      setActiveIndex((current) =>
        current === null ? null : getAdjacentArchiveIndex(current, direction, items.length)
      );
    },
    [items.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, move]);

  const onModalKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;

    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const onTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent) => {
    if (touchStartX.current === null) return;
    const distance = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 50) return;
    move(distance > 0 ? -1 : 1);
  };

  const activeItem = activeIndex === null ? null : items[activeIndex];

  return (
    <>
      <section className="archive-page-grid" aria-label={label}>
        {items.map((item, index) => (
          <button
            type="button"
            className={`archive-page-card archive-page-card-${item.category}`}
            key={item.id}
            aria-label={`${pickLocaleCopy(locale, publicCopy.a11y.openOriginal)}: ${item.label}`}
            aria-haspopup="dialog"
            onClick={() => setActiveIndex(index)}
            ref={(element) => {
              triggerRefs.current[index] = element;
            }}
          >
            <span
              style={
                {
                  backgroundImage: `url("${item.image}")`,
                  backgroundPosition: item.position ?? "center"
                } as CSSProperties
              }
            />
          </button>
        ))}
      </section>

      {activeItem && activeIndex !== null ? (
        <div
          className="archive-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeItem.label} ${pickLocaleCopy(locale, publicCopy.a11y.originalImage)}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          onKeyDown={onModalKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="archive-lightbox-toolbar">
            <span>{activeIndex + 1} / {items.length}</span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label={pickLocaleCopy(locale, publicCopy.a11y.closeOriginal)}
            >
              ×
            </button>
          </div>
          <div
            className="archive-lightbox-stage"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            <button type="button" onClick={() => move(-1)} aria-label={pickLocaleCopy(locale, publicCopy.a11y.prevImage)}>
              ‹
            </button>
            <img src={activeItem.image} alt={activeItem.label} />
            <button type="button" onClick={() => move(1)} aria-label={pickLocaleCopy(locale, publicCopy.a11y.nextImage)}>
              ›
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
