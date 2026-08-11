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

function makeRequest(authed: boolean, pathname = "/dashboard") {
  return {
    auth: authed ? { user: { id: "u1" } } : null,
    nextUrl: new URL(`http://localhost:3000${pathname}`),
  };
}

describe("middleware", () => {
  it("redirects unauthenticated requests to /login", () => {
    const response = middleware(makeRequest(false));

    expect(response?.status).toBe(307);
    expect(response?.headers.get("location")).toBe("http://localhost:3000/login");
  });

  it("lets authenticated requests through", () => {
    const response = middleware(makeRequest(true));

    expect(response).toBeUndefined();
  });
});
