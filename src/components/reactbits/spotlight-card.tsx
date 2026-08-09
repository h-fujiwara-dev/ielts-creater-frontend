"use client";

import type { MouseEvent, ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import "./spotlight-card.css";

// Adapted from reactbits.dev's SpotlightCard (https://reactbits.dev/components/spotlight-card),
// ported to TypeScript. No extra dependencies — pure CSS custom properties + a mousemove handler.
// Wraps around this app's own `Card` component rather than shipping its own background/border.

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor,
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);

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
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn("card-spotlight", className)}
    >
      {children}
    </div>
  );
}
