import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResultScreen } from "@/components/result/result-screen";

describe("ResultScreen (S-05)", () => {
  it("shows a loading spinner before all three requests resolve", () => {
    const { container } = render(<ResultScreen attemptId="att-mock-qs-reading" />);

    expect(screen.queryByRole("heading", { name: "結果" })).not.toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders the score summary and per-question results once loaded", async () => {
    render(<ResultScreen attemptId="att-mock-qs-reading" />);

    expect(await screen.findByRole("heading", { name: "結果" }, { timeout: 2000 })).toBeInTheDocument();
    // CardTitle renders a styled <div>, not a heading element, so match by text.
    expect(screen.getByText("設問ごとの結果")).toBeInTheDocument();
    // mock-qs-reading has 7 graded questions (q1-q7); each renders its prompt text.
    expect(
      screen.getByText("Urban parks reduce average city temperatures."),
    ).toBeInTheDocument();
  });
});
