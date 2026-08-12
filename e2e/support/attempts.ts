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
  await waitForGenerationResult(page);

  await answerAndSubmitCurrentAttempt(page);
}

const GENERATED_QUESTION_SET_URL = /\/practice\/[0-9a-f-]{36}$/i;

/**
 * "/practice/new"自体が素朴な/\/practice\/[^/]+$/には一致してしまうため、生成された
 * 問題セットID（UUID）への遷移であることを明示的に確認する。生成失敗時（backendの
 * daily生成上限超過等）はURLが変わらず/practice/newに留まり続けるため、
 * question-generation-screen.tsxの失敗表示もあわせて監視し、失敗時は原因が分かる
 * メッセージで即座に失敗させる（さもないと後続のsubmitボタン待ちが原因不明の
 * タイムアウトになる）。
 */
async function waitForGenerationResult(page: Page): Promise<void> {
  const deadline = Date.now() + GENERATION_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (GENERATED_QUESTION_SET_URL.test(page.url())) return;
    if (await page.getByText("問題の生成に失敗しました").isVisible().catch(() => false)) {
      throw new Error(
        "問題生成に失敗した（backendのdaily生成上限等の可能性）。E2E_USER_EMAILの本日の生成回数を確認すること。"
      );
    }
    await page.waitForTimeout(500);
  }
  throw new Error(`問題生成が${GENERATION_TIMEOUT_MS}ms以内に完了しなかった`);
}

/**
 * S-04（回答画面）が表示された状態から、最低1問回答して提出し、
 * S-05（結果）への遷移まで待つ。history画面の「もう一度解く」経由（既存の
 * 問題セットに対する新規Attempt）でも共通して使う。
 */
export async function answerAndSubmitCurrentAttempt(page: Page): Promise<void> {
  const submitButton = page.getByRole("button", { name: "回答を提出する" });

  // answer-screen.tsxはquestionSet取得直後（attemptId確定より前）にこのCardFooter
  // ごと再描画するため、submitボタンはattemptIdが未確定の状態でも先に表示されうる。
  // その状態でクリックするとhandleSubmit()が`if (!attemptId) return;`で早期returnし、
  // 提出APIが一切呼ばれないまま何も起きない（画面遷移せず、エラー表示も出ない）。
  // attemptId確定後に呼ばれる最後の非同期処理（保存済み回答の取得）の完了を
  // 待ってから操作する。listenerはボタンの可視化待ちより前に登録し、取りこぼしを防ぐ。
  const savedAnswersLoaded = page.waitForResponse(
    (res) => /\/api\/v1\/attempts\/[^/]+\/answers$/.test(res.url()) && res.request().method() === "GET",
    { timeout: GENERATION_TIMEOUT_MS }
  );
  await expect(submitButton).toBeVisible({ timeout: GENERATION_TIMEOUT_MS });
  await savedAnswersLoaded;

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
