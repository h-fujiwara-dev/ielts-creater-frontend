import Link from "next/link";

import { ConditionBadges } from "@/components/shared/condition-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AttemptResult, AttemptResultMeta } from "@/lib/attempts/types";

import { ScoreRing } from "./score-ring";

interface ScoreSummaryCardProps {
  result: AttemptResult;
  meta: AttemptResultMeta | null;
}

function formatSubmittedAt(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ScoreSummaryCard({ result, meta }: ScoreSummaryCardProps) {
  const retryHref = meta
    ? `/practice/new?section=${meta.section}&topic=${encodeURIComponent(meta.topic)}&difficulty=${meta.difficulty}`
    : "/practice/new";

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <ScoreRing rawScore={result.rawScore} maxScore={result.maxScore} />
        <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
          {meta && (
            <>
              <ConditionBadges section={meta.section} topic={meta.topic} difficulty={meta.difficulty} />
              <p className="text-sm text-muted-foreground">
                {formatSubmittedAt(meta.submittedAt)} 提出
                {meta.durationMinutes !== undefined && ` ・ 所要時間 ${meta.durationMinutes}分`}
              </p>
            </>
          )}
          <div className="flex flex-wrap gap-2">
            <Button render={<Link href={retryHref} />} nativeButton={false}>
              もう一度挑戦する
            </Button>
            <Button variant="outline" render={<Link href="/dashboard" />} nativeButton={false}>
              ダッシュボードへ戻る
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
