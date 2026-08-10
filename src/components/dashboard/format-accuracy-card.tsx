import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FORMAT_LABELS, type FormatType } from "@/lib/api/enums";

import { AccuracyProgressRow } from "./accuracy-progress-row";

interface FormatAccuracyCardProps {
  accuracyByFormat: Partial<Record<FormatType, number>>;
}

export function FormatAccuracyCard({ accuracyByFormat }: FormatAccuracyCardProps) {
  const entries = Object.entries(accuracyByFormat) as [FormatType, number][];

  return (
    <Card>
      <CardHeader>
        <CardTitle>出題形式別正答率</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {entries.map(([format, ratio]) => (
          <AccuracyProgressRow key={format} label={FORMAT_LABELS[format]} ratio={ratio} />
        ))}
      </CardContent>
    </Card>
  );
}
