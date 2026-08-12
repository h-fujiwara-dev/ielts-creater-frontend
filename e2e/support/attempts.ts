import { expect, type Page } from "@playwright/test";

// 実dev backend（実AI生成API）に対して実行するため、生成完了までのポーリングは
// S-03のフロントエンド上の見積り秒数（Reading: 8秒、#00047時点の実装）よりも
// 大幅に長くかかりうる。余裕を持ったタイムアウトを設定する。
const GENERATION_TIMEOUT_MS = 60_000;
const SUBMIT_TIMEOUT_MS = 15_000;

/**
 * S-03（既定値: Reading / Environment / Band 6-7）で問題セットを生成し、
 * S-04で最低1問回答したうえで提出し、S-05（結果）への遷移まで待つ。
 * 生成されるコンテンツの出題形式（TFNG/MCQ/穴埋め等）はAIが都度決めるため、
 * 特定の設問文言には依存しない汎用的な回答方法を使う。
 */
export async function generateAndSubmitReadingAttempt(page: Page): Promise<void> {
  await page.goto("/practice/new");
  await page.getByRole("button", { name: "問題を生成する" }).click();
  await expect(page).toHaveURL(/\/practice\/[^/]+$/, { timeout: GENERATION_TIMEOUT_MS });

  await answerAndSubmitCurrentAttempt(page);
}

/**
 * S-04（回答画面）が表示された状態から、最低1問回答して提出し、
 * S-05（結果）への遷移まで待つ。history画面の「もう一度解く」経由（既存の
 * 問題セットに対する新規Attempt）でも共通して使う。
 */
export async function answerAndSubmitCurrentAttempt(page: Page): Promise<void> {
  const submitButton = page.getByRole("button", { name: "回答を提出する" });
  // questionSet/attempt/保存済み回答の3回のAPI呼び出し（逐次）が終わるまでは
  // ローディング表示のみでsubmitボタンは描画されない。
  await expect(submitButton).toBeVisible({ timeout: GENERATION_TIMEOUT_MS });

  await answerAtLeastOneQuestion(page);
  await submitButton.click();
  await expect(page).toHaveURL(/\/attempts\/[^/]+\/result/, { timeout: SUBMIT_TIMEOUT_MS });
}

async function answerAtLeastOneQuestion(page: Page): Promise<void> {
  const radios = page.getByRole("radio");
  if ((await radios.count()) > 0) {
    await radios.first().check();
    return;
  }

  const textInputs = page.locator('main input[type="text"], main textarea');
  if ((await textInputs.count()) > 0) {
    await textInputs.first().fill("e2e test answer");
  }
}
