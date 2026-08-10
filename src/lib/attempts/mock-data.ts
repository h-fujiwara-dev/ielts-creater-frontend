import { mockGetQuestionSet } from "@/lib/question-sets/mock-data";
import { simulateDelay } from "@/lib/mock/simulate-delay";

import {
  readAttemptResult,
  readDraftAnswers,
  writeAttemptResult,
  writeDraftAnswers,
} from "./storage";
import type {
  AttemptAnswerResult,
  AttemptMockMeta,
  AttemptResult,
  GetSavedAnswersResponse,
  PatchAnswersRequest,
  StartAttemptRequest,
  StartAttemptResponse,
} from "./types";

// 正答・解説データ。実バックエンドと同様、question-sets側のレスポンス
// （src/lib/question-sets/mock-data.ts）には一切含めず、採点時のみ参照する。
interface AnswerKeyEntry {
  correctAnswer: string;
  explanation: string | null;
}

const ANSWER_KEY: Record<string, AnswerKeyEntry> = {
  q1: {
    correctAnswer: "TRUE",
    explanation: "Paragraph B states that vegetation lowers surrounding temperatures.",
  },
  q2: {
    correctAnswer: "NOT_GIVEN",
    explanation: "The passage does not state how many residents live within walking distance of a park.",
  },
  q3: {
    correctAnswer: "FALSE",
    explanation: "Paragraph C states that funding was cut during downturns, not increased every year.",
  },
  q4: {
    correctAnswer: "vertical gardens",
    explanation: "Paragraph B mentions vertical gardens as a space-efficient alternative.",
  },
  q5: {
    correctAnswer: "economic",
    explanation: "Paragraph D discusses economic pressure on urban land.",
  },
  q6: {
    correctAnswer: "How urban parks influence local temperatures",
    explanation: "Paragraph B focuses on the cooling effect of green spaces.",
  },
  q7: {
    correctAnswer: "Funding challenges facing green space projects",
    explanation: "Paragraph C discusses inconsistent funding for green space projects.",
  },
  ql1: {
    correctAnswer: "Campus facilities",
    explanation: "The speaker introduces the talk as an overview of campus facilities.",
  },
  ql2: {
    correctAnswer: "9:00 AM",
    explanation: "The speaker states that the library opens at 9:00 AM on weekdays.",
  },
};

const QUESTION_IDS_BY_QUESTION_SET: Record<string, string[]> = {
  "mock-qs-reading": ["q1", "q2", "q3", "q4", "q5", "q6", "q7"],
  "mock-qs-listening": ["ql1", "ql2"],
};

export function questionSetIdFromAttemptId(attemptId: string): string {
  return attemptId.replace(/^att-/, "");
}

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

function gradeAnswer(questionId: string, userAnswerText: string | undefined): AttemptAnswerResult {
  const key = ANSWER_KEY[questionId];
  const answerText = (userAnswerText ?? "").trim();
  const isCorrect = Boolean(
    key && answerText.length > 0 && normalize(answerText) === normalize(key.correctAnswer)
  );

  return {
    questionId,
    userAnswerText: answerText,
    isCorrect,
    correctAnswer: key?.correctAnswer ?? "",
    explanation: key?.explanation ?? null,
  };
}

export function mockStartAttempt(request: StartAttemptRequest): Promise<StartAttemptResponse> {
  // questionSetIdから決定的にattemptIdを導出することで、リロード後も同じ受験に
  // 復元できるようにする（実バックエンドではPOSTの都度新規UUIDが払い出される）。
  const id = `att-${request.questionSetId}`;
  const existingResult = readAttemptResult(id);
  return simulateDelay({ id, status: existingResult ? "SUBMITTED" : "IN_PROGRESS" }, 300);
}

export function mockGetSavedAnswers(attemptId: string): Promise<GetSavedAnswersResponse> {
  const answers = readDraftAnswers(attemptId);
  const result = readAttemptResult(attemptId);
  return simulateDelay(
    { attemptId, status: result ? "SUBMITTED" : "IN_PROGRESS", answers },
    200
  );
}

export function mockPatchAnswers(attemptId: string, request: PatchAnswersRequest): Promise<void> {
  const merged = new Map(readDraftAnswers(attemptId).map((a) => [a.questionId, a.userAnswerText]));
  for (const answer of request.answers) {
    merged.set(answer.questionId, answer.userAnswerText);
  }
  writeDraftAnswers(
    attemptId,
    Array.from(merged.entries()).map(([questionId, userAnswerText]) => ({
      questionId,
      userAnswerText,
    }))
  );
  return simulateDelay(undefined, 300);
}

export function mockSubmitAttempt(attemptId: string): Promise<AttemptResult> {
  const questionIds = QUESTION_IDS_BY_QUESTION_SET[questionSetIdFromAttemptId(attemptId)] ?? [];
  const draftAnswers = new Map(readDraftAnswers(attemptId).map((a) => [a.questionId, a.userAnswerText]));

  const answers = questionIds.map((questionId) => gradeAnswer(questionId, draftAnswers.get(questionId)));
  const result: AttemptResult = {
    attemptId,
    rawScore: answers.filter((a) => a.isCorrect).length,
    maxScore: answers.length,
    answers,
  };

  writeAttemptResult(attemptId, result);
  return simulateDelay(result, 500);
}

// GET /api/v1/attempts/{id} のモック。POST submit（上記）とレスポンス形状が同一のため
// AttemptResult型を共有する。S-06履歴一覧からの遷移など、保存済み結果がない場合は
// 0点のダミー結果にフォールバックする（S-05結果画面が確実に描画できるようにするため）。
export function mockGetAttemptResult(attemptId: string): Promise<AttemptResult> {
  const stored = readAttemptResult(attemptId);
  if (stored) return simulateDelay(stored, 300);

  const questionIds = QUESTION_IDS_BY_QUESTION_SET[questionSetIdFromAttemptId(attemptId)] ?? [];
  const answers = questionIds.map((questionId) => gradeAnswer(questionId, undefined));
  return simulateDelay({ attemptId, rawScore: 0, maxScore: answers.length, answers }, 300);
}

// AttemptResult型には含まれないスコアサマリー表示用の付随情報（モック専用）。
export async function mockGetAttemptMeta(attemptId: string): Promise<AttemptMockMeta> {
  const questionSetId = questionSetIdFromAttemptId(attemptId);
  const detail = await mockGetQuestionSet(questionSetId);

  return simulateDelay(
    {
      section: detail.section,
      topic: detail.topic,
      difficulty: detail.difficulty,
      submittedAt: new Date().toISOString(),
      durationMinutes: detail.section === "READING" ? 18 : 12,
    },
    200
  );
}

// AttemptAnswerResultにはquestionIdしか含まれない（実バックエンド仕様に忠実）ため、
// 結果画面の表示用に設問文をquestionId単位で引けるようにする補助関数（モック専用）。
export async function mockGetAttemptQuestionPrompts(
  attemptId: string
): Promise<Record<string, string>> {
  const detail = await mockGetQuestionSet(questionSetIdFromAttemptId(attemptId));
  const prompts: Record<string, string> = {};
  for (const group of detail.questionGroups) {
    for (const question of group.questions) {
      prompts[question.id] = question.promptText;
    }
  }
  return prompts;
}
