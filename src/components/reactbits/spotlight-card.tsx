"use client";

import type { MouseEvent, ReactNode } from "react";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import "./spotlight-card.css";

// Adapted from reactbits.dev's SpotlightCard (https://reactbits.dev/components/spotlight-card),
// ported to TypeScript. No extra dependencies — pure CSS custom properties + a mousemove handler.
// Wraps around this app's own `Card` component rather than shipping its own background/border.
// The optional `tilt` prop layers on a light perspective-rotate effect reusing the same
// mousemove sample (no second listener), skipped under prefers-reduced-motion.

const MAX_TILT_DEG = 6;

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  tilt?: boolean;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor,
  tilt = false,
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = divRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
    if (spotlightColor) {
      el.style.setProperty("--spotlight-color", spotlightColor);
    }
    if (tilt && !prefersReducedMotion) {
      const nx = x / rect.width - 0.5;
      const ny = y / rect.height - 0.5;
      el.style.setProperty("--tilt-rx", `${(-ny * MAX_TILT_DEG).toFixed(2)}deg`);
      el.style.setProperty("--tilt-ry", `${(nx * MAX_TILT_DEG).toFixed(2)}deg`);
    }
  };

  const handleMouseLeave = () => {
    const el = divRef.current;
    if (!el || !tilt) return;
    el.style.setProperty("--tilt-rx", "0deg");
    el.style.setProperty("--tilt-ry", "0deg");
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("card-spotlight", tilt && !prefersReducedMotion && "card-spotlight--tilt", className)}
    >
      {children}
    </div>
  );
}
