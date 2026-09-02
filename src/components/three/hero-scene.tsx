"use client";

import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useWebglSupported } from "@/lib/use-webgl-support";
import { HeroSceneFallback } from "./hero-scene-fallback";

// Gating happens here, *before* the dynamic import is requested, so the
// three.js/@react-three/* chunk is never fetched at all under reduced motion
// or when WebGL2 is unsupported — not just hidden after loading.
const BandScoreScene = dynamic(
  () => import("./band-score-scene").then((mod) => mod.BandScoreScene),
  { ssr: false, loading: () => <HeroSceneFallback /> },
);

export function HeroScene() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const webglSupported = useWebglSupported();

  if (prefersReducedMotion || !webglSupported) {
    return <HeroSceneFallback />;
  }

  return <BandScoreScene />;
}
