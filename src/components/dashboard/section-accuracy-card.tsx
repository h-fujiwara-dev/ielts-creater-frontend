import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SECTION_LABELS, type Section } from "@/lib/api/enums";

import { AccuracyProgressRow } from "./accuracy-progress-row";

interface SectionAccuracyCardProps {
  averageAccuracyBySection: Partial<Record<Section, number>>;
}

const SECTION_BADGE_VARIANT: Record<Section, "navy" | "orange"> = {
  READING: "navy",
  LISTENING: "orange",
};

export function SectionAccuracyCard({
  averageAccuracyBySection,
}: SectionAccuracyCardProps) {
  const entries = Object.entries(averageAccuracyBySection) as [Section, number][];

  return (
    <Card>
      <CardHeader>
        <CardTitle>セクション別平均正答率</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {entries.map(([section, ratio]) => (
          <AccuracyProgressRow
            key={section}
            label={
              <Badge variant={SECTION_BADGE_VARIANT[section]}>
                {SECTION_LABELS[section]}
              </Badge>
            }
            ratio={ratio}
          />
        ))}
        <p className="text-xs text-muted-foreground">
          もっと練習して正答率を伸ばしましょう。
        </p>
      </CardContent>
    </Card>
  );
}
