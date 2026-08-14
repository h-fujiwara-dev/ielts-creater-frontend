import { test, expect } from "@playwright/test";

import { AUTH_STORAGE_STATE } from "../playwright.config";
import { generateAndSubmitReadingAttempt } from "./support/attempts";

// auth.setup.tsで確立したログイン済みセッションを再利用する（#00043で手動確認済みの
// ログイン→ダッシュボード→問題生成→回答→採点の経路を自動テスト化する）。
test.use({ storageState: AUTH_STORAGE_STATE });

test("ログイン済みユーザーがReadingの問題を生成し、回答を提出して採点結果を確認できる", async ({
  page,
}) => {
  await test.step("S-07 ダッシュボードが表示される", async () => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: "ダッシュボード", level: 1 })).toBeVisible();
    await expect(page.getByText("総受験回数")).toBeVisible({ timeout: 15_000 });
  });

  await test.step("ダッシュボードから問題生成（S-03）へ遷移する", async () => {
    await page.getByRole("link", { name: /問題を生成する/ }).click();
    await expect(page).toHaveURL(/\/practice\/new/);
  });

  await test.step("Readingの問題を生成し、S-04で回答を提出する", async () => {
    await generateAndSubmitReadingAttempt(page);
  });

  await test.step("S-05 結果画面にスコアが表示される", async () => {
    await expect(page.getByRole("heading", { name: "結果", level: 1 })).toBeVisible();
  });
});
