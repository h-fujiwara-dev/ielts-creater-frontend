import { test, expect } from "@playwright/test";

import { AUTH_STORAGE_STATE } from "../playwright.config";
import { answerAndSubmitCurrentAttempt, generateAndSubmitReadingAttempt } from "./support/attempts";

// auth.setup.tsのログイン済みセッションを再利用する。
test.use({ storageState: AUTH_STORAGE_STATE });

test.describe("S-06 履歴一覧からの再受験・結果再確認", () => {
  test.beforeEach(async ({ page }) => {
    // 履歴一覧に最低1件表示されるよう、このテスト専用にAttemptを1件作成する
    // （他specの実行順に依存せず、このファイル単体でも再現できるようにするため）。
    await generateAndSubmitReadingAttempt(page);
  });

  test("「もう一度解く」から同じ問題セットへ再挑戦できる（→S-04）", async ({ page }) => {
    await page.goto("/history");
    await expect(page.getByRole("heading", { name: "履歴一覧", level: 1 })).toBeVisible();

    await page.getByRole("button", { name: "もう一度解く" }).first().click();
    await expect(page).toHaveURL(/\/practice\/[^/]+$/);

    await answerAndSubmitCurrentAttempt(page);
    await expect(page.getByRole("heading", { name: "結果", level: 1 })).toBeVisible();
  });

  test("「結果を見る」から採点結果・解説を再確認できる（→S-05）", async ({ page }) => {
    await page.goto("/history");
    await expect(page.getByRole("heading", { name: "履歴一覧", level: 1 })).toBeVisible();

    await page
      .getByRole("button", { name: /結果を見る/ })
      .first()
      .click();

    await expect(page).toHaveURL(/\/attempts\/[^/]+\/result/);
    await expect(page.getByRole("heading", { name: "結果", level: 1 })).toBeVisible();
  });
});
