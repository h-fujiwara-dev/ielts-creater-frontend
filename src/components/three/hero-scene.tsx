"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useWebglSupported } from "@/lib/use-webgl-support";
import { HeroSceneFallback } from "./hero-scene-fallback";

// Gating happens here, *before* the dynamic import is requested, so the
// three.js/@react-three/* chunk is never fetched at all under reduced motion
// or when WebGL2 is unsupported — not just hidden after loading.
const HeroVisualScene = dynamic(
  () => import("./hero-visual-scene").then((mod) => mod.HeroVisualScene),
  { ssr: false, loading: () => <HeroSceneFallback /> },
);

export function HeroScene() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const webglSupported = useWebglSupported();
  const [contextLost, setContextLost] = useState(false);

  if (prefersReducedMotion || !webglSupported || contextLost) {
    return <HeroSceneFallback />;
  }

  return <HeroVisualScene onContextLost={() => setContextLost(true)} />;
}
