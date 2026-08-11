import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CtaBand } from "@/components/sections/cta-band";

describe("CtaBand (S-01)", () => {
  it("renders the heading and CTA buttons", () => {
    render(<CtaBand />);

    expect(
      screen.getByRole("heading", { name: "今すぐ無料でIELTS対策を始めよう" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "無料ではじめる" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ログイン" })).toBeInTheDocument();
  });

  it("links the CTAs to /login", () => {
    render(<CtaBand />);

    // Button renders an <a> with an explicit role="button" (nativeButton={false}), not role="link".
    expect(screen.getByRole("button", { name: "無料ではじめる" })).toHaveAttribute(
      "href",
      "/login?step=signup",
    );
    expect(screen.getByRole("button", { name: "ログイン" })).toHaveAttribute("href", "/login");
  });
});
