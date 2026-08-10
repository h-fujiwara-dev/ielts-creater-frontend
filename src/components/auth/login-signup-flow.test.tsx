import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginSignupFlow } from "@/components/auth/login-signup-flow";
import { DEV_CONFIRMATION_CODE } from "@/lib/auth/dev-user";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as unknown as ReturnType<typeof useRouter>);
});

describe("LoginSignupFlow (S-02)", () => {
  it("starts on the login step", () => {
    render(<LoginSignupFlow />);

    expect(screen.getByRole("heading", { name: "おかえりなさい" })).toBeInTheDocument();
  });

  it("walks through signup -> confirm code -> back to login", async () => {
    const user = userEvent.setup();
    render(<LoginSignupFlow />);

    await user.click(screen.getByRole("button", { name: "こちらからサインアップ" }));
    expect(screen.getByRole("heading", { name: "アカウントを作成" })).toBeInTheDocument();

    await user.type(screen.getByLabelText("メールアドレス"), "new-user@example.com");
    await user.type(screen.getByLabelText("パスワード"), "DevPass123");
    await user.click(screen.getByRole("button", { name: "サインアップ" }));

    expect(await screen.findByRole("heading", { name: "確認コードを入力" })).toBeInTheDocument();
    expect(screen.getByText("new-user@example.com")).toBeInTheDocument();

    await user.type(screen.getByLabelText("確認コード"), DEV_CONFIRMATION_CODE);
    await user.click(screen.getByRole("button", { name: "確認する" }));

    expect(await screen.findByRole("heading", { name: "おかえりなさい" })).toBeInTheDocument();
  });
});
