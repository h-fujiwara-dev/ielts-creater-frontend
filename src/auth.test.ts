import { describe, expect, it, vi } from "vitest";

const nextAuthMock = vi.fn(() => ({
  handlers: {},
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("next-auth", () => ({ default: nextAuthMock }));
vi.mock("next-auth/providers/cognito", () => ({ default: vi.fn(() => ({ id: "cognito" })) }));

describe("auth config (#00039)", () => {
  it("routes NextAuth's sign-in/error redirects to /login so AuthAlert is reachable", async () => {
    await import("./auth");

    expect(nextAuthMock).toHaveBeenCalledWith(
      expect.objectContaining({
        pages: expect.objectContaining({ signIn: "/login", error: "/login" }),
      })
    );
  });
});
