import {
  BarChart3,
  CheckCircle2,
  History,
  MessageSquareText,
  Sparkles,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/reactbits/spotlight-card";
import { featureGrid } from "@/lib/mock-data";

const icons = [Sparkles, Volume2, CheckCircle2, MessageSquareText, History, BarChart3];

export function FeatureGrid() {
  return (
    <section className="bg-brand-lavender py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-brand-navy md:text-4xl">
          IELTS対策に必要なものを、ひとつに
        </h2>

        <div className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3">
          {featureGrid.map((f, i) => {
            const Icon = icons[i];
            return (
              <SpotlightCard
                key={f.title}
                className="group flex flex-col items-start gap-3 rounded-2xl p-3 transition-colors duration-200"
                spotlightColor="rgba(249, 115, 22, 0.10)"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-white text-brand-navy shadow-sm transition-shadow duration-200 group-hover:shadow-md">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold text-brand-navy">{f.title}</h3>
                <p className="text-sm text-brand-navy/70">{f.description}</p>
              </SpotlightCard>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Button
            type="button"
            className="cursor-pointer rounded-full bg-brand-navy px-6 text-white shadow-sm transition-all duration-200 hover:bg-brand-navy-light hover:shadow-md"
          >
            無料ではじめる
          </Button>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer rounded-full border-brand-navy/20 bg-transparent px-6 text-brand-navy transition-colors duration-200 hover:bg-white"
          >
            ログイン
          </Button>
        </div>
      </div>
    </section>
  );
}
