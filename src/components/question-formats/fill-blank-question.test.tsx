import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FillBlankQuestion } from "./fill-blank-question";
import type { Question } from "@/lib/question-sets/types";

const question: Question = {
  id: "q1",
  promptText: "The capital of France is ______.",
  displayOrder: 2,
};

describe("FillBlankQuestion", () => {
  it("renders the text before and after the blank around the input", () => {
    render(<FillBlankQuestion question={question} value="" onChange={vi.fn()} />);

    expect(screen.getByText(/2\. The capital of France is/)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("calls onChange with the typed value", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<FillBlankQuestion question={question} value="" onChange={onChange} />);

    await user.type(screen.getByRole("textbox"), "Paris");

    expect(onChange).toHaveBeenLastCalledWith("s");
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it("reflects the given value in the input", () => {
    render(<FillBlankQuestion question={question} value="Paris" onChange={vi.fn()} />);

    expect(screen.getByRole("textbox")).toHaveValue("Paris");
  });

  it("renders without an input suffix when the prompt has no blank marker", () => {
    const noBlank: Question = { ...question, promptText: "No blank marker here." };
    render(<FillBlankQuestion question={noBlank} value="" onChange={vi.fn()} />);

    expect(screen.getByText(/No blank marker here\./)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
