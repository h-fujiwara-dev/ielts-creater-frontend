"use client";

import { motion, type TargetAndTransition } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

// Adapted from reactbits.dev's BlurText (https://reactbits.dev/text-animations/blur-text),
// ported to TypeScript and simplified (single tag, no custom keyframe overrides) for this app.

type AnimationState = Record<string, string | number>;

function buildKeyframes(
  from: AnimationState,
  steps: AnimationState[],
): Record<string, (string | number)[]> {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((step) => Object.keys(step)),
  ]);

  const keyframes: Record<string, (string | number)[]> = {};
  keys.forEach((key) => {
    keyframes[key] = [from[key], ...steps.map((step) => step[key])];
  });
  return keyframes;
}

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "characters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  stepDuration?: number;
}

export function BlurText({
  text,
  delay = 40,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  stepDuration = 0.3,
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : Array.from(text);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const fromSnapshot = useMemo<AnimationState>(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -20 }
        : { filter: "blur(10px)", opacity: 0, y: 20 },
    [direction],
  );

  const toSnapshots = useMemo<AnimationState[]>(
    () => [
      { filter: "blur(4px)", opacity: 0.6, y: direction === "top" ? 4 : -4 },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction],
  );

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1),
  );

  if (prefersReducedMotion) {
    return (
      <span ref={ref} className={className}>
        {text}
      </span>
    );
  }

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);
        const animateTarget = (
          inView ? animateKeyframes : fromSnapshot
        ) as TargetAndTransition;

        return (
          <motion.span
            key={`${segment}-${index}`}
            className="inline-block will-change-[transform,filter,opacity]"
            initial={fromSnapshot as TargetAndTransition}
            animate={animateTarget}
            transition={{
              duration: totalDuration,
              times,
              delay: (index * delay) / 1000,
              ease: "easeOut",
            }}
          >
            {segment === " " ? " " : segment}
            {animateBy === "words" && index < elements.length - 1
              ? " "
              : null}
          </motion.span>
        );
      })}
    </span>
  );
}
