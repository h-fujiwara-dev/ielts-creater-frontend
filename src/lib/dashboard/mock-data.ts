import type { FormatType, Section } from "@/lib/api/enums";
import { simulateDelay } from "@/lib/mock/simulate-delay";

import type {
  DashboardMockHighlights,
  DashboardSummaryQuery,
  DashboardSummaryResponse,
  ScoreTrendPoint,
} from "./types";

// 出題形式とセクションの対応（S-04回答画面の実装スコープに準拠）。
// Reading: TFNG / FILL_BLANK / MATCHING_HEADINGS、Listening: MCQ。
const FORMATS_BY_SECTION: Record<Section, FormatType[]> = {
  READING: ["TFNG", "FILL_BLANK", "MATCHING_HEADINGS"],
  LISTENING: ["MCQ"],
};

const FULL_SCORE_TREND: ScoreTrendPoint[] = [
  { date: "2026-05-18", accuracy: 0.52 },
  { date: "2026-05-25", accuracy: 0.55 },
  { date: "2026-06-01", accuracy: 0.58 },
  { date: "2026-06-08", accuracy: 0.6 },
  { date: "2026-06-15", accuracy: 0.6 },
  { date: "2026-06-22", accuracy: 0.63 },
  { date: "2026-06-29", accuracy: 0.65 },
  { date: "2026-07-06", accuracy: 0.68 },
  { date: "2026-07-13", accuracy: 0.66 },
  { date: "2026-07-20", accuracy: 0.7 },
  { date: "2026-07-27", accuracy: 0.72 },
  { date: "2026-08-03", accuracy: 0.7 },
  { date: "2026-08-07", accuracy: 0.75 },
  { date: "2026-08-10", accuracy: 0.73 },
];

const FULL_ACCURACY_BY_FORMAT: Record<FormatType, number> = {
  TFNG: 0.78,
  MCQ: 0.64,
  FILL_BLANK: 0.58,
  MATCHING_HEADINGS: 0.45,
};

const FULL_ACCURACY_BY_SECTION: Record<Section, number> = {
  READING: 0.72,
  LISTENING: 0.65,
};

const TOTAL_ATTEMPTS_BY_PERIOD: Record<
  NonNullable<DashboardSummaryQuery["period"]>,
  number
> = {
  "7D": 9,
  "30D": 42,
  "90D": 95,
  ALL: 128,
};

const TREND_POINTS_BY_PERIOD: Record<
  NonNullable<DashboardSummaryQuery["period"]>,
  number
> = {
  "7D": 2,
  "30D": 5,
  "90D": 10,
  ALL: FULL_SCORE_TREND.length,
};

function pickRecord<T extends string, V>(
  record: Record<T, V>,
  keys: readonly T[]
): Partial<Record<T, V>> {
  const result: Partial<Record<T, V>> = {};
  for (const key of keys) {
    result[key] = record[key];
  }
  return result;
}

export function mockGetDashboardSummary(
  query: DashboardSummaryQuery = {}
): Promise<DashboardSummaryResponse> {
  const period = query.period ?? "ALL";
  const trendCount = TREND_POINTS_BY_PERIOD[period];

  const response: DashboardSummaryResponse = {
    totalAttempts: TOTAL_ATTEMPTS_BY_PERIOD[period],
    scoreTrend: FULL_SCORE_TREND.slice(-trendCount),
    averageAccuracyBySection: query.section
      ? pickRecord(FULL_ACCURACY_BY_SECTION, [query.section])
      : { ...FULL_ACCURACY_BY_SECTION },
    accuracyByFormat: query.section
      ? pickRecord(FULL_ACCURACY_BY_FORMAT, FORMATS_BY_SECTION[query.section])
      : { ...FULL_ACCURACY_BY_FORMAT },
  };

  return simulateDelay(response, 300);
}

export function mockGetDashboardHighlights(): Promise<DashboardMockHighlights> {
  return simulateDelay(
    {
      totalAttemptsDelta: 12,
      sectionAccuracyDeltaPt: { READING: 4, LISTENING: -2 },
    },
    300
  );
}
