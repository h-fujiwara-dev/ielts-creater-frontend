import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TermsPage from "./page";

describe("TermsPage (S-09)", () => {
  it("renders the title and enactment/revision dates", () => {
    render(<TermsPage />);

    expect(screen.getByRole("heading", { level: 1, name: "利用規約" })).toBeInTheDocument();
    expect(screen.getByText(/制定日: 2026-08-09/)).toBeInTheDocument();
  });

  it("links to the privacy page and back to Top", () => {
    render(<TermsPage />);

    // The footer also carries a "プライバシーポリシー" nav link, so scope to the crossLink area within <main>.
    const main = within(screen.getByRole("main"));
    expect(main.getByRole("link", { name: "プライバシーポリシー" })).toHaveAttribute("href", "/privacy");
    expect(main.getByRole("link", { name: "Topへ戻る" })).toHaveAttribute("href", "/");
  });
});
