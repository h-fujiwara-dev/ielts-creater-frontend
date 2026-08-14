import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ResultScreen } from "@/components/result/result-screen";
import { jsonResponse, route, stubFetchRoutes } from "@/test/fetch-mock";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

function asSearchParams(params: URLSearchParams): ReturnType<typeof useSearchParams> {
  return params as unknown as ReturnType<typeof useSearchParams>;
}

const ATTEMPT_RESULT = {
  attemptId: "att-mock-qs-reading",
  rawScore: 6,
  maxScore: 7,
  answers: [
    { questionId: "q1", userAnswerText: "TRUE", isCorrect: true, correctAnswer: "TRUE", explanation: null },
  ],
};

const QUESTION_SET_DETAIL = {
  id: "mock-qs-reading",
  section: "READING",
  topic: "Environment",
  difficulty: "BAND_6_7",
  status: "READY",
  passage: { title: "The Impact of Urban Green Spaces", paragraphs: [] },
  listeningContext: null,
  questionGroups: [
    {
      formatType: "TFNG",
      instructions: "...",
      questions: [
        {
          id: "q1",
          promptText: "Urban parks reduce average city temperatures.",
          displayOrder: 1,
          answerOptions: null,
        },
      ],
    },
  ],
};

beforeEach(() => {
  vi.mocked(useSearchParams).mockReturnValue(
    asSearchParams(
      new URLSearchParams({
        questionSetId: "mock-qs-reading",
        submittedAt: "2026-08-10T05:32:00Z",
        durationMinutes: "18",
      }),
    ),
  );

  stubFetchRoutes([
    route("GET", "/api/v1/attempts/att-mock-qs-reading", () => jsonResponse(ATTEMPT_RESULT)),
    route("GET", "/api/v1/question-sets/mock-qs-reading", () => jsonResponse(QUESTION_SET_DETAIL)),
  ]);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ResultScreen (S-05)", () => {
  it("shows a loading spinner before both requests resolve", () => {
    const { container } = render(<ResultScreen attemptId="att-mock-qs-reading" />);

    expect(screen.queryByRole("heading", { name: "結果" })).not.toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders the score summary and per-question results once loaded", async () => {
    render(<ResultScreen attemptId="att-mock-qs-reading" />);

    expect(await screen.findByRole("heading", { name: "結果" }, { timeout: 2000 })).toBeInTheDocument();
    // CardTitle renders a styled <div>, not a heading element, so match by text.
    expect(screen.getByText("設問ごとの結果")).toBeInTheDocument();
    expect(
      screen.getByText("Urban parks reduce average city temperatures."),
    ).toBeInTheDocument();
  });
});
