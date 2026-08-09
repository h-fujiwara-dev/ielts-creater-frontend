import { Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BlurText } from "@/components/reactbits/blur-text";
import { DotField } from "@/components/reactbits/dot-field";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <DotField />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div className="motion-reduce:animate-none animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-sm font-bold tracking-wide text-brand-orange">
            AIが、あなた専用のIELTS問題をつくる。
          </p>
          <h1 className="mt-3 flex flex-col text-4xl leading-tight font-extrabold text-brand-navy md:text-5xl">
            <BlurText
              text="解いた分だけ、"
              animateBy="characters"
              delay={35}
            />
            <BlurText
              text="新しい問題に出会える。"
              animateBy="characters"
              delay={35}
            />
          </h1>
          <p className="mt-5 max-w-md text-base text-brand-navy/70">
            トピックと難易度を選ぶだけ。Reading・Listeningの練習問題をAIが自動生成し、自動採点・解説・学習履歴の記録までワンストップで。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              type="button"
              size="lg"
              className="cursor-pointer rounded-full bg-brand-navy px-6 text-white shadow-sm transition-all duration-200 hover:bg-brand-navy-light hover:shadow-md"
            >
              無料ではじめる
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="cursor-pointer rounded-full border-brand-navy/20 px-6 text-brand-navy transition-colors duration-200 hover:bg-brand-navy/5"
            >
              ログイン
            </Button>
          </div>
        </div>

        <div className="motion-reduce:animate-none relative animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:150ms]">
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-xl shadow-brand-navy/10">
            <Image
              src="/images/hero-study.jpg"
              alt="ヘッドホンをつけてノートPCで学習する人物"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 via-brand-navy/0 to-brand-navy/0" />
            <a
              href="https://unsplash.com/@sickhews?utm_source=ielts-creator&utm_medium=referral"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-3 bottom-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] text-white/90 backdrop-blur-sm transition-colors duration-200 hover:bg-black/60"
            >
              Photo by Wes Hicks on Unsplash
            </a>
          </div>

          <div className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl border border-brand-navy/5 bg-white px-4 py-3 shadow-lg shadow-brand-navy/10">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-brand-navy">
                Reading問題を生成中…
              </p>
              <p className="text-[11px] text-brand-navy/50">残り約8秒</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
