"use client";

import { useEffect, useState } from "react";

import {
  mockGetAttemptMeta,
  mockGetAttemptQuestionPrompts,
  mockGetAttemptResult,
} from "@/lib/attempts/mock-data";
import type { AttemptMockMeta, AttemptResult } from "@/lib/attempts/types";

import { QuestionResultList } from "./question-result-list";
import { ScoreSummaryCard } from "./score-summary-card";

interface ResultScreenProps {
  attemptId: string;
}

export function ResultScreen({ attemptId }: ResultScreenProps) {
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [meta, setMeta] = useState<AttemptMockMeta | null>(null);
  const [prompts, setPrompts] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      mockGetAttemptResult(attemptId),
      mockGetAttemptMeta(attemptId),
      mockGetAttemptQuestionPrompts(attemptId),
    ]).then(([resultData, metaData, promptsData]) => {
      if (cancelled) return;
      setResult(resultData);
      setMeta(metaData);
      setPrompts(promptsData);
    });

    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  if (!result || !meta) {
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
      <QuestionResultList answers={result.answers} prompts={prompts} />
    </div>
  );
}
