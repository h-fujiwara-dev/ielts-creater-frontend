"use client";

import { useEffect, useRef } from "react";
import {
  BarChart3,
  CheckCircle2,
  History,
  MessageSquareText,
  Sparkles,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/reactbits/spotlight-card";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { featureGrid } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const icons = [Sparkles, Volume2, CheckCircle2, MessageSquareText, History, BarChart3];

// Two "flagship" tiles (index 0 and 5) span 2 columns on large screens for an
// asymmetric bento layout; the remaining four stay single-column.
const bentoSpan = ["lg:col-span-2", "", "", "", "", "lg:col-span-2"];

function FeatureCard({
  title,
  description,
  Icon,
  isLarge,
}: {
  title: string;
  description: string;
  Icon: (typeof icons)[number];
  isLarge: boolean;
}) {
  return (
    <SpotlightCard
      tilt
      className={cn(
        "group flex h-full flex-col items-start gap-3 rounded-2xl bg-brand-cream ring-1 ring-brand-navy/10 transition-colors duration-200",
        isLarge ? "p-6" : "p-3",
      )}
      spotlightColor="rgba(249, 115, 22, 0.10)"
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-brand-lavender text-brand-navy shadow-sm transition-shadow duration-200 group-hover:shadow-md",
          isLarge ? "size-14" : "size-11",
        )}
      >
        <Icon className={isLarge ? "size-6" : "size-5"} />
      </div>
      <h3 className={cn("font-semibold text-brand-navy", isLarge && "text-lg")}>{title}</h3>
      <p className="text-sm text-brand-navy/70">{description}</p>
    </SpotlightCard>
  );
}

// Synchronized GSAP stagger reveal for the bento grid, replacing the
// per-card RevealOnScroll used everywhere else — a single ScrollTrigger.batch()
// firing once feels more deliberate than six independent IntersectionObservers.
// Skipped entirely under prefers-reduced-motion (see the sibling static grid
// below), so gsap/ScrollTrigger never even run their effect in that case.
function AnimatedGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-feature-card]"));
      gsap.set(cards, { opacity: 0, y: 24 });
      ScrollTrigger.batch(cards, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
          }),
      });
    }, grid);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={gridRef} className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {featureGrid.map((f, i) => (
        <div key={f.title} data-feature-card className={bentoSpan[i]}>
          <FeatureCard
            title={f.title}
            description={f.description}
            Icon={icons[i]}
            isLarge={bentoSpan[i] !== ""}
          />
        </div>
      ))}
    </div>
  );
}

function StaticGrid() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {featureGrid.map((f, i) => (
        <RevealOnScroll key={f.title} delay={i * 80} className={bentoSpan[i]}>
          <FeatureCard
            title={f.title}
            description={f.description}
            Icon={icons[i]}
            isLarge={bentoSpan[i] !== ""}
          />
        </RevealOnScroll>
      ))}
    </div>
  );
}

export function FeatureGrid() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="features" className="bg-brand-cream py-20">
      <div className="mx-auto max-w-6xl px-6">
        <RevealOnScroll className="text-center">
          <p className="text-sm font-bold tracking-wide text-brand-orange">
            オールインワン
          </p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">
            IELTS対策に必要なものを、ひとつに
          </h2>
        </RevealOnScroll>

        {prefersReducedMotion ? <StaticGrid /> : <AnimatedGrid />}

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Button
            render={<Link href="/login?step=signup" />}
            nativeButton={false}
            className="cursor-pointer rounded-full bg-brand-navy px-6 text-white shadow-sm transition-all duration-200 hover:bg-brand-navy-light hover:shadow-md"
          >
            無料ではじめる
          </Button>
          <Button
            variant="outline"
            render={<Link href="/login" />}
            nativeButton={false}
            className="cursor-pointer rounded-full border-brand-navy/20 bg-transparent px-6 text-brand-navy transition-colors duration-200 hover:bg-white"
          >
            ログイン
          </Button>
        </div>
      </div>
    </section>
  );
}
