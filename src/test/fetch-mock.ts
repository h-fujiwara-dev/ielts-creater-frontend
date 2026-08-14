import { vi } from "vitest";

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(status === 204 || body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

type RouteHandler = (
  url: string,
  init: RequestInit | undefined,
  callIndex: number
) => Response | Promise<Response>;

interface Route {
  match: (url: string, method: string) => boolean;
  handle: RouteHandler;
}

export function route(method: string, url: string, handle: RouteHandler): Route {
  return { match: (u, m) => m === method && u === url, handle };
}

// テスト用にfetchを差し替え、登録したroute定義（method+完全一致URL）へディスパッチする。
// 同一routeへの呼び出し回数（callIndex）をハンドラへ渡すので、ポーリングのような
// 複数回呼び出しで応答を変化させたいケースに対応できる。
export function stubFetchRoutes(routes: Route[]): ReturnType<typeof vi.fn> {
  const callCounts = new Map<Route, number>();
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    const method = init?.method ?? "GET";
    const matched = routes.find((r) => r.match(url, method));
    if (!matched) throw new Error(`Unhandled fetch in test: ${method} ${url}`);
    const callIndex = callCounts.get(matched) ?? 0;
    callCounts.set(matched, callIndex + 1);
    return matched.handle(url, init, callIndex);
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
