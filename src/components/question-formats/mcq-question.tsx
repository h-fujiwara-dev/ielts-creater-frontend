"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Question } from "@/lib/question-sets/types";
import { cn } from "@/lib/utils";

interface McqQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export function McqQuestion({ question, value, onChange }: McqQuestionProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-brand-navy">
        {question.displayOrder}. {question.promptText}
      </p>
      <RadioGroup value={value} onValueChange={onChange} className="flex flex-col gap-2">
        {(question.options ?? []).map((option) => (
          <label
            key={option.label}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors duration-200",
              value === option.label
                ? "border-brand-navy bg-brand-lavender text-brand-navy"
                : "border-border hover:bg-muted"
            )}
          >
            <RadioGroupItem value={option.label} />
            {option.text}
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
