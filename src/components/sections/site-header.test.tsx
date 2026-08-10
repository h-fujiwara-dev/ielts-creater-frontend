import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/sections/site-header";

describe("SiteHeader (S-01)", () => {
  it("links the desktop login/signup CTAs to /login", () => {
    render(<SiteHeader />);

    // Button renders an <a> with an explicit role="button" (nativeButton={false}), not role="link".
    const loginCtas = screen.getAllByRole("button", { name: "ログイン" });
    const signupCtas = screen.getAllByRole("button", { name: "無料ではじめる" });

    expect(loginCtas[0]).toHaveAttribute("href", "/login");
    expect(signupCtas[0]).toHaveAttribute("href", "/login");
  });

  it("toggles the mobile menu open and closed", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const toggle = screen.getByRole("button", { name: "メニューを開く" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(screen.getByRole("button", { name: "メニューを閉じる" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });
});
