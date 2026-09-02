"use client";

import { useEffect, useState } from "react";

// Tracks whether the page has scrolled past the top of the element with
// `targetId`, accounting for a fixed offset (typically the sticky header's
// own height) — used to flip SiteHeader's skin once the dark Hero scrolls
// out from under it.
export function useScrolledPast(targetId: string, offsetPx: number) {
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolledPast(!entry.isIntersecting),
      { rootMargin: `-${offsetPx}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId, offsetPx]);

  return scrolledPast;
}
