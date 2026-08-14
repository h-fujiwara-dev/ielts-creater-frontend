import { ArrowDown, ArrowUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardMockHighlights, DashboardSummaryResponse } from "@/lib/dashboard/types";

interface StatTileProps {
  label: string;
  value: string;
  deltaLabel: string;
  isUp: boolean;
}

function StatTile({ label, value, deltaLabel, isUp }: StatTileProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold text-brand-navy">{value}</p>
        <p
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            isUp ? "text-success" : "text-error"
          )}
        >
          {isUp ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
          {deltaLabel}
        </p>
      </CardContent>
    </Card>
  );
}

interface StatTilesProps {
  summary: DashboardSummaryResponse;
  highlights: DashboardMockHighlights;
}

export function StatTiles({ summary, highlights }: StatTilesProps) {
  const readingAccuracy = summary.averageAccuracyBySection.READING;
  const listeningAccuracy = summary.averageAccuracyBySection.LISTENING;
  const readingDelta = highlights.sectionAccuracyDeltaPt.READING ?? 0;
  const listeningDelta = highlights.sectionAccuracyDeltaPt.LISTENING ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatTile
        label="総受験回数"
        value={`${summary.totalAttempts}`}
        deltaLabel={`先週比 ${highlights.totalAttemptsDelta >= 0 ? "+" : ""}${highlights.totalAttemptsDelta}`}
        isUp={highlights.totalAttemptsDelta >= 0}
      />
      {readingAccuracy !== undefined && (
        <StatTile
          label="Reading平均正答率"
          value={`${Math.round(readingAccuracy * 100)}%`}
          deltaLabel={`${readingDelta >= 0 ? "+" : ""}${readingDelta}pt`}
          isUp={readingDelta >= 0}
        />
      )}
      {listeningAccuracy !== undefined && (
        <StatTile
          label="Listening平均正答率"
          value={`${Math.round(listeningAccuracy * 100)}%`}
          deltaLabel={`${listeningDelta >= 0 ? "+" : ""}${listeningDelta}pt`}
          isUp={listeningDelta >= 0}
        />
      )}
    </div>
  );
}
