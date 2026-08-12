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

// #00046（2026-08-12 修正・dev環境デプロイ済み）: Cognito Hosted UIの標準サインアップ
// （email+password）はCognitoの`name`属性を設定しないため、backendの
// UserProvisioningService.createUser()がdisplayNameをemailのローカル部（@より前）に
// フォールバックする。上記の理由で実際の新規サインアップ〜メール確認コード入力を
// このE2Eでは自動化できないため、事前にAWS管理者権限で`name`属性を未設定のまま作成した
// 検証用ユーザー（E2E_NAMELESS_USER_EMAIL/PASSWORD、準備手順はREADME.md参照）でログインし、
// 自己サインアップ直後のユーザーと同じCognito側の状態を再現してフォールバック挙動を検証する。
test("name属性が未設定のユーザーもフォールバックでログインでき、displayNameがemailのローカル部になる（#00046）", async ({
  page,
}) => {
  const email = requireEnv("E2E_NAMELESS_USER_EMAIL");
  const password = requireEnv("E2E_NAMELESS_USER_PASSWORD");
  const expectedDisplayName = email.split("@")[0];

  await page.goto("/login");
  await page.getByRole("button", { name: /Cognitoでログイン/ }).click();
  await signInViaCognitoHostedUi(page, email, password);

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  await expect(page.getByText(expectedDisplayName)).toBeVisible();
});
