import { test, expect } from "@playwright/test";

// 認証不要な静的画面のみを対象とするため、storageStateは使わない。

test("S-01 Topページが表示され、ログイン・無料ではじめるへの導線がある", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/IELTS Creator/);

  await expect(page.getByRole("button", { name: "ログイン" }).first()).toHaveAttribute(
    "href",
    "/login"
  );
  await expect(page.getByRole("button", { name: "無料ではじめる" }).first()).toBeVisible();

  await expect(page.getByRole("link", { name: "プライバシーポリシー" })).toHaveAttribute(
    "href",
    "/privacy"
  );
  await expect(page.getByRole("link", { name: "利用規約" })).toHaveAttribute("href", "/terms");
});

test("S-08 プライバシーポリシー ⇔ S-09 利用規約を相互に遷移できる", async ({ page }) => {
  // SiteFooter（規約セクション）にも同名リンクがあるため、本文（crossLink）に絞り込む
  const main = page.getByRole("main");

  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: "プライバシーポリシー", level: 1 })).toBeVisible();

  await main.getByRole("link", { name: "利用規約" }).click();
  await expect(page).toHaveURL(/\/terms/);
  await expect(page.getByRole("heading", { name: "利用規約", level: 1 })).toBeVisible();

  await main.getByRole("link", { name: "プライバシーポリシー" }).click();
  await expect(page).toHaveURL(/\/privacy/);
  await expect(page.getByRole("heading", { name: "プライバシーポリシー", level: 1 })).toBeVisible();
});

test("S-08/S-09の「Topへ戻る」からTopページに戻れる", async ({ page }) => {
  await page.goto("/terms");
  await page.getByRole("link", { name: "Topへ戻る" }).click();
  await expect(page).toHaveURL("/");
});
