import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { AudioSegment } from "@/lib/question-sets/types";
import type { QuestionSetDetail } from "@/lib/question-sets/types";

import { AudioPlayer } from "./audio-player";
import { QuestionGroup } from "./question-group";

interface ListeningLayoutProps {
  questionSet: QuestionSetDetail;
  audioSegments: AudioSegment[];
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ListeningLayout({
  questionSet,
  audioSegments,
  answers,
  onAnswerChange,
  onSubmit,
  isSubmitting,
}: ListeningLayoutProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardContent className="flex flex-col gap-6">
          <AudioPlayer segments={audioSegments} />
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
