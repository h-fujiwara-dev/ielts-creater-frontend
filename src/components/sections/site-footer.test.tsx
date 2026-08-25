import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "@/components/sections/site-footer";

describe("SiteFooter (S-01)", () => {
  it("links the legal pages", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: "プライバシーポリシー" })).toHaveAttribute(
      "href",
      "/privacy",
    );
    expect(screen.getByRole("link", { name: "利用規約" })).toHaveAttribute("href", "/terms");
  });

  it("links the top page sections with a root-absolute path so navigation works from other pages", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: "特長" })).toHaveAttribute("href", "/#features");
    expect(screen.getByRole("link", { name: "使い方" })).toHaveAttribute("href", "/#how-it-works");
    expect(screen.getByRole("link", { name: "出題形式" })).toHaveAttribute("href", "/#formats");
  });

  it("does not render dangling social icon buttons with no href (no external URLs exist yet)", () => {
    render(<SiteFooter />);

    expect(screen.queryByRole("button", { name: "公式サイト" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "コミュニティ" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "フィード" })).not.toBeInTheDocument();
  });
});
