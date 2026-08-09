"use client";

import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/lib/use-in-view";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  threshold = 0.15,
}: RevealOnScrollProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold });

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const style: CSSProperties | undefined = delay
    ? { transitionDelay: `${delay}ms` }
    : undefined;

  return (
    <div
      ref={ref}
      style={style}
      className={cn(
        "transition-all duration-700 ease-out",
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
