import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SignupForm } from "@/components/auth/signup-form";

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup();
  if (email) await user.type(screen.getByLabelText("メールアドレス"), email);
  if (password) await user.type(screen.getByLabelText("パスワード"), password);
  await user.click(screen.getByRole("button", { name: "サインアップ" }));
  return user;
}

describe("SignupForm (S-02)", () => {
  it("shows a validation error for a password missing required character classes", async () => {
    const onSignupSuccess = vi.fn();
    render(<SignupForm onSwitchToLogin={vi.fn()} onSignupSuccess={onSignupSuccess} />);

    await fillAndSubmit("dev@example.com", "alllowercase1");

    expect(await screen.findByText("英大文字を含めてください")).toBeInTheDocument();
    expect(onSignupSuccess).not.toHaveBeenCalled();
  });

  it("calls onSignupSuccess with the entered email once the form is valid", async () => {
    const onSignupSuccess = vi.fn();
    render(<SignupForm onSwitchToLogin={vi.fn()} onSignupSuccess={onSignupSuccess} />);

    await fillAndSubmit("new-user@example.com", "DevPass123");

    expect(onSignupSuccess).toHaveBeenCalledWith("new-user@example.com");
  });

  it("calls onSwitchToLogin when the login link is clicked", async () => {
    const onSwitchToLogin = vi.fn();
    const user = userEvent.setup();
    render(<SignupForm onSwitchToLogin={onSwitchToLogin} onSignupSuccess={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "こちらからログイン" }));

    expect(onSwitchToLogin).toHaveBeenCalledTimes(1);
  });
});
