import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GuestSignInButton } from "@/components/auth/guest-sign-in-button";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { BlurText } from "@/components/reactbits/blur-text";
import { HeroScene } from "@/components/three/hero-scene";

const SECONDARY_CTA_CLASSNAME =
  "cursor-pointer rounded-full border border-white/25 bg-white/5 px-6 text-white shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/10 hover:shadow-md";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-navy">
      <span
        id="hero-top-sentinel"
        aria-hidden="true"
        className="absolute inset-x-0 top-0 block h-px"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div className="motion-reduce:animate-none animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-sm font-bold tracking-wide text-brand-orange">
            AIが、あなた専用のIELTS問題をつくる。
          </p>
          <h1 className="mt-3 flex flex-col text-4xl leading-tight font-extrabold text-white md:text-5xl">
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
          <p className="mt-5 max-w-md text-base text-white/70">
            トピックと難易度を選ぶだけ。Reading・Listeningの練習問題をAIが自動生成し、自動採点・解説・学習履歴の記録までワンストップで。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton>
              <Button
                size="lg"
                render={<Link href="/login?step=signup" />}
                nativeButton={false}
                className="cursor-pointer rounded-full bg-white px-6 text-brand-navy shadow-sm transition-all duration-200 hover:bg-brand-cream hover:shadow-md"
              >
                無料ではじめる
              </Button>
            </MagneticButton>
            <Button
              variant="outline"
              size="lg"
              render={<Link href="/login" />}
              nativeButton={false}
              className={SECONDARY_CTA_CLASSNAME}
            >
              ログイン
            </Button>
            <GuestSignInButton className={SECONDARY_CTA_CLASSNAME} />
          </div>
          <p className="mt-2 text-xs text-white/50">
            ゲストは登録不要ですぐに試せます（生成回数に上限あり、データは約24時間で自動削除されます）
          </p>
        </div>

        <div className="motion-reduce:animate-none relative animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:150ms]">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-brand-navy-light shadow-2xl shadow-black/40 md:aspect-4/3">
            <HeroScene />
          </div>

          <div className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-brand-navy/90 px-4 py-3 shadow-lg shadow-black/30 backdrop-blur-sm">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-white">
                Reading問題を生成中…
              </p>
              <p className="text-[11px] text-white/50">残り約8秒</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
