import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { jsonResponse, route, stubFetchRoutes } from "@/test/fetch-mock";

interface FakeToken {
  accessToken?: string;
  idToken?: string;
  appUserId?: string;
  appUserEmail?: string;
  appUserDisplayName?: string;
  appUserIsGuest?: boolean;
  appUserFetchAttemptedAt?: number;
  email?: string;
  name?: string;
}

interface FakeSession {
  accessToken?: string;
  idToken?: string;
  user: {
    id?: string;
    email?: string;
    displayName?: string;
    isGuest?: boolean;
  };
}

interface CapturedAuthConfig {
  // next-auth's real Credentials() factory (unmocked here) does not merge the given config
  // into the returned provider directly; it stashes it under `options` and normalizes it
  // internally at NextAuth init time, which we bypass by mocking NextAuth itself.
  providers: Array<{
    id?: string;
    options?: {
      id?: string;
      authorize?: () => Promise<{ id: string; accessToken?: string; idToken?: string } | null>;
    };
  }>;
  callbacks: {
    jwt: (args: {
      token: FakeToken;
      account?: { access_token?: string; id_token?: string } | null;
      user?: { accessToken?: string; idToken?: string };
    }) => Promise<FakeToken>;
    session: (args: { session: FakeSession; token: FakeToken }) => Promise<FakeSession>;
  };
}

const nextAuthMock = vi.fn<(config: unknown) => Record<string, unknown>>(() => ({
  handlers: {},
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("next-auth", () => ({ default: nextAuthMock }));
vi.mock("next-auth/providers/cognito", () => ({ default: vi.fn(() => ({ id: "cognito" })) }));

beforeEach(() => {
  delete process.env.BACKEND_API_ORIGIN;
});

async function loadAuthConfig(): Promise<CapturedAuthConfig> {
  vi.resetModules();
  nextAuthMock.mockClear();
  await import("./auth");
  return nextAuthMock.mock.calls[0][0] as CapturedAuthConfig;
}

describe("auth config (#00039)", () => {
  it("routes NextAuth's sign-in/error redirects to /login so AuthAlert is reachable", async () => {
    const config = await loadAuthConfig();

    expect(config).toEqual(
      expect.objectContaining({
        pages: expect.objectContaining({ signIn: "/login", error: "/login" }),
      })
    );
  });
});

describe("jwt callback (#00038 / #00056)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("takes the accessToken/idToken from the Cognito account on OAuth sign-in", async () => {
    const { callbacks } = await loadAuthConfig();
    stubFetchRoutes([
      route("GET", "http://localhost:8080/api/v1/me", () =>
        jsonResponse({ id: "u1", email: "a@example.com", displayName: "A", isGuest: false })
      ),
    ]);

    const token = await callbacks.jwt({
      token: {},
      account: { access_token: "cognito-access", id_token: "cognito-id" },
    });

    expect(token.accessToken).toBe("cognito-access");
    expect(token.idToken).toBe("cognito-id");
  });

  it("takes the accessToken/idToken from the Credentials user on guest sign-in (#00056)", async () => {
    const { callbacks } = await loadAuthConfig();
    stubFetchRoutes([
      route("GET", "http://localhost:8080/api/v1/me", () =>
        jsonResponse({ id: "guest-1", email: "guest@example.com", displayName: "Guest", isGuest: true })
      ),
    ]);

    const token = await callbacks.jwt({
      token: {},
      account: null,
      user: { accessToken: "guest-access", idToken: "guest-id" },
    });

    expect(token.accessToken).toBe("guest-access");
    expect(token.idToken).toBe("guest-id");
  });

  it("populates appUserId/email/displayName/isGuest from GET /api/v1/me on first sign-in", async () => {
    const { callbacks } = await loadAuthConfig();
    stubFetchRoutes([
      route("GET", "http://localhost:8080/api/v1/me", () =>
        jsonResponse({ id: "u1", email: "a@example.com", displayName: "Alice", isGuest: false })
      ),
    ]);

    const token = await callbacks.jwt({
      token: {},
      account: { access_token: "cognito-access" },
    });

    expect(token.appUserId).toBe("u1");
    expect(token.appUserEmail).toBe("a@example.com");
    expect(token.appUserDisplayName).toBe("Alice");
    expect(token.appUserIsGuest).toBe(false);
  });

  it("does not call GET /api/v1/me again within the retry cooldown after a prior failure", async () => {
    const { callbacks } = await loadAuthConfig();
    const fetchMock = stubFetchRoutes([]);
    vi.spyOn(Date, "now").mockReturnValue(1_000_000);

    const token = await callbacks.jwt({
      token: { accessToken: "token-a", appUserFetchAttemptedAt: 1_000_000 - 5_000 },
      account: null,
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(token.appUserId).toBeUndefined();
  });

  it("retries GET /api/v1/me once the retry cooldown has elapsed", async () => {
    const { callbacks } = await loadAuthConfig();
    stubFetchRoutes([
      route("GET", "http://localhost:8080/api/v1/me", () =>
        jsonResponse({ id: "u1", email: "a@example.com", displayName: "Alice", isGuest: false })
      ),
    ]);
    vi.spyOn(Date, "now").mockReturnValue(1_000_000);

    const token = await callbacks.jwt({
      token: { accessToken: "token-a", appUserFetchAttemptedAt: 1_000_000 - 31_000 },
      account: null,
    });

    expect(token.appUserId).toBe("u1");
  });

  it("leaves appUserId unset when GET /api/v1/me fails with a network error", async () => {
    const { callbacks } = await loadAuthConfig();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("network error")))
    );

    const token = await callbacks.jwt({
      token: {},
      account: { access_token: "cognito-access" },
    });

    expect(token.appUserId).toBeUndefined();
    expect(token.accessToken).toBe("cognito-access");
  });

  it("leaves appUserId unset when GET /api/v1/me returns a non-2xx status", async () => {
    const { callbacks } = await loadAuthConfig();
    stubFetchRoutes([
      route("GET", "http://localhost:8080/api/v1/me", () => jsonResponse({}, 500)),
    ]);

    const token = await callbacks.jwt({
      token: {},
      account: { access_token: "cognito-access" },
    });

    expect(token.appUserId).toBeUndefined();
  });

  it("leaves appUserId unset when GET /api/v1/me returns an unexpected shape", async () => {
    const { callbacks } = await loadAuthConfig();
    stubFetchRoutes([
      route("GET", "http://localhost:8080/api/v1/me", () => jsonResponse({ unexpected: true })),
    ]);

    const token = await callbacks.jwt({
      token: {},
      account: { access_token: "cognito-access" },
    });

    expect(token.appUserId).toBeUndefined();
  });
});

