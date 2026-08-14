import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Hero } from "@/components/sections/hero";

describe("Hero (S-01)", () => {
  it("renders the main heading and CTA buttons without throwing", () => {
    render(<Hero />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("解いた分だけ、");
    expect(heading).toHaveTextContent("新しい問題に出会える。");

    expect(screen.getByRole("button", { name: "無料ではじめる" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ログイン" })).toBeInTheDocument();
  });

  it("links the CTAs to /login", () => {
    render(<Hero />);

    // Button renders an <a> with an explicit role="button" (nativeButton={false}), not role="link".
    expect(screen.getByRole("button", { name: "無料ではじめる" })).toHaveAttribute(
      "href",
      "/login?step=signup",
    );
    expect(screen.getByRole("button", { name: "ログイン" })).toHaveAttribute("href", "/login");
  });
});
