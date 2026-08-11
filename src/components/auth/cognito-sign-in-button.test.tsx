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
    const user = userEvent.setup();
    render(<CognitoSignInButton />);

    await user.click(screen.getByRole("button", { name: /Cognitoでログイン/ }));

    expect(signIn).toHaveBeenCalledWith("cognito", { callbackUrl: "/dashboard" });
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
