import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TfngQuestion } from "./tfng-question";
import type { Question } from "@/lib/question-sets/types";

const question: Question = {
  id: "q1",
  promptText: "The Eiffel Tower is in Paris.",
  displayOrder: 3,
};

describe("TfngQuestion", () => {
  it("renders the prompt with its display order and the three TFNG options", () => {
    render(<TfngQuestion question={question} value="" onChange={vi.fn()} />);

    expect(screen.getByText(/3\. The Eiffel Tower is in Paris\./)).toBeInTheDocument();
    expect(screen.getByText("TRUE")).toBeInTheDocument();
    expect(screen.getByText("FALSE")).toBeInTheDocument();
    expect(screen.getByText("NOT GIVEN")).toBeInTheDocument();
  });

  it("calls onChange with the selected option value", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TfngQuestion question={question} value="" onChange={onChange} />);

    await user.click(screen.getByText("NOT GIVEN"));

    // base-ui's RadioGroup passes a second eventDetails argument to onValueChange
    // that this component's onChange prop type does not declare; only the value matters here.
    expect(onChange.mock.calls[0]?.[0]).toBe("NOT_GIVEN");
  });
});
