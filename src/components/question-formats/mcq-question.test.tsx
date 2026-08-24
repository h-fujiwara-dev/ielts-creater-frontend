import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { McqQuestion } from "./mcq-question";
import type { Question } from "@/lib/question-sets/types";

const question: Question = {
  id: "q1",
  promptText: "What is the capital of France?",
  displayOrder: 1,
  options: [
    { label: "A", text: "Paris" },
    { label: "B", text: "London" },
  ],
};

describe("McqQuestion", () => {
  it("renders the prompt with its display order and all options", () => {
    render(<McqQuestion question={question} value="" onChange={vi.fn()} />);

    expect(screen.getByText(/1\. What is the capital of France\?/)).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
  });

  it("calls onChange with the option label when an option is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<McqQuestion question={question} value="" onChange={onChange} />);

    await user.click(screen.getByText("Paris"));

    // base-ui's RadioGroup passes a second eventDetails argument to onValueChange
    // that this component's onChange prop type does not declare; only the value matters here.
    expect(onChange.mock.calls[0]?.[0]).toBe("A");
  });

  it("renders no options when the question has none", () => {
    const noOptions: Question = { ...question, options: undefined };
    render(<McqQuestion question={noOptions} value="" onChange={vi.fn()} />);

    expect(screen.queryAllByRole("radio")).toHaveLength(0);
  });
});
