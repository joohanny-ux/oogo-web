"use client";

// 저장 후에도 hydration 오류 없이 해당 섹션 카드를 다시 연다.
import React, { useEffect, useRef, type ReactNode } from "react";

export function LandingBlockDetails({
  name,
  initiallyOpen = false,
  children
}: {
  name: string;
  initiallyOpen?: boolean;
  children: ReactNode;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const node = detailsRef.current;
    if (!node) return;
    node.open = initiallyOpen;
  }, [initiallyOpen]);

  return (
    <details ref={detailsRef} name={name}>
      {children}
    </details>
  );
}
