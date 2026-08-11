import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import { describe, expect, it, vi } from "vitest";

import LoginPage from "./page";

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

describe("LoginPage (S-02)", () => {
  it("renders the Cognito sign-in trigger", async () => {
    render(await LoginPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("heading", { name: "おかえりなさい" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cognitoでログイン/ })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows an error alert when redirected back with an error query param", async () => {
    render(await LoginPage({ searchParams: Promise.resolve({ error: "OAuthCallback" }) }));

    expect(screen.getByRole("alert")).toHaveTextContent("ログインに失敗しました");
  });

  it("forwards a same-origin callbackUrl query param to signIn() (#00040)", async () => {
    vi.mocked(signIn).mockResolvedValueOnce({
      error: undefined,
      code: undefined,
      status: 200,
      ok: true,
      url: null,
    });
    const user = userEvent.setup();
    render(await LoginPage({ searchParams: Promise.resolve({ callbackUrl: "/history" }) }));

    await user.click(screen.getByRole("button", { name: /Cognitoでログイン/ }));

    expect(signIn).toHaveBeenCalledWith("cognito", { callbackUrl: "/history" });
  });

  it("falls back to /dashboard when the callbackUrl query param points off-site (#00040)", async () => {
    vi.mocked(signIn).mockResolvedValueOnce({
      error: undefined,
      code: undefined,
      status: 200,
      ok: true,
      url: null,
    });
    const user = userEvent.setup();
    render(
      await LoginPage({
        searchParams: Promise.resolve({ callbackUrl: "https://evil.example.com" }),
      })
    );

    await user.click(screen.getByRole("button", { name: /Cognitoでログイン/ }));

    expect(signIn).toHaveBeenCalledWith("cognito", { callbackUrl: "/dashboard" });
  });
});
