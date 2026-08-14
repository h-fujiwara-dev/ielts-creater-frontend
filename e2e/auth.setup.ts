import { test as setup, expect } from "@playwright/test";

import { AUTH_STORAGE_STATE } from "../playwright.config";
import { signInViaCognitoHostedUi } from "./support/cognito-hosted-ui";
import { requireEnv } from "./support/env";

// E2E_USER_EMAIL/E2E_USER_PASSWORDは、dev Cognito User Poolに事前準備した
// E2E専用テストユーザー（name属性設定済み、#00046の既知バグの影響を受けない状態）。
// 準備手順はREADME.md「Playwright E2Eテスト」節を参照。
setup("authenticate", async ({ page }) => {
  const email = requireEnv("E2E_USER_EMAIL");
  const password = requireEnv("E2E_USER_PASSWORD");

  await page.goto("/login");
  await page.getByRole("button", { name: /Cognitoでログイン/ }).click();
  await signInViaCognitoHostedUi(page, email, password);

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  await page.context().storageState({ path: AUTH_STORAGE_STATE });
});
