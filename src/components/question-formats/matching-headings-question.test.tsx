import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MatchingHeadingsQuestion } from "./matching-headings-question";
import type { Question } from "@/lib/question-sets/types";

const question: Question = {
  id: "q1",
  promptText: "Paragraph A",
  displayOrder: 4,
  options: [
    { label: "h1", text: "Introduction" },
    { label: "h2", text: "Conclusion" },
  ],
};

describe("MatchingHeadingsQuestion", () => {
  it("shows the placeholder when nothing is selected yet", () => {
    render(<MatchingHeadingsQuestion question={question} value="" onChange={vi.fn()} />);

    expect(screen.getByText(/4\. Paragraph A/)).toBeInTheDocument();
    expect(screen.getByText("見出しを選択してください")).toBeInTheDocument();
  });

  it("resolves the selected label to its display text, not the raw label", () => {
    render(<MatchingHeadingsQuestion question={question} value="h2" onChange={vi.fn()} />);

    expect(screen.getByText("Conclusion")).toBeInTheDocument();
    expect(screen.queryByText("h2")).not.toBeInTheDocument();
  });

  it("falls back to the raw value if it does not match any known option", () => {
    render(<MatchingHeadingsQuestion question={question} value="h9" onChange={vi.fn()} />);

    expect(screen.getByText("h9")).toBeInTheDocument();
  });

  it("calls onChange with the option label when an option is picked from the dropdown", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<MatchingHeadingsQuestion question={question} value="" onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Introduction" }));

    expect(onChange).toHaveBeenCalledWith("h1");
  });
});
