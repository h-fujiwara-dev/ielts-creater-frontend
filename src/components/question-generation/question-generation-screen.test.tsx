import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter, useSearchParams } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { QuestionGenerationScreen } from "@/components/question-generation/question-generation-screen";
import { jsonResponse, route, stubFetchRoutes } from "@/test/fetch-mock";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

const push = vi.fn();

function asSearchParams(params: URLSearchParams): ReturnType<typeof useSearchParams> {
  return params as unknown as ReturnType<typeof useSearchParams>;
}

function questionSetDetail(status: "GENERATING" | "READY" | "FAILED") {
  return {
    id: "qs-1",
    section: "READING",
    topic: "Environment",
    difficulty: "BAND_6_7",
    status,
    passage: status === "READY" ? { title: "T", paragraphs: [] } : null,
    listeningContext: null,
    questionGroups: [],
  };
}

beforeEach(() => {
  vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
  vi.mocked(useSearchParams).mockReturnValue(asSearchParams(new URLSearchParams()));

  stubFetchRoutes([
    route("POST", "/api/v1/question-sets", () =>
      jsonResponse({ id: "qs-1", status: "GENERATING", topic: "Environment" }),
    ),
    // 1回目のポーリングはGENERATING、2回目以降はREADYを返し、実際のポーリング挙動を再現する。
    route("GET", "/api/v1/question-sets/qs-1", (_url, _init, callIndex) =>
      jsonResponse(questionSetDetail(callIndex === 0 ? "GENERATING" : "READY")),
    ),
  ]);
});

afterEach(() => {
  push.mockClear();
  vi.unstubAllGlobals();
});

describe("QuestionGenerationScreen (S-03)", () => {
  it("prefills the form from search params", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      asSearchParams(new URLSearchParams({ section: "LISTENING", difficulty: "BAND_7_8_PLUS", topic: "Space" })),
    );

    render(<QuestionGenerationScreen />);

    expect(screen.getByRole("radio", { name: /Band 7-8\+/ })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByPlaceholderText(/自由入力/)).toHaveValue("Space");
  });

  it("moves from the form to the generating state after submit", async () => {
    const user = userEvent.setup();
    render(<QuestionGenerationScreen />);

    await user.click(screen.getByRole("button", { name: "問題を生成する" }));

    expect(await screen.findByText(/Reading問題を生成しています/, {}, { timeout: 2000 })).toBeInTheDocument();
  });

  it("navigates to the practice screen once generation succeeds", async () => {
    const user = userEvent.setup();
    render(<QuestionGenerationScreen />);

    await user.click(screen.getByRole("button", { name: "問題を生成する" }));
    await screen.findByText(/Reading問題を生成しています/, {}, { timeout: 2000 });

    await waitFor(() => expect(push).toHaveBeenCalledWith("/practice/qs-1"), { timeout: 3000 });
  }, 10000);

  it("shows the failed state and supports retry after a failed generation", async () => {
    // Retry re-POSTs and gets a fresh id, so each round's poll independently starts at
    // GENERATING (callIndex 0) before flipping to FAILED — mirrors the READY case above,
    // and avoids the two rounds racing over a single shared call counter.
    stubFetchRoutes([
      route("POST", "/api/v1/question-sets", (_url, _init, callIndex) =>
        jsonResponse({ id: `qs-fail-${callIndex}`, status: "GENERATING", topic: "Environment" }),
      ),
      route("GET", "/api/v1/question-sets/qs-fail-0", (_url, _init, callIndex) =>
        jsonResponse(questionSetDetail(callIndex === 0 ? "GENERATING" : "FAILED")),
      ),
      route("GET", "/api/v1/question-sets/qs-fail-1", (_url, _init, callIndex) =>
        jsonResponse(questionSetDetail(callIndex === 0 ? "GENERATING" : "FAILED")),
      ),
    ]);

    const user = userEvent.setup();
    render(<QuestionGenerationScreen />);

    await user.click(screen.getByRole("button", { name: "問題を生成する" }));
    await screen.findByText(/Reading問題を生成しています/, {}, { timeout: 2000 });

    expect(
      await screen.findByText("問題の生成に失敗しました", {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "同じ条件で再生成する" }));

    expect(await screen.findByText(/Reading問題を生成しています/, {}, { timeout: 2000 })).toBeInTheDocument();
  }, 10000);
});
