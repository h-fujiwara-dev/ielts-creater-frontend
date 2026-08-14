import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AnswerScreen } from "@/components/answer/answer-screen";
import { jsonResponse, route, stubFetchRoutes } from "@/test/fetch-mock";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

const push = vi.fn();

const QUESTION_SET_DETAIL = {
  id: "mock-qs-reading",
  section: "READING",
  topic: "Environment",
  difficulty: "BAND_6_7",
  status: "READY",
  passage: {
    title: "The Impact of Urban Green Spaces",
    paragraphs: [{ id: "A", text: "Urban green spaces..." }],
  },
  listeningContext: null,
  questionGroups: [
    {
      formatType: "TFNG",
      instructions: "Do the following statements agree with the passage?",
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
  vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);

  stubFetchRoutes([
    route("GET", "/api/v1/question-sets/mock-qs-reading", () => jsonResponse(QUESTION_SET_DETAIL)),
    route("POST", "/api/v1/attempts", () => jsonResponse({ id: "att-1", status: "IN_PROGRESS" }, 201)),
    route("GET", "/api/v1/attempts/att-1/answers", () =>
      jsonResponse({ attemptId: "att-1", status: "IN_PROGRESS", answers: [] }),
    ),
    route("PATCH", "/api/v1/attempts/att-1/answers", () => jsonResponse(undefined, 204)),
    route("POST", "/api/v1/attempts/att-1/submit", () =>
      jsonResponse({
        attemptId: "att-1",
        rawScore: 1,
        maxScore: 1,
        answers: [
          { questionId: "q1", userAnswerText: "TRUE", isCorrect: true, correctAnswer: "TRUE", explanation: null },
        ],
      }),
    ),
  ]);
});

afterEach(() => {
  push.mockClear();
  vi.unstubAllGlobals();
});

describe("AnswerScreen (S-04)", () => {
  it("loads the reading question set and its passage", async () => {
    render(<AnswerScreen questionSetId="mock-qs-reading" />);

    expect(
      await screen.findByText("The Impact of Urban Green Spaces", {}, { timeout: 2000 }),
    ).toBeInTheDocument();
  });

  it("shows a saving indicator then a saved indicator after the autosave debounce", async () => {
    const user = userEvent.setup();
    render(<AnswerScreen questionSetId="mock-qs-reading" />);

    await screen.findByText("The Impact of Urban Green Spaces", {}, { timeout: 2000 });
    const [firstTrueOption] = screen.getAllByRole("radio", { name: "TRUE" });
    await user.click(firstTrueOption);

    expect(await screen.findByText("保存中…", {}, { timeout: 500 })).toBeInTheDocument();
    expect(await screen.findByText("保存済み", {}, { timeout: 2000 })).toBeInTheDocument();
  }, 10000);

  it("submits the attempt and navigates to the result screen", async () => {
    const user = userEvent.setup();
    render(<AnswerScreen questionSetId="mock-qs-reading" />);

    await screen.findByText("The Impact of Urban Green Spaces", {}, { timeout: 2000 });
    // The passage renders as soon as the question set fetch resolves, but handleSubmit
    // is a no-op until the attempt start + saved-answers calls also resolve and
    // attemptId is set. Wait out that load chain before submitting.
    await new Promise((resolve) => setTimeout(resolve, 500));

    await user.click(screen.getByRole("button", { name: "回答を提出する" }));

    await waitFor(
      () =>
        expect(push).toHaveBeenCalledWith(
          expect.stringMatching(/^\/attempts\/att-1\/result\?questionSetId=mock-qs-reading&submittedAt=/),
        ),
      { timeout: 2000 },
    );
  }, 10000);
});
