const DEFAULT_CALLBACK_URL = "/dashboard";

// middleware.tsが未ログイン時に付与するcallbackUrlクエリは、ユーザーが直接編集できる
// URLの一部でもある。自オリジン配下の相対パス（"/"始まり・"//"始まりでない）のみを
// 許容し、外部ドメインへのオープンリダイレクトを防ぐ（#00040）。
export function sanitizeCallbackUrl(
  callbackUrl: string | undefined,
  fallback: string = DEFAULT_CALLBACK_URL
): string {
  if (!callbackUrl) return fallback;
  if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) return fallback;
  return callbackUrl;
}
