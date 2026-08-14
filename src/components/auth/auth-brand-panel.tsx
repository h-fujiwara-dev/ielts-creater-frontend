import { BookOpenCheck } from "lucide-react";

const HEADING = "解いた分だけ、\n新しい問題に出会える。";
const DESCRIPTION = "AIが生成するIELTS対策アプリで、Reading・Listeningを何度でも練習できます。";

export function AuthBrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-[160deg] from-brand-navy to-brand-navy-light p-10 text-white min-[780px]:flex">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle,rgba(249,115,22,0.35)_1px,transparent_1px)] [background-size:22px_22px]"
      />
      <span className="relative z-10 flex items-center gap-2 text-lg font-bold">
        <BookOpenCheck className="size-6 text-brand-orange" strokeWidth={2.5} />
        IELTS Creator
      </span>
      <div className="relative z-10">
        <p className="text-xl leading-snug font-bold whitespace-pre-line">{HEADING}</p>
        <p className="mt-3 text-sm text-white/70">{DESCRIPTION}</p>
      </div>
    </div>
  );
}
