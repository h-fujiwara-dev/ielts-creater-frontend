import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConditionBadges } from "@/components/shared/condition-badges";
import type { Difficulty, Section } from "@/lib/api/enums";

interface GenerationFailedStateProps {
  section: Section;
  topic: string;
  difficulty: Difficulty;
  // コンテンツ生成自体の失敗（ルール違反等）はこの既定文言を表示する。レート制限超過など
  // 生成以前にAPI呼び出しが失敗したケースはbackendのエラーメッセージをそのまま渡す。
  message?: string;
  onRetry: () => void;
}

export function GenerationFailedState({
  section,
  topic,
  difficulty,
  message,
  onRetry,
}: GenerationFailedStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>問題の生成に失敗しました</AlertTitle>
          <AlertDescription>
            {message ??
              "サーバー側で2回まで自動リトライしましたが、生成できませんでした。時間をおいて再度お試しください。"}
          </AlertDescription>
        </Alert>
        <ConditionBadges section={section} topic={topic} difficulty={difficulty} />
        <Button onClick={onRetry} className="self-start">
          同じ条件で再生成する
        </Button>
      </CardContent>
    </Card>
  );
}
