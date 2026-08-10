import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AnswerScreen } from "@/components/answer/answer-screen";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

const push = vi.fn();

beforeEach(() => {
  vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
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
    // Multiple TFNG questions each expose a "TRUE" option; answer the first one (q1).
    const [firstTrueOption] = screen.getAllByRole("radio", { name: "TRUE" });
    await user.click(firstTrueOption);

    expect(await screen.findByText("保存中…", {}, { timeout: 500 })).toBeInTheDocument();
    expect(await screen.findByText("保存済み", {}, { timeout: 2000 })).toBeInTheDocument();
  }, 10000);

  it("submits the attempt and navigates to the result screen", async () => {
    const user = userEvent.setup();
    render(<AnswerScreen questionSetId="mock-qs-reading" />);

    await screen.findByText("The Impact of Urban Green Spaces", {}, { timeout: 2000 });
    // The passage renders as soon as mockGetQuestionSet resolves (~200ms), but
    // handleSubmit is a no-op until mockStartAttempt + mockGetSavedAnswers also
    // resolve (~500ms more) and attemptId is set. Wait out that load chain before
    // submitting so the click isn't silently swallowed.
    await new Promise((resolve) => setTimeout(resolve, 800));

    await user.click(screen.getByRole("button", { name: "回答を提出する" }));

    await waitFor(
      () => expect(push).toHaveBeenCalledWith("/attempts/att-mock-qs-reading/result"),
      { timeout: 2000 },
    );
  }, 10000);
});
