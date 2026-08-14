"use client";

import { Input } from "@/components/ui/input";
import type { Question } from "@/lib/question-sets/types";

interface FillBlankQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export function FillBlankQuestion({ question, value, onChange }: FillBlankQuestionProps) {
  const [before, after] = question.promptText.split("______");

  return (
    <p className="text-sm leading-loose text-brand-navy">
      {question.displayOrder}. {before}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mx-1 inline-flex w-32"
      />
      {after}
    </p>
  );
}
