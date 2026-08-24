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
import { featureGrid } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const icons = [Sparkles, Volume2, CheckCircle2, MessageSquareText, History, BarChart3];

// Two "flagship" tiles (index 0 and 5) span 2 columns on large screens for an
// asymmetric bento layout; the remaining four stay single-column.
const bentoSpan = ["lg:col-span-2", "", "", "", "", "lg:col-span-2"];

export function FeatureGrid() {
  return (
    <section id="features" className="bg-brand-lavender py-20">
      <div className="mx-auto max-w-6xl px-6">
        <RevealOnScroll className="text-center">
          <p className="text-sm font-bold tracking-wide text-brand-orange">
            オールインワン
          </p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">
            IELTS対策に必要なものを、ひとつに
          </h2>
        </RevealOnScroll>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featureGrid.map((f, i) => {
            const Icon = icons[i];
            const isLarge = bentoSpan[i] !== "";
            return (
              <RevealOnScroll key={f.title} delay={i * 80} className={bentoSpan[i]}>
                <SpotlightCard
                  tilt
                  className={cn(
                    "group flex h-full flex-col items-start gap-3 rounded-2xl transition-colors duration-200",
                    isLarge ? "p-6" : "p-3",
                  )}
                  spotlightColor="rgba(249, 115, 22, 0.10)"
                >
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-xl bg-white text-brand-navy shadow-sm transition-shadow duration-200 group-hover:shadow-md",
                      isLarge ? "size-14" : "size-11",
                    )}
                  >
                    <Icon className={isLarge ? "size-6" : "size-5"} />
                  </div>
                  <h3
                    className={cn(
                      "font-semibold text-brand-navy",
                      isLarge && "text-lg",
                    )}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm text-brand-navy/70">{f.description}</p>
                </SpotlightCard>
              </RevealOnScroll>
            );
          })}
        </div>

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
