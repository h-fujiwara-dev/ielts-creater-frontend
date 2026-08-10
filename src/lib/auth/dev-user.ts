// Phase 1（ローカル開発）用の固定devユーザー判定。
// 画面設計書「実装メモ」の通り、Cognito連携はPhase 2から有効化するため、
// このチケットでは4状態の画面遷移をローカル判定のみで成立させる。

export const DEV_USER_EMAIL = "dev@example.com";
export const DEV_USER_PASSWORD = "DevPass123";
export const DEV_CONFIRMATION_CODE = "482913";

export function verifyDevCredentials(email: string, password: string): boolean {
  return email === DEV_USER_EMAIL && password === DEV_USER_PASSWORD;
}

export function verifyDevConfirmationCode(code: string): boolean {
  return code === DEV_CONFIRMATION_CODE;
}
