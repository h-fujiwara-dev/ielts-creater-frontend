"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Question } from "@/lib/question-sets/types";
import { cn } from "@/lib/utils";

const TFNG_OPTIONS = [
  { value: "TRUE", label: "TRUE" },
  { value: "FALSE", label: "FALSE" },
  { value: "NOT_GIVEN", label: "NOT GIVEN" },
];

interface TfngQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export function TfngQuestion({ question, value, onChange }: TfngQuestionProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-brand-navy">
        {question.displayOrder}. {question.promptText}
      </p>
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-3 gap-2">
        {TFNG_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer items-center justify-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors duration-200",
              value === option.value
                ? "border-brand-navy bg-brand-lavender text-brand-navy"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            <RadioGroupItem value={option.value} />
            {option.label}
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
