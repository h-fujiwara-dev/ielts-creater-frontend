import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PrivacyPage from "./page";

describe("PrivacyPage (S-08)", () => {
  it("renders the title and enactment/revision dates", () => {
    render(<PrivacyPage />);

    expect(screen.getByRole("heading", { level: 1, name: "プライバシーポリシー" })).toBeInTheDocument();
    expect(screen.getByText(/制定日: 2026-08-09/)).toBeInTheDocument();
  });

  it("links to the terms page and back to Top", () => {
    render(<PrivacyPage />);

    // The footer also carries a "利用規約" nav link, so scope to the crossLink area within <main>.
    const main = within(screen.getByRole("main"));
    expect(main.getByRole("link", { name: "利用規約" })).toHaveAttribute("href", "/terms");
    expect(main.getByRole("link", { name: "Topへ戻る" })).toHaveAttribute("href", "/");
  });
});
