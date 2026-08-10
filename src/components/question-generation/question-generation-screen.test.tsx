import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter, useSearchParams } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { QuestionGenerationScreen } from "@/components/question-generation/question-generation-screen";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

const push = vi.fn();

function asSearchParams(params: URLSearchParams): ReturnType<typeof useSearchParams> {
  return params as unknown as ReturnType<typeof useSearchParams>;
}

beforeEach(() => {
  vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
  vi.mocked(useSearchParams).mockReturnValue(asSearchParams(new URLSearchParams()));
});

afterEach(() => {
  vi.useRealTimers();
});

// Only Date is ever faked here (never setTimeout/setInterval): faking those makes
// userEvent clicks hang in this jsdom/React 19 setup, because React's scheduler
// falls back to setTimeout for flushing updates queued outside a synchronous event
// handler. Jumping Date forward is enough to make the mock's elapsed-time check
// (Date.now() - job.startedAt >= durationMs) report the generation window as over
// on the next real poll tick, without touching timer scheduling at all.
function jumpPastGenerationWindow() {
  vi.useFakeTimers({ toFake: ["Date"], now: Date.now() + 10_000 });
}

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

    jumpPastGenerationWindow();

    await waitFor(
      () => expect(push).toHaveBeenCalledWith(expect.stringMatching(/^\/practice\//)),
      { timeout: 3000 },
    );
  }, 10000);

  it("shows the failed state and supports retry when the topic triggers a deterministic failure", async () => {
    const user = userEvent.setup();
    render(<QuestionGenerationScreen />);

    const topicInput = screen.getByPlaceholderText(/自由入力/);
    await user.clear(topicInput);
    await user.type(topicInput, "please fail");
    await user.click(screen.getByRole("button", { name: "問題を生成する" }));
    await screen.findByText(/Reading問題を生成しています/, {}, { timeout: 2000 });

    jumpPastGenerationWindow();

    expect(
      await screen.findByText("問題の生成に失敗しました", {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();

    vi.useRealTimers();
    await user.click(screen.getByRole("button", { name: "同じ条件で再生成する" }));

    expect(await screen.findByText(/Reading問題を生成しています/, {}, { timeout: 2000 })).toBeInTheDocument();
  }, 10000);
});
