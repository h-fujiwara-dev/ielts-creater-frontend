import type { ReactNode } from "react";

import { Progress } from "@/components/ui/progress";

interface AccuracyProgressRowProps {
  label: ReactNode;
  ratio: number;
}

// 出題形式別・セクション別の正答率カードで共通利用する「ラベル＋バー＋%」の行。
export function AccuracyProgressRow({ label, ratio }: AccuracyProgressRowProps) {
  const percent = Math.round(ratio * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="w-36 shrink-0 text-sm text-brand-navy">{label}</div>
      <Progress value={percent} className="flex-1" />
      <div className="w-12 shrink-0 text-right text-sm font-semibold text-brand-navy">
        {percent}%
      </div>
    </div>
  );
}
