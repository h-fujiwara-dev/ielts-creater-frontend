"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const RADIUS = 90;
const STRENGTH = 0.35;

// Pulls the attached element toward the cursor within a radius, imperatively
// (no React state per mousemove) — the same direct-DOM-write style SpotlightCard
// already uses for its cursor-tracked spotlight. Disabled for touch pointers and
// under prefers-reduced-motion.
export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = ref.current;
    if (!el) return;

    el.style.transition = "transform 0.15s ease-out";

    function reset() {
      el!.style.transform = "";
    }

    function onMouseMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < RADIUS) {
        el!.style.transform = `translate(${(dx * STRENGTH).toFixed(1)}px, ${(dy * STRENGTH).toFixed(1)}px)`;
      } else {
        reset();
      }
    }

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    el.addEventListener("mouseleave", reset);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", reset);
      reset();
    };
  }, [prefersReducedMotion]);

  return ref;
}
