"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Question } from "@/lib/question-sets/types";

interface MatchingHeadingsQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export function MatchingHeadingsQuestion({
  question,
  value,
  onChange,
}: MatchingHeadingsQuestionProps) {
  return (
    <div className="flex items-center gap-3">
      <p className="w-32 shrink-0 text-sm text-brand-navy">
        {question.displayOrder}. {question.promptText}
      </p>
      <Select value={value} onValueChange={(next) => onChange(next ?? "")}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="見出しを選択してください" />
        </SelectTrigger>
        <SelectContent>
          {(question.options ?? []).map((option) => (
            <SelectItem key={option.id} value={option.label}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
