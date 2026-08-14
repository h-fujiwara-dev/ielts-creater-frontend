// src/lib/api/client.ts（ブラウザ側の汎用APIクライアント）とsrc/auth.tsのfetchMe()
// （サーバーサイドでのGET /api/v1/me呼び出し）の両方で使う、素朴なfetchラッパー処理の
// 共通部分（#00042）。両者は実行コンテキスト（ブラウザ/サーバー）・認証トークンの取得元・
// 失敗時の扱い（例外を投げてUI表示 / nullを返し内部リトライ）が異なるため、request()自体は
// 共通化せずこの薄いヘルパーのみを共有する。

export function buildBearerHeader(accessToken: string | undefined): Record<string, string> {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export async function safeJson(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}
