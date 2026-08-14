import { getSession } from "next-auth/react";

import type { ApiErrorResponse } from "./common-types";
import { buildBearerHeader, safeJson } from "./http";

// backendのGlobalExceptionHandlerが返すエラー形状をそのまま保持する例外型。
export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorResponse;

  constructor(status: number, body: ApiErrorResponse) {
    super(body.message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

const FALLBACK_ERROR = (statusText: string): ApiErrorResponse => ({
  error: "UNKNOWN_ERROR",
  message: statusText || "Unexpected error",
  timestamp: new Date().toISOString(),
});

// getSession()は/api/auth/sessionへの未キャッシュfetchのため、同一画面内で複数のAPI呼び出しが
// ほぼ同時に発生した場合（例: 複数useEffect、Promise.all）に呼び出し元の数だけ重複して
// 発生してしまう。進行中の呼び出しを共有し、完了後はキャッシュを持たない（常に最新の
// セッションを取得する）ことで、同時多発時の重複往復のみを間引く（#00042）。
let inFlightSession: ReturnType<typeof getSession> | null = null;

function getSessionDeduped(): ReturnType<typeof getSession> {
  if (!inFlightSession) {
    inFlightSession = getSession().finally(() => {
      inFlightSession = null;
    });
  }
  return inFlightSession;
}

async function fetchChecked(path: string, init?: RequestInit): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(path, init);
  } catch {
    throw new ApiError(0, {
      error: "NETWORK_ERROR",
      message: "サーバーに接続できませんでした。ネットワーク状態を確認してください。",
      timestamp: new Date().toISOString(),
    });
  }

  if (!response.ok) {
    const body = (await safeJson(response)) as ApiErrorResponse | null;
    throw new ApiError(response.status, body ?? FALLBACK_ERROR(response.statusText));
  }

  return response;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const session = await getSessionDeduped();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...buildBearerHeader(session?.accessToken),
    ...(init?.headers as Record<string, string> | undefined),
  };

  const response = await fetchChecked(path, { ...init, headers });

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

// <audio src>等のネイティブメディア要素はAuthorizationヘッダーを付与できないため、
// 認証が必要な音声ファイル配信エンドポイント（#00054）はfetch()でBlobとして取得し、
// Object URLに変換して使う。
export async function apiGetBlob(path: string): Promise<Blob> {
  const session = await getSessionDeduped();
  const response = await fetchChecked(path, { headers: buildBearerHeader(session?.accessToken) });
  return response.blob();
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: "PATCH", body: JSON.stringify(body) });
}

export function buildQueryString(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
