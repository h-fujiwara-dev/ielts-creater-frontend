import { describe, expect, it, vi } from "vitest";

// @/authのauthラッパーを恒等関数化し、渡したハンドラをそのままテストできるようにする。
vi.mock("@/auth", () => ({
  auth: (handler: (req: unknown) => unknown) => handler,
}));

import middlewareExport from "./middleware";

// テストではauth()を恒等関数にモックしているため実際の型はNextRequest/NextFetchEventを
// 要求しない単純な同期ハンドラになる。実行時の形に合わせて型を絞り直す。
const middleware = middlewareExport as unknown as (req: {
  auth: unknown;
  nextUrl: URL;
}) => Response | undefined;

function makeRequest(auth: unknown, pathname = "/dashboard") {
  return {
    auth,
    nextUrl: new URL(`http://localhost:3000${pathname}`),
  };
}

describe("middleware", () => {
  it("redirects unauthenticated requests to /login", () => {
    const response = middleware(makeRequest(null));

    expect(response?.status).toBe(307);
    expect(response?.headers.get("location")).toBe("http://localhost:3000/login");
  });

  it("lets authenticated requests through", () => {
    const response = middleware(makeRequest({ user: { id: "u1" } }));

    expect(response).toBeUndefined();
  });

  it("redirects when the session is established but not yet linked to an app_user (#00038)", () => {
    const response = middleware(makeRequest({ user: {} }));

    expect(response?.status).toBe(307);
    expect(response?.headers.get("location")).toBe("http://localhost:3000/login");
  });
});
