"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ApiError } from "@/lib/api/client";
import { mockGetAttemptResult } from "@/lib/attempts/mock-data";
import type { AttemptResult, AttemptResultMeta } from "@/lib/attempts/types";
import { mockGetQuestionSet } from "@/lib/question-sets/mock-data";

import { QuestionResultList } from "./question-result-list";
import { ScoreSummaryCard } from "./score-summary-card";

interface ResultScreenProps {
  attemptId: string;
}

export function ResultScreen({ attemptId }: ResultScreenProps) {
  const searchParams = useSearchParams();
  const questionSetId = searchParams.get("questionSetId");
  const submittedAt = searchParams.get("submittedAt");
  const durationMinutesParam = searchParams.get("durationMinutes");

  const [result, setResult] = useState<AttemptResult | null>(null);
  const [meta, setMeta] = useState<AttemptResultMeta | null>(null);
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [optionTextByQuestion, setOptionTextByQuestion] = useState<
    Record<string, Record<string, string>>
  >({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [resultData, questionSet] = await Promise.all([
          mockGetAttemptResult(attemptId),
          questionSetId ? mockGetQuestionSet(questionSetId) : Promise.resolve(null),
        ]);
        if (cancelled) return;

        setResult(resultData);

        if (questionSet) {
          setMeta({
            section: questionSet.section,
            topic: questionSet.topic,
            difficulty: questionSet.difficulty,
            submittedAt: submittedAt ?? new Date().toISOString(),
            durationMinutes: durationMinutesParam ? Number(durationMinutesParam) : undefined,
          });

          const promptMap: Record<string, string> = {};
          const optionTextMap: Record<string, Record<string, string>> = {};
          for (const group of questionSet.questionGroups) {
            for (const question of group.questions) {
              promptMap[question.id] = question.promptText;
              if (question.options?.length) {
                optionTextMap[question.id] = Object.fromEntries(
                  question.options.map((option) => [option.label, option.text])
                );
              }
            }
          }
          setPrompts(promptMap);
          setOptionTextByQuestion(optionTextMap);
        }

        setIsLoaded(true);
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(
          error instanceof ApiError ? error.message : "結果の取得に失敗しました。"
        );
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId, questionSetId]);

  if (errorMessage) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm font-medium text-destructive">{errorMessage}</p>
      </div>
    );
  }

  if (!isLoaded || !result) {
    return (
      <div className="flex justify-center py-16">
        <span className="size-8 animate-spin rounded-full border-[3px] border-brand-navy/20 border-t-brand-navy" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <p className="text-sm font-bold tracking-wide text-brand-orange">S-05</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-navy">結果</h1>
      </div>

      <ScoreSummaryCard result={result} meta={meta} />
      <QuestionResultList
        answers={result.answers}
        prompts={prompts}
        optionTextByQuestion={optionTextByQuestion}
      />
    </div>
  );
}
