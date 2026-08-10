import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SECTION_LABELS, type Section } from "@/lib/api/enums";
import type { AttemptListItem } from "@/lib/attempts/types";

const SECTION_BADGE_VARIANT: Record<Section, "navy" | "orange"> = {
  READING: "navy",
  LISTENING: "orange",
};

function formatSubmittedAt(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface HistoryRowProps {
  item: AttemptListItem;
}

export function HistoryRow({ item }: HistoryRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-4 last:border-b-0">
      <div className="flex items-center gap-2">
        <Badge variant={SECTION_BADGE_VARIANT[item.section]}>{SECTION_LABELS[item.section]}</Badge>
        <span className="text-sm text-muted-foreground">{formatSubmittedAt(item.submittedAt)}</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-lg font-bold text-brand-navy">
          {item.rawScore} / {item.maxScore}
        </span>
        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/practice/${item.questionSetId}`} />}
          nativeButton={false}
        >
          もう一度解く
        </Button>
        <Button
          variant="ghost"
          size="sm"
          render={<Link href={`/attempts/${item.attemptId}/result`} />}
          nativeButton={false}
        >
          結果を見る ›
        </Button>
      </div>
    </div>
  );
}
