import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";

// next devと同じ.env.localを読む（BACKEND_API_ORIGIN/COGNITO_*に加え、
// E2E_USER_EMAIL等のE2E専用変数もここに追記する運用。README.md参照）。
// 既にシェルでexport済みの値は上書きしない（dotenvのデフォルト挙動）。
loadEnv({ path: path.join(__dirname, ".env.local") });

// e2e/.auth/user.json — auth.setup.tsが保存する認証済みstorageState。
// core-flow/historyのspecはこれを再利用し、テストごとにCognito Hosted UIへの
// 実ログインを繰り返さない（実dev環境への負荷・所要時間を抑えるため）。
export const AUTH_STORAGE_STATE = path.join(__dirname, "e2e/.auth/user.json");

// ローカルfrontend（npm run dev）+ AWS dev backend + dev Cognito User Poolに接続して実行する
// 構成（#00043のパターン2）を前提とする。CIでの実行は対象外（#00047の対象外）。
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  // 実Cognito/実backend（実DB・実AI生成API）に対して実行するため、並列worker数は1に固定する
  // （同時実行による認証済みユーザーの競合・生成APIへの同時リクエストを避ける）。
  workers: 1,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
  ],
});
