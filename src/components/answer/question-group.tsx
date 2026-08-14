import { FillBlankQuestion } from "@/components/question-formats/fill-blank-question";
import { MatchingHeadingsQuestion } from "@/components/question-formats/matching-headings-question";
import { McqQuestion } from "@/components/question-formats/mcq-question";
import { TfngQuestion } from "@/components/question-formats/tfng-question";
import { FORMAT_LABELS } from "@/lib/api/enums";
import type { QuestionGroup as QuestionGroupData } from "@/lib/question-sets/types";

interface QuestionGroupProps {
  group: QuestionGroupData;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
}

export function QuestionGroup({ group, answers, onAnswerChange }: QuestionGroupProps) {
  const firstOrder = group.questions[0]?.displayOrder;
  const lastOrder = group.questions[group.questions.length - 1]?.displayOrder;
  const rangeLabel =
    firstOrder === lastOrder ? `${firstOrder}` : `${firstOrder}–${lastOrder}`;

  return (
    <div className="flex flex-col gap-4 border-b border-border py-6 first:pt-0 last:border-b-0 last:pb-0">
      <div>
        <p className="text-xs font-bold tracking-wide text-brand-orange uppercase">
          設問 {rangeLabel} · {FORMAT_LABELS[group.formatType]}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{group.instructions}</p>
      </div>

      <div className="flex flex-col gap-4">
        {group.questions.map((question) => {
          const value = answers[question.id] ?? "";
          const onChange = (next: string) => onAnswerChange(question.id, next);

          switch (group.formatType) {
            case "TFNG":
              return <TfngQuestion key={question.id} question={question} value={value} onChange={onChange} />;
            case "MCQ":
              return <McqQuestion key={question.id} question={question} value={value} onChange={onChange} />;
            case "FILL_BLANK":
              return (
                <FillBlankQuestion key={question.id} question={question} value={value} onChange={onChange} />
              );
            case "MATCHING_HEADINGS":
              return (
                <MatchingHeadingsQuestion
                  key={question.id}
                  question={question}
                  value={value}
                  onChange={onChange}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
