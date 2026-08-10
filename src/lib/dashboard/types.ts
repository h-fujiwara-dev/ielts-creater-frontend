import type { FormatType, Section } from "@/lib/api/enums";

// GET /api/v1/dashboard/summary のクエリ・レスポンス型
// (backendリポジトリ docs/API設計書/GET_dashboard-summary.md)
export type DashboardPeriod = "7D" | "30D" | "90D" | "ALL";

export interface DashboardSummaryQuery {
  period?: DashboardPeriod;
  section?: Section;
}

export interface ScoreTrendPoint {
  date: string;
  accuracy: number;
}

export interface DashboardSummaryResponse {
  totalAttempts: number;
  averageAccuracyBySection: Partial<Record<Section, number>>;
  scoreTrend: ScoreTrendPoint[];
  accuracyByFormat: Partial<Record<FormatType, number>>;
}

// バックエンドのレスポンスには存在しない、統計タイルの前週比表示専用の補助データ。
// DashboardSummaryResponseとは別型にして、型定義自体はAPI仕様に忠実に保つ。
export interface DashboardMockHighlights {
  totalAttemptsDelta: number;
  sectionAccuracyDeltaPt: Partial<Record<Section, number>>;
}
