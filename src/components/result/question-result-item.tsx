import { Badge } from "@/components/ui/badge";
import type { AttemptAnswerResult } from "@/lib/attempts/types";

interface QuestionResultItemProps {
  answer: AttemptAnswerResult;
  promptText: string;
}

export function QuestionResultItem({ answer, promptText }: QuestionResultItemProps) {
  const isUnanswered = answer.userAnswerText.length === 0;

  return (
    <div className="flex flex-col gap-2 border-b border-border py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-brand-navy">{promptText}</p>
        {isUnanswered ? (
          <Badge variant="warning">未回答</Badge>
        ) : answer.isCorrect ? (
          <Badge variant="success">正解</Badge>
        ) : (
          <Badge variant="destructive">不正解</Badge>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        あなたの回答: {isUnanswered ? "（未回答）" : answer.userAnswerText}
        {!answer.isCorrect && <> / 正解: {answer.correctAnswer}</>}
      </p>

      {!answer.isCorrect && answer.explanation && (
        <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
          {answer.explanation}
        </p>
      )}
    </div>
  );
}
