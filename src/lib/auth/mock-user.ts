import { simulateDelay } from "@/lib/mock/simulate-delay";

import type { AppSessionUser } from "./types";

// GET /api/v1/me のモックレスポンス。認証必須画面（S-03〜S-07）はすべてこのユーザーで
// 動作させる。実Cognito接続チケットで実fetchに置き換える想定。
export const MOCK_SESSION_USER: AppSessionUser = {
  id: "u-01",
  email: "yuki.t@example.com",
  displayName: "Yuki T.",
};

export function mockGetMe(): Promise<AppSessionUser> {
  return simulateDelay(MOCK_SESSION_USER, 200);
}
