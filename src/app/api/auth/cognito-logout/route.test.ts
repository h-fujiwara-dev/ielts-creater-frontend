import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const signOutMock = vi.fn().mockResolvedValue(undefined);

vi.mock("@/auth", () => ({ signOut: signOutMock }));

const { GET } = await import("./route");

describe("GET /api/auth/cognito-logout (#00041)", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    signOutMock.mockClear();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("clears the NextAuth session and redirects to the Cognito Hosted UI global logout endpoint", async () => {
    process.env.COGNITO_HOSTED_UI_DOMAIN = "ielts-dev.auth.ap-northeast-1.amazoncognito.com";
    process.env.COGNITO_CLIENT_ID = "client-123";

    const response = await GET(new Request("http://localhost:3000/api/auth/cognito-logout"));

    expect(signOutMock).toHaveBeenCalledWith({ redirect: false });
    expect(response.status).toBe(307);
    const location = new URL(response.headers.get("location")!);
    expect(location.origin).toBe("https://ielts-dev.auth.ap-northeast-1.amazoncognito.com");
    expect(location.pathname).toBe("/logout");
    expect(location.searchParams.get("client_id")).toBe("client-123");
    expect(location.searchParams.get("logout_uri")).toBe("http://localhost:3000/login");
  });

  it("falls back to a plain /login redirect when Cognito domain/client id are not configured", async () => {
    delete process.env.COGNITO_HOSTED_UI_DOMAIN;
    delete process.env.COGNITO_CLIENT_ID;

    const response = await GET(new Request("http://localhost:3000/api/auth/cognito-logout"));

    expect(signOutMock).toHaveBeenCalledWith({ redirect: false });
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });
});
