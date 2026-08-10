import { HelpCircle, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/reactbits/spotlight-card";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

export function TwoColCta() {
  return (
    <section className="mx-auto grid max-w-6xl gap-4 px-6 py-20 md:grid-cols-2">
      <RevealOnScroll>
        <SpotlightCard
          className="rounded-2xl bg-brand-orange p-8 shadow-sm transition-shadow duration-200 hover:shadow-lg"
          spotlightColor="rgba(15, 23, 42, 0.08)"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-white/60 text-brand-navy">
            <Rocket className="size-5" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-brand-navy">
            使い方はシンプル
          </h3>
          <p className="mt-2 max-w-xs text-sm text-brand-navy/80">
            トピックと難易度を選ぶだけ。3ステップで最初の問題が完成します。
          </p>
          <Button
            type="button"
            size="sm"
            className="mt-5 cursor-pointer rounded-full bg-brand-navy text-white transition-colors duration-200 hover:bg-brand-navy-light"
          >
            使い方を見る
          </Button>
        </SpotlightCard>
      </RevealOnScroll>

      <RevealOnScroll delay={120}>
        <SpotlightCard
          className="rounded-2xl bg-brand-lavender p-8 shadow-sm transition-shadow duration-200 hover:shadow-lg"
          spotlightColor="rgba(249, 115, 22, 0.10)"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-white text-brand-navy">
            <HelpCircle className="size-5" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-brand-navy">
            お困りですか？
          </h3>
          <p className="mt-2 max-w-xs text-sm text-brand-navy/70">
            よくある質問で、使い方や対応形式をまとめて確認できます。
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-5 cursor-pointer rounded-full border-brand-navy/20 bg-white text-brand-navy transition-colors duration-200 hover:bg-brand-navy/5"
          >
            よくある質問を見る
          </Button>
        </SpotlightCard>
      </RevealOnScroll>
    </section>
  );
}
