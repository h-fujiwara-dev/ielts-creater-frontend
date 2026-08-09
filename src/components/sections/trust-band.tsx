import { BarChart3, CheckCheck, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { highlights, questionFormats } from "@/lib/mock-data";

const icons = [Sparkles, CheckCheck, BarChart3];

export function TrustBand() {
  return (
    <section className="bg-brand-orange/90 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-2xl font-bold text-brand-navy md:text-3xl">
          解くたびに、学びが積み上がっていく
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {highlights.map((h, i) => {
            const Icon = icons[i];
            return (
              <Card
                key={h.label}
                className="border-none bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg"
              >
                <CardContent className="p-5">
                  <Icon className="size-5 text-brand-orange" />
                  <p className="mt-3 text-sm text-brand-navy/80">{h.description}</p>
                  <p className="mt-3 text-sm font-semibold text-brand-navy">
                    {h.label}
                  </p>
                </CardContent>
              </Card>
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
