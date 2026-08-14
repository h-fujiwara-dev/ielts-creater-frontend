import { Card, CardContent } from "@/components/ui/card";
import type { AttemptListItem } from "@/lib/attempts/types";

import { HistoryRow } from "./history-row";

interface HistoryListProps {
  items: AttemptListItem[];
}

export function HistoryList({ items }: HistoryListProps) {
  return (
    <Card>
      <CardContent className="flex flex-col">
        {items.map((item) => (
          <HistoryRow key={item.attemptId} item={item} />
        ))}
      </CardContent>
    </Card>
  );
}
