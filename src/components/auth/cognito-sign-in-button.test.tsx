import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import { describe, expect, it, vi } from "vitest";

import { CognitoSignInButton } from "./cognito-sign-in-button";

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

describe("CognitoSignInButton", () => {
  it("redirects to the Cognito Hosted UI on click", async () => {
    vi.mocked(signIn).mockResolvedValueOnce({
      error: undefined,
      code: undefined,
      status: 200,
      ok: true,
      url: null,
    });
    const user = userEvent.setup();
    render(<CognitoSignInButton />);

    await user.click(screen.getByRole("button", { name: /Cognitoでログイン/ }));

    expect(signIn).toHaveBeenCalledWith("cognito", { callbackUrl: "/dashboard" });
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("re-enables the button when signIn() rejects before redirecting (#00039)", async () => {
    vi.mocked(signIn).mockRejectedValueOnce(new Error("network error"));
    const user = userEvent.setup();
    render(<CognitoSignInButton />);

    await user.click(screen.getByRole("button", { name: /Cognitoでログイン/ }));

    expect(await screen.findByRole("button", { name: /Cognitoでログイン/ })).toBeEnabled();
  });
});
