import { Inbox } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function HistoryEmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        <Inbox className="size-10 text-muted-foreground" />
        <p className="font-semibold text-brand-navy">まだ受験履歴がありません</p>
        <p className="text-sm text-muted-foreground">
          問題を生成して最初のIELTS練習を始めましょう
        </p>
        <Button size="sm" render={<Link href="/practice/new" />} nativeButton={false}>
          問題を生成する
        </Button>
      </CardContent>
    </Card>
  );
}
