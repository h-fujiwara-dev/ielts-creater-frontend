import { test, expect } from "@playwright/test";

import { signInViaCognitoHostedUi } from "./support/cognito-hosted-ui";
import { requireEnv } from "./support/env";

// このスイートは未ログイン状態から検証するため、storageStateは使わない
// （playwright.config.tsのデフォルト、authプロジェクトへの依存もなし）。

test("Topページの「無料ではじめる」からCognito Hosted UIへ遷移できる", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "無料ではじめる" }).first().click();
  await expect(page).toHaveURL(/\/login/);

  await page.getByRole("button", { name: /Cognitoでログイン/ }).click();
  // Cognito Hosted UI（*.amazoncognito.com、別ドメイン）へリダイレクトされる。
  // 実際の新規サインアップフォーム入力〜メール確認コード入力の完了までは、確認コードが
  // メールで配信される都合上このE2Eでは自動化しない（メールテスト用インフラの追加を
  // 伴うため#00047の対象外。下のテストで、確認完了後に実際に起きる不具合を別の方法で検証する）。
  await page.waitForURL(/amazoncognito\.com/);
});

// #00046: Cognito Hosted UIの標準サインアップ（email+password）はCognitoの`name`属性を
// 設定しないため、backendのdisplayName検証が失敗し初回ログインが完了しない不具合がある
// （2026-08-12時点で未修正）。上記の理由で実際の新規サインアップ〜メール確認コード入力を
// このE2Eでは自動化できないため、事前にAWS管理者権限で`name`属性を未設定のまま作成した
// 検証用ユーザー（E2E_NAMELESS_USER_EMAIL/PASSWORD、準備手順はREADME.md参照）でログインし、
// 自己サインアップ直後のユーザーと同じCognito側の状態を再現して不具合を検証する。
// #00046修正後は、この失敗系アサーションを成功系（/dashboardへの到達）に更新すること。
test("name属性が未設定のユーザーは初回ログインが完了しない（#00046の既知バグ）", async ({
  page,
}) => {
  const email = requireEnv("E2E_NAMELESS_USER_EMAIL");
  const password = requireEnv("E2E_NAMELESS_USER_PASSWORD");

  await page.goto("/login");
  await page.getByRole("button", { name: /Cognitoでログイン/ }).click();
  await signInViaCognitoHostedUi(page, email, password);

  // 本来ログインが成功すれば/dashboardへ遷移するが、displayName検証の失敗により
  // hasAppUser()（src/lib/auth/types.ts）がfalseとなり(protected)/layout.tsxが/loginへ
  // 差し戻す。これはNextAuthのOAuthエラーではなくアプリ側の後続検証失敗のため?error=は
  // 付与されず、AuthAlertも表示されない（ユーザーには理由が見えないままログイン画面に
  // 戻るだけ、という点も本バグの実害の一つ）。
  await expect(page).toHaveURL(/\/login$/, { timeout: 15_000 });
});
