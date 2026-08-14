"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ConditionBadges } from "@/components/shared/condition-badges";
import { ApiError } from "@/lib/api/client";
import {
  mockGetSavedAnswers,
  mockPatchAnswers,
  mockStartAttempt,
  mockSubmitAttempt,
} from "@/lib/attempts/mock-data";
import {
  mockGetAudioSegments,
  mockGetQuestionSet,
} from "@/lib/question-sets/mock-data";
import type { AudioSegment, QuestionSetDetail } from "@/lib/question-sets/types";

import { AutosaveIndicator, type AutosaveState } from "./autosave-indicator";
import { ListeningLayout } from "./listening-layout";
import { ReadingLayout } from "./reading-layout";

const AUTOSAVE_DEBOUNCE_MS = 800;

interface AnswerScreenProps {
  questionSetId: string;
}

export function AnswerScreen({ questionSetId }: AnswerScreenProps) {
  const router = useRouter();
  const [questionSet, setQuestionSet] = useState<QuestionSetDetail | null>(null);
  const [audioSegments, setAudioSegments] = useState<AudioSegment[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [autosaveState, setAutosaveState] = useState<AutosaveState>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitialLoad = useRef(true);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const detail = await mockGetQuestionSet(questionSetId);
        if (cancelled) return;
        setQuestionSet(detail);

        if (detail.section === "LISTENING") {
          const audio = await mockGetAudioSegments(questionSetId);
          if (!cancelled) setAudioSegments(audio.segments);
        }

        const attempt = await mockStartAttempt({ questionSetId });
        if (cancelled) return;
        startedAtRef.current = Date.now();
        setAttemptId(attempt.id);

        const saved = await mockGetSavedAnswers(attempt.id);
        if (cancelled) return;
        const restored: Record<string, string> = {};
        for (const answer of saved.answers) {
          restored[answer.questionId] = answer.userAnswerText;
        }
        setAnswers(restored);
        isInitialLoad.current = false;
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(
          error instanceof ApiError ? error.message : "問題の読み込みに失敗しました。"
        );
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [questionSetId]);

  useEffect(() => {
    if (isInitialLoad.current || !attemptId) return;

    setAutosaveState("saving");
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        await mockPatchAnswers(attemptId, {
          answers: Object.entries(answers).map(([questionId, userAnswerText]) => ({
            questionId,
            userAnswerText,
          })),
        });
        setAutosaveState("saved");
      } catch {
        setAutosaveState("idle");
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [answers, attemptId]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    setIsSubmitting(true);
    try {
      await mockSubmitAttempt(attemptId);
      const submittedAt = new Date().toISOString();
      const durationMinutes = startedAtRef.current
        ? Math.max(1, Math.round((Date.now() - startedAtRef.current) / 60000))
        : undefined;
      const params = new URLSearchParams({ questionSetId, submittedAt });
      if (durationMinutes !== undefined) {
        params.set("durationMinutes", String(durationMinutes));
      }
      router.push(`/attempts/${attemptId}/result?${params.toString()}`);
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(
        error instanceof ApiError ? error.message : "回答の提出に失敗しました。"
      );
    }
  };

  if (errorMessage) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm font-medium text-destructive">{errorMessage}</p>
      </div>
    );
  }

  if (!questionSet) {
    return (
      <div className="flex justify-center py-16">
        <span className="size-8 animate-spin rounded-full border-[3px] border-brand-navy/20 border-t-brand-navy" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ConditionBadges
          section={questionSet.section}
          topic={questionSet.topic}
          difficulty={questionSet.difficulty}
        />
        <AutosaveIndicator state={autosaveState} />
      </div>

      {questionSet.section === "READING" ? (
        <ReadingLayout
          questionSet={questionSet}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        <ListeningLayout
          questionSet={questionSet}
          audioSegments={audioSegments}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
