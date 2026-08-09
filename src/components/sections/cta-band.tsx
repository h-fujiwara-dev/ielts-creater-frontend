import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="bg-brand-blue py-16 text-center">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          今すぐ無料でIELTS対策を始めよう
        </h2>
        <p className="mt-3 text-sm text-white/70">
          トピックを選ぶだけ、1分で最初の問題が完成します。
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button
            type="button"
            className="cursor-pointer rounded-full bg-brand-orange px-6 text-brand-navy shadow-sm transition-all duration-200 hover:bg-brand-orange/90 hover:shadow-md"
          >
            無料ではじめる
          </Button>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer rounded-full border-white/30 bg-transparent px-6 text-white transition-colors duration-200 hover:bg-white/10"
          >
            ログイン
          </Button>
        </div>
      </div>
    </section>
  );
}
