import { getSession } from "next-auth/react";
import { describe, expect, it, vi } from "vitest";

import { apiGet, apiGetBlob } from "./client";

vi.mock("next-auth/react", () => ({
  getSession: vi.fn(),
}));

const mockGetSession = vi.mocked(getSession);

function mockFetchOnce() {
  // Responseのbodyはストリームで一度しか読めないため、同時に複数回fetchが呼ばれても
  // 衝突しないよう呼び出しごとに新しいインスタンスを返す。
  return vi
    .spyOn(global, "fetch")
    .mockImplementation(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
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

  it("dedupes getSession() across concurrent requests (#00042)", async () => {
    let resolveSession!: (value: { accessToken: string }) => void;
    mockGetSession.mockReturnValue(
      new Promise((resolve) => {
        resolveSession = resolve;
      }) as never
    );
    mockFetchOnce();

    const first = apiGet("/api/v1/me");
    const second = apiGet("/api/v1/other");
    resolveSession({ accessToken: "token-abc" });
    await Promise.all([first, second]);

    expect(mockGetSession).toHaveBeenCalledTimes(1);
  });

  it("fetches a fresh session for requests that don't overlap in time (#00042)", async () => {
    mockGetSession.mockResolvedValue({ accessToken: "token-1" } as never);
    mockFetchOnce();
    await apiGet("/api/v1/me");

    mockGetSession.mockResolvedValue({ accessToken: "token-2" } as never);
    mockFetchOnce();
    await apiGet("/api/v1/me");

    expect(mockGetSession).toHaveBeenCalledTimes(2);
  });
});

describe("apiGetBlob", () => {
  it("attaches the Bearer token and returns the response body as a Blob (#00054)", async () => {
    mockGetSession.mockResolvedValue({ accessToken: "token-abc" } as never);
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockImplementation(async () => new Response(new Blob(["audio-bytes"]), { status: 200 }));

    const blob = await apiGetBlob("/api/v1/question-sets/1/audio-segments/1/file");

    const init = fetchMock.mock.calls[0][1];
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer token-abc");
    expect(blob).toBeInstanceOf(Blob);
  });

  it("throws ApiError when the response is not ok", async () => {
    mockGetSession.mockResolvedValue(null);
    vi.spyOn(global, "fetch").mockImplementation(
      async () =>
        new Response(JSON.stringify({ error: "NOT_FOUND", message: "not found" }), {
          status: 404,
        })
    );

    await expect(apiGetBlob("/api/v1/question-sets/1/audio-segments/1/file")).rejects.toThrow();
  });
});
