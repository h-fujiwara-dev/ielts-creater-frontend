import { describe, expect, it } from "vitest";

import {
  readAttemptResult,
  readDraftAnswers,
  writeAttemptResult,
  writeDraftAnswers,
} from "@/lib/attempts/storage";
import type { AttemptResult, SavedAnswer } from "@/lib/attempts/types";

const attemptId = "attempt-1";

describe("draft answers", () => {
  it("returns an empty array when nothing has been saved yet", () => {
    expect(readDraftAnswers(attemptId)).toEqual([]);
  });

  it("round-trips saved answers through sessionStorage", () => {
    const answers: SavedAnswer[] = [{ questionId: "q1", userAnswerText: "TRUE" }];

    writeDraftAnswers(attemptId, answers);

    expect(readDraftAnswers(attemptId)).toEqual(answers);
  });

  it("keeps drafts for different attempts independent", () => {
    writeDraftAnswers("attempt-a", [{ questionId: "q1", userAnswerText: "A" }]);
    writeDraftAnswers("attempt-b", [{ questionId: "q1", userAnswerText: "B" }]);

    expect(readDraftAnswers("attempt-a")).toEqual([{ questionId: "q1", userAnswerText: "A" }]);
    expect(readDraftAnswers("attempt-b")).toEqual([{ questionId: "q1", userAnswerText: "B" }]);
  });
});

describe("attempt result", () => {
  it("returns null when no result has been saved yet", () => {
    expect(readAttemptResult(attemptId)).toBeNull();
  });

  it("round-trips a saved result through sessionStorage", () => {
    const result: AttemptResult = {
      attemptId,
      rawScore: 7,
      maxScore: 10,
      answers: [
        {
          questionId: "q1",
          userAnswerText: "TRUE",
          isCorrect: true,
          correctAnswer: "TRUE",
          explanation: null,
        },
      ],
    };

    writeAttemptResult(attemptId, result);

    expect(readAttemptResult(attemptId)).toEqual(result);
  });
});
