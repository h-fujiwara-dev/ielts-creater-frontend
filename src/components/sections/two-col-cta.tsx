import { Button } from "@/components/ui/button";

export function TwoColCta() {
  return (
    <section className="mx-auto grid max-w-6xl gap-4 px-6 py-16 md:grid-cols-2">
      <div className="rounded-2xl bg-brand-orange p-8 shadow-sm transition-shadow duration-200 hover:shadow-lg">
        <h3 className="text-xl font-bold text-brand-navy">使い方はシンプル</h3>
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
      </div>
      <div className="rounded-2xl bg-brand-lavender p-8 shadow-sm transition-shadow duration-200 hover:shadow-lg">
        <h3 className="text-xl font-bold text-brand-navy">お困りですか？</h3>
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
      </div>
    </section>
  );
}
