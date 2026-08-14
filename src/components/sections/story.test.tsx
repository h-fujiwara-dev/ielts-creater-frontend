import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Story } from "@/components/sections/story";

describe("Story (S-01)", () => {
  it("renders the heading and CTA buttons", () => {
    render(<Story />);

    expect(
      screen.getByRole("heading", { name: "同じ問題を繰り返す時代は、終わりに。" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "無料ではじめる" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ログイン" })).toBeInTheDocument();
  });

  it("links the CTAs to /login", () => {
    render(<Story />);

    // Button renders an <a> with an explicit role="button" (nativeButton={false}), not role="link".
    expect(screen.getByRole("button", { name: "無料ではじめる" })).toHaveAttribute(
      "href",
      "/login?step=signup",
    );
    expect(screen.getByRole("button", { name: "ログイン" })).toHaveAttribute("href", "/login");
  });
});
