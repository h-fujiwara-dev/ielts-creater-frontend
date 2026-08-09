import { Sparkles, PencilLine, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { howItWorks } from "@/lib/mock-data";

const icons = [Sparkles, PencilLine, BarChart3];

export function Insights() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-bold text-brand-navy md:text-4xl">
        使い方
      </h2>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {howItWorks.map((step, i) => {
          const Icon = icons[i];
          return (
            <Card
              key={step.title}
              className="overflow-hidden border-none shadow-sm transition-shadow duration-200 hover:shadow-lg"
            >
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
                <p className="mt-2 text-sm text-brand-navy/60">{step.excerpt}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
