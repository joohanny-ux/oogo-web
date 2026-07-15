"use client";

import React, { useEffect, useState, type ReactNode } from "react";

export function SiteHeaderFrame({ children, overlay = false }: { children: ReactNode; overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overlay) return;

    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [overlay]);

  const className = ["site-header", overlay ? "is-overlay" : "", scrolled ? "is-scrolled" : ""]
    .filter(Boolean)
    .join(" ");

  return <header className={className}>{children}</header>;
}
