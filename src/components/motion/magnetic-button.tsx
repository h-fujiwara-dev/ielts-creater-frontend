"use client";

import type { ReactNode } from "react";
import { useMagnetic } from "@/lib/use-magnetic";

interface MagneticButtonProps {
  children: ReactNode;
}

// Thin client-component wrapper so server-rendered sections (Hero, CtaBand) can
// opt a single CTA into the cursor-pull effect without becoming client
// components themselves. Wraps in a <span> rather than forwarding a ref through
// Button's Base UI `render` prop, so it works regardless of that primitive's
// ref-forwarding behavior.
export function MagneticButton({ children }: MagneticButtonProps) {
  const ref = useMagnetic<HTMLSpanElement>();
  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
}
