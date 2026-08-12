import type { Page } from "@playwright/test";

// Cognito Hosted UIは本リポジトリ管理外の別ドメイン（*.amazoncognito.com）。
// マークアップはAWS側の仕様変更（Classic Hosted UI / Managed Login等）の影響を受けるため、
// セレクタ調整が必要になった場合はこのファイルに閉じ込める。
// ラベル・ボタン文言ベースの取得に寄せ、markup変更への耐性を優先している。

const COGNITO_DOMAIN_PATTERN = /amazoncognito\.com/;

/**
 * アプリの「Cognitoでログイン／新規登録」ボタン押下後、Cognito Hosted UIの
 * ログイン画面でemail/passwordを入力しサインインする。
 * アプリ側へのコールバック（/api/auth/callback/cognito）完了までは待たない
 * （成功/失敗の判定は呼び出し側でアプリ側の遷移先を見て行う）。
 */
export async function signInViaCognitoHostedUi(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.waitForURL(COGNITO_DOMAIN_PATTERN);
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
}
