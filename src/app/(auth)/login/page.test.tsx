import { render, screen } from "@testing-library/react";
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
});
