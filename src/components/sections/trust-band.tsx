import { BarChart3, CheckCheck, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SpotlightCard } from "@/components/reactbits/spotlight-card";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { highlights, questionFormats } from "@/lib/mock-data";

const icons = [Sparkles, CheckCheck, BarChart3];

export function TrustBand() {
  return (
    <section id="formats" className="bg-brand-orange/90 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <RevealOnScroll className="text-center">
          <p className="text-sm font-bold tracking-wide text-brand-navy/70">
            使うほど、力になる
          </p>
          <h2 className="mt-2 text-2xl font-bold text-brand-navy md:text-3xl">
            解くたびに、学びが積み上がっていく
          </h2>
        </RevealOnScroll>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {highlights.map((h, i) => {
            const Icon = icons[i];
            return (
              <RevealOnScroll key={h.label} delay={i * 100}>
                <SpotlightCard
                  className="rounded-xl"
                  spotlightColor="rgba(249, 115, 22, 0.12)"
                >
                  <Card className="border-none bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg">
                    <CardContent className="p-5">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                        <Icon className="size-5" />
                      </div>
                      <p className="mt-3 text-sm text-brand-navy/80">
                        {h.description}
                      </p>
                      <p className="mt-3 text-sm font-semibold text-brand-navy">
                        {h.label}
                      </p>
                    </CardContent>
                  </Card>
                </SpotlightCard>
              </RevealOnScroll>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium text-brand-navy/70">
          <span className="w-full text-center text-xs text-brand-navy/50 md:w-auto">
            対応する出題形式
          </span>
          {questionFormats.map((name) => (
            <span
              key={name}
              className="rounded-full bg-white/70 px-3 py-1 text-xs"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
