import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AttemptAnswerResult } from "@/lib/attempts/types";

import { QuestionResultItem } from "./question-result-item";

interface QuestionResultListProps {
  answers: AttemptAnswerResult[];
  prompts: Record<string, string>;
}

export function QuestionResultList({ answers, prompts }: QuestionResultListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>設問ごとの結果</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        {answers.map((answer) => (
          <QuestionResultItem
            key={answer.questionId}
            answer={answer}
            promptText={prompts[answer.questionId] ?? answer.questionId}
          />
        ))}
      </CardContent>
    </Card>
  );
}
