import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { QuestionSetDetail } from "@/lib/question-sets/types";

import { PassageCard } from "./passage-card";
import { QuestionGroup } from "./question-group";

interface ReadingLayoutProps {
  questionSet: QuestionSetDetail;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ReadingLayout({
  questionSet,
  answers,
  onAnswerChange,
  onSubmit,
  isSubmitting,
}: ReadingLayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {questionSet.passage && <PassageCard passage={questionSet.passage} />}

      <Card>
        <CardContent className="flex flex-col">
          {questionSet.questionGroups.map((group) => (
            <QuestionGroup
              key={group.formatType}
              group={group}
              answers={answers}
              onAnswerChange={onAnswerChange}
            />
          ))}
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={onSubmit} disabled={isSubmitting}>
            回答を提出する
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