describe("session callback (#00038)", () => {
  it("copies appUserId/email/displayName/isGuest onto the session once resolved", async () => {
    const { callbacks } = await loadAuthConfig();

    const session = await callbacks.session({
      session: { user: {} },
      token: {
        accessToken: "token-a",
        idToken: "id-a",
        appUserId: "u1",
        appUserEmail: "a@example.com",
        appUserDisplayName: "Alice",
        appUserIsGuest: true,
      },
    });

    expect(session.user).toEqual({
      id: "u1",
      email: "a@example.com",
      displayName: "Alice",
      isGuest: true,
    });
    expect(session.accessToken).toBe("token-a");
  });

  it("falls back to the OIDC email/name claims when GET /api/v1/me has not populated app user fields", async () => {
    const { callbacks } = await loadAuthConfig();

    const session = await callbacks.session({
      session: { user: {} },
      token: {
        appUserId: "u1",
        email: "cognito@example.com",
        name: "Cognito Name",
      },
    });

    expect(session.user.email).toBe("cognito@example.com");
    expect(session.user.displayName).toBe("Cognito Name");
  });

  it("leaves session.user untouched when appUserId has not been resolved yet", async () => {
    const { callbacks } = await loadAuthConfig();

    const session = await callbacks.session({
      session: { user: {} },
      token: { accessToken: "token-a" },
    });

    expect(session.user).toEqual({});
  });
});

describe("guest Credentials provider authorize() (#00056)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a user with the guest tokens on success", async () => {
    const { providers } = await loadAuthConfig();
    stubFetchRoutes([
      route("POST", "http://localhost:8080/api/v1/auth/guest-token", () =>
        jsonResponse({ accessToken: "guest-access", idToken: "guest-id" })
      ),
    ]);
    const guestProvider = providers.find((p) => p.options?.id === "guest");

    const result = await guestProvider?.options?.authorize?.();

    expect(result).toEqual({ id: "guest", accessToken: "guest-access", idToken: "guest-id" });
  });

  it("returns null when the guest-token request fails with a network error", async () => {
    const { providers } = await loadAuthConfig();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("network error")))
    );
    const guestProvider = providers.find((p) => p.options?.id === "guest");

    await expect(guestProvider?.options?.authorize?.()).resolves.toBeNull();
  });

  it("returns null when the guest-token endpoint returns a non-2xx status (e.g. app.guest.enabled=false)", async () => {
    const { providers } = await loadAuthConfig();
    stubFetchRoutes([
      route("POST", "http://localhost:8080/api/v1/auth/guest-token", () => jsonResponse({}, 503)),
    ]);
    const guestProvider = providers.find((p) => p.options?.id === "guest");

    await expect(guestProvider?.options?.authorize?.()).resolves.toBeNull();
  });

  it("returns null when the guest-token response has an unexpected shape", async () => {
    const { providers } = await loadAuthConfig();
    stubFetchRoutes([
      route("POST", "http://localhost:8080/api/v1/auth/guest-token", () =>
        jsonResponse({ unexpected: true })
      ),
    ]);
    const guestProvider = providers.find((p) => p.options?.id === "guest");

    await expect(guestProvider?.options?.authorize?.()).resolves.toBeNull();
  });
});
