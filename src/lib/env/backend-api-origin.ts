// next.config.ts（ブラウザ→backendのrewrites）とsrc/auth.ts（サーバーサイドの
// GET /api/v1/me呼び出し）の両方で同じデフォルト値を使うための共通定義（#00042）。
// 未設定時はローカルのbootRunデフォルトポート(8080)を向く。
export const BACKEND_API_ORIGIN = process.env.BACKEND_API_ORIGIN ?? "http://localhost:8080";
