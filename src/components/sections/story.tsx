import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

export function Story() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
      <RevealOnScroll>
        <p className="text-sm font-bold tracking-wide text-brand-orange">
          なぜIELTS Creatorなのか
        </p>
        <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-4xl">
          同じ問題を繰り返す時代は、終わりに。
        </h2>
        <p className="mt-5 max-w-md text-base text-brand-navy/70">
          市販の問題集は数が限られ、同じ問題を繰り返し解くことになりがち。生成AIの発展により、指定したトピック・難易度に沿った高品質な問題文・設問・解説を都度生成できるようになりました。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            type="button"
            className="cursor-pointer rounded-full bg-brand-navy px-6 text-white shadow-sm transition-all duration-200 hover:bg-brand-navy-light hover:shadow-md"
          >
            無料ではじめる
          </Button>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer rounded-full border-brand-navy/20 px-6 text-brand-navy transition-colors duration-200 hover:bg-brand-navy/5"
          >
            ログイン
          </Button>
        </div>
      </RevealOnScroll>
      <RevealOnScroll
        delay={150}
        className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-xl shadow-brand-navy/10"
      >
        <Image
          src="/images/story-writing.jpg"
          alt="ノートに書き込みながら学習する人物"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <a
          href="https://unsplash.com/@hannaholinger?utm_source=ielts-creator&utm_medium=referral"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-3 bottom-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] text-white/90 backdrop-blur-sm transition-colors duration-200 hover:bg-black/60"
        >
          Photo by Hannah Olinger on Unsplash
        </a>
      </RevealOnScroll>
    </section>
  );
}
