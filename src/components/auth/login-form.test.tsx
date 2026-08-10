import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/components/auth/login-form";
import { DEV_USER_EMAIL, DEV_USER_PASSWORD } from "@/lib/auth/dev-user";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

const push = vi.fn();

beforeEach(() => {
  vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
});

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup();
  if (email) await user.type(screen.getByLabelText("メールアドレス"), email);
  if (password) await user.type(screen.getByLabelText("パスワード"), password);
  await user.click(screen.getByRole("button", { name: "ログイン" }));
  return user;
}

describe("LoginForm (S-02)", () => {
  it("shows validation errors when submitted empty", async () => {
    render(<LoginForm onSwitchToSignup={vi.fn()} />);

    await fillAndSubmit("", "");

    expect(await screen.findByText("メールアドレスを入力してください")).toBeInTheDocument();
    expect(screen.getByText("パスワードを入力してください")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("redirects to /dashboard on correct dev credentials", async () => {
    render(<LoginForm onSwitchToSignup={vi.fn()} />);

    await fillAndSubmit(DEV_USER_EMAIL, DEV_USER_PASSWORD);

    expect(push).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an auth error alert on wrong credentials", async () => {
    render(<LoginForm onSwitchToSignup={vi.fn()} />);

    await fillAndSubmit(DEV_USER_EMAIL, "WrongPass123");

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("メールアドレスまたはパスワードが正しくありません");
    expect(push).not.toHaveBeenCalled();
  });

  it("calls onSwitchToSignup when the signup link is clicked", async () => {
    const onSwitchToSignup = vi.fn();
    const user = userEvent.setup();
    render(<LoginForm onSwitchToSignup={onSwitchToSignup} />);

    await user.click(screen.getByRole("button", { name: "こちらからサインアップ" }));

    expect(onSwitchToSignup).toHaveBeenCalledTimes(1);
  });
});
