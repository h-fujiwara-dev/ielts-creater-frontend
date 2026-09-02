"use client";

import { useSyncExternalStore } from "react";

function detectWebgl2(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!canvas.getContext("webgl2");
  } catch {
    return false;
  }
}

function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return false;
}

// WebGL2 support is a fixed capability that never changes during a session,
// so this store never notifies subscribers — useSyncExternalStore is used
// purely for its SSR-safe snapshot semantics (mirrors usePrefersReducedMotion),
// avoiding both a hydration mismatch and a setState-in-effect footgun.
export function useWebglSupported() {
  return useSyncExternalStore(subscribe, detectWebgl2, getServerSnapshot);
}
