import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import { describe, expect, it, vi } from "vitest";

import { GuestSignInButton } from "./guest-sign-in-button";

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

describe("GuestSignInButton", () => {
  it("signs in with the guest provider and defaults callbackUrl to /dashboard", async () => {
    vi.mocked(signIn).mockResolvedValueOnce({
      error: undefined,
      code: undefined,
      status: 200,
      ok: true,
      url: null,
    });
    const user = userEvent.setup();
    render(<GuestSignInButton />);

    await user.click(screen.getByRole("button", { name: /ゲストとして始める/ }));

    expect(signIn).toHaveBeenCalledWith("guest", { callbackUrl: "/dashboard" });
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveTextContent("準備中…");
  });

  it("passes the given callbackUrl through to signIn()", async () => {
    vi.mocked(signIn).mockResolvedValueOnce({
      error: undefined,
      code: undefined,
      status: 200,
      ok: true,
      url: null,
    });
    const user = userEvent.setup();
    render(<GuestSignInButton callbackUrl="/history" />);

    await user.click(screen.getByRole("button", { name: /ゲストとして始める/ }));

    expect(signIn).toHaveBeenCalledWith("guest", { callbackUrl: "/history" });
  });

  it("re-enables the button when signIn() rejects", async () => {
    vi.mocked(signIn).mockRejectedValueOnce(new Error("network error"));
    const user = userEvent.setup();
    render(<GuestSignInButton />);

    await user.click(screen.getByRole("button", { name: /ゲストとして始める/ }));

    expect(await screen.findByRole("button", { name: /ゲストとして始める/ })).toBeEnabled();
  });
});
