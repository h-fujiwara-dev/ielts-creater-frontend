import { ArrowRight, Sparkles, PencilLine, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SpotlightCard } from "@/components/reactbits/spotlight-card";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { howItWorks } from "@/lib/mock-data";

const icons = [Sparkles, PencilLine, BarChart3];

export function Insights() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
      <RevealOnScroll className="text-center">
        <p className="text-sm font-bold tracking-wide text-brand-orange">
          3ステップ
        </p>
        <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">
          使い方
        </h2>
      </RevealOnScroll>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {howItWorks.map((step, i) => {
          const Icon = icons[i];
          const isLast = i === howItWorks.length - 1;
          return (
            <RevealOnScroll key={step.title} delay={i * 120} className="relative">
              <SpotlightCard
                className="rounded-xl"
                spotlightColor="rgba(15, 23, 42, 0.06)"
              >
                <Card className="overflow-hidden border-none shadow-sm transition-shadow duration-200 hover:shadow-lg">
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-brand-navy/10 to-brand-orange/30">
                    <Icon className="size-10 text-brand-navy/40" />
                  </div>
                  <CardContent className="p-5">
                    <Badge className="bg-brand-lavender text-brand-navy">
                      {step.tag}
                    </Badge>
                    <h3 className="mt-3 font-semibold text-brand-navy">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-brand-navy/60">
                      {step.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </SpotlightCard>
              {!isLast && (
                <div
                  aria-hidden="true"
                  className="absolute top-1/2 -right-3 z-10 hidden size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-navy/50 shadow-sm ring-1 ring-brand-navy/10 md:flex"
                >
                  <ArrowRight className="size-3.5" />
                </div>
              )}
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}
