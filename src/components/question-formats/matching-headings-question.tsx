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

const PLACEHOLDER = "見出しを選択してください";

export function MatchingHeadingsQuestion({
  question,
  value,
  onChange,
}: MatchingHeadingsQuestionProps) {
  const options = question.options ?? [];

  return (
    <div className="flex items-center gap-3">
      <p className="w-32 shrink-0 text-sm text-brand-navy">
        {question.displayOrder}. {question.promptText}
      </p>
      <Select value={value} onValueChange={(next) => onChange(next ?? "")}>
        <SelectTrigger className="flex-1">
          {/* SelectValueはlabel(値)とtext(表示文言)が異なる場合、選択後の表示を
              value自体にフォールバックしてしまうため、children render-propで
              明示的にtextへ解決する。 */}
          <SelectValue placeholder={PLACEHOLDER}>
            {(selected: string | null) =>
              selected
                ? (options.find((option) => option.label === selected)?.text ?? selected)
                : PLACEHOLDER
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.label} value={option.label}>
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
