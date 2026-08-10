"use client";

import { useEffect, useState } from "react";

import { ApiError } from "@/lib/api/client";
import type { Section } from "@/lib/api/enums";
import {
  mockGetDashboardHighlights,
  mockGetDashboardSummary,
} from "@/lib/dashboard/mock-data";
import type {
  DashboardMockHighlights,
  DashboardPeriod,
  DashboardSummaryResponse,
} from "@/lib/dashboard/types";

import { DashboardFilters } from "./dashboard-filters";
import { FormatAccuracyCard } from "./format-accuracy-card";
import { HubActionCards } from "./hub-action-cards";
import { ScoreTrendChart } from "./score-trend-chart";
import { SectionAccuracyCard } from "./section-accuracy-card";
import { StatTiles } from "./stat-tiles";

export function DashboardScreen() {
  const [period, setPeriod] = useState<DashboardPeriod>("30D");
  const [section, setSection] = useState<Section | "ALL">("ALL");
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [highlights, setHighlights] = useState<DashboardMockHighlights | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 実装メモ（S-07画面設計書）に準拠: period/sectionはサーバー側フィルタとして扱い、
  // 操作の都度 GET /api/v1/dashboard/summary を再取得する。
  useEffect(() => {
    let cancelled = false;

    mockGetDashboardSummary({
      period,
      section: section === "ALL" ? undefined : section,
    })
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setErrorMessage(
          error instanceof ApiError ? error.message : "ダッシュボードの取得に失敗しました。"
        );
      });

    return () => {
      cancelled = true;
    };
  }, [period, section]);

  useEffect(() => {
    mockGetDashboardHighlights().then(setHighlights);
  }, []);

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm font-medium text-destructive">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-wide text-brand-orange">S-07</p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-navy">ダッシュボード</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            学習履歴に基づくスコア推移・正答率の傾向を可視化する参照専用の画面
          </p>
        </div>
        <DashboardFilters
          period={period}
          onPeriodChange={setPeriod}
          section={section}
          onSectionChange={setSection}
        />
      </div>

      <HubActionCards />

      {summary && highlights && (
        <>
          <StatTiles summary={summary} highlights={highlights} />
          <ScoreTrendChart scoreTrend={summary.scoreTrend} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormatAccuracyCard accuracyByFormat={summary.accuracyByFormat} />
            <SectionAccuracyCard averageAccuracyBySection={summary.averageAccuracyBySection} />
          </div>
        </>
      )}
    </div>
  );
}
