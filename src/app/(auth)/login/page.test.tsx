import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LoginPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as unknown as ReturnType<typeof useRouter>);
});

describe("LoginPage (S-02)", () => {
  it("defaults to the login step when no step query param is given", async () => {
    render(await LoginPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("heading", { name: "おかえりなさい" })).toBeInTheDocument();
  });

  it("starts on the signup step when step=signup is given", async () => {
    render(await LoginPage({ searchParams: Promise.resolve({ step: "signup" }) }));

    expect(screen.getByRole("heading", { name: "アカウントを作成" })).toBeInTheDocument();
  });

  it("falls back to the login step for an unknown step value", async () => {
    render(await LoginPage({ searchParams: Promise.resolve({ step: "bogus" }) }));

    expect(screen.getByRole("heading", { name: "おかえりなさい" })).toBeInTheDocument();
  });
});
