import { apiGet, buildQueryString } from "@/lib/api/client";
import { simulateDelay } from "@/lib/mock/simulate-delay";

import type {
  DashboardMockHighlights,
  DashboardSummaryQuery,
  DashboardSummaryResponse,
} from "./types";

export function mockGetDashboardSummary(
  query: DashboardSummaryQuery = {}
): Promise<DashboardSummaryResponse> {
  const qs = buildQueryString({ period: query.period, section: query.section });
  return apiGet<DashboardSummaryResponse>(`/api/v1/dashboard/summary${qs}`);
}

// 前週比の統計タイル表示専用の補助データ。backendに対応するエンドポイントがなく
// （DashboardMockHighlights型の定義コメント参照）、引き続きモック値を返す。
export function mockGetDashboardHighlights(): Promise<DashboardMockHighlights> {
  return simulateDelay(
    {
      totalAttemptsDelta: 12,
      sectionAccuracyDeltaPt: { READING: 4, LISTENING: -2 },
    },
    300
  );
}
