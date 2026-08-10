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
});
