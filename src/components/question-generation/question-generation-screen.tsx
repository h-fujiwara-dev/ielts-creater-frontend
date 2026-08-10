"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import type { Difficulty, Section } from "@/lib/api/enums";
import { difficultySchema, sectionSchema, type GenerationFormValues } from "@/lib/question-sets/schemas";
import { mockCreateQuestionSet, mockGetQuestionSet } from "@/lib/question-sets/mock-data";

import { GenerationForm } from "./generation-form";
import { GeneratingState } from "./generating-state";
import { GenerationFailedState } from "./generation-failed-state";

type Step = "form" | "generating" | "failed";

interface GeneratingConditions {
  questionSetId: string;
  section: Section;
  topic: string;
  difficulty: Difficulty;
}

const POLL_INTERVAL_MS = 1200;

function parsePrefill(searchParams: URLSearchParams): Partial<GenerationFormValues> {
  const section = sectionSchema.safeParse(searchParams.get("section"));
  const difficulty = difficultySchema.safeParse(searchParams.get("difficulty"));
  const topic = searchParams.get("topic");

  return {
    ...(section.success ? { section: section.data } : {}),
    ...(difficulty.success ? { difficulty: difficulty.data } : {}),
    ...(topic ? { topic } : {}),
  };
}

export function QuestionGenerationScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("form");
  const [conditions, setConditions] = useState<GeneratingConditions | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGeneration = useCallback(async (values: GenerationFormValues) => {
    const response = await mockCreateQuestionSet(values);
    setConditions({
      questionSetId: response.id,
      section: values.section,
      topic: response.topic,
      difficulty: values.difficulty,
    });
    setStep("generating");
  }, []);

  useEffect(() => {
    if (step !== "generating" || !conditions) return;

    const poll = async () => {
      const detail = await mockGetQuestionSet(conditions.questionSetId);
      if (detail.status === "READY") {
        router.push(`/practice/${conditions.questionSetId}`);
      } else if (detail.status === "FAILED") {
        setStep("failed");
      }
    };

    pollTimer.current = setInterval(poll, POLL_INTERVAL_MS);
    poll();

    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [step, conditions, router]);

  const handleRetry = useCallback(() => {
    if (!conditions) return;
    startGeneration({
      section: conditions.section,
      topic: conditions.topic,
      difficulty: conditions.difficulty,
    });
  }, [conditions, startGeneration]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <p className="text-sm font-bold tracking-wide text-brand-orange">S-03</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-navy">問題生成</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          セクション・トピック・難易度を指定して問題を生成します
        </p>
      </div>

      {step === "form" && (
        <Card>
          <CardContent>
            <GenerationForm
              defaultValues={parsePrefill(searchParams)}
              onSubmit={startGeneration}
            />
          </CardContent>
        </Card>
      )}

      {step === "generating" && conditions && (
        <GeneratingState
          section={conditions.section}
          topic={conditions.topic}
          difficulty={conditions.difficulty}
          estimatedSeconds={conditions.section === "READING" ? 8 : 12}
        />
      )}

      {step === "failed" && conditions && (
        <GenerationFailedState
          section={conditions.section}
          topic={conditions.topic}
          difficulty={conditions.difficulty}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
