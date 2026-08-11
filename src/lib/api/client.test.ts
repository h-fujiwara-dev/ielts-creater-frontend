import { getSession } from "next-auth/react";
import { describe, expect, it, vi } from "vitest";

import { apiGet } from "./client";

vi.mock("next-auth/react", () => ({
  getSession: vi.fn(),
}));

const mockGetSession = vi.mocked(getSession);

function mockFetchOnce() {
  return vi
    .spyOn(global, "fetch")
    .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
}

describe("apiGet", () => {
  it("attaches the Bearer token from the current session", async () => {
    mockGetSession.mockResolvedValue({ accessToken: "token-abc" } as never);
    const fetchMock = mockFetchOnce();

    await apiGet("/api/v1/me");

    const init = fetchMock.mock.calls[0][1];
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer token-abc");
  });

  it("omits the Authorization header when there is no session", async () => {
    mockGetSession.mockResolvedValue(null);
    const fetchMock = mockFetchOnce();

    await apiGet("/api/v1/me");

    const init = fetchMock.mock.calls[0][1];
    expect((init?.headers as Record<string, string>).Authorization).toBeUndefined();
  });
});
