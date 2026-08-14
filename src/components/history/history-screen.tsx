"use client";

import { useEffect, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiError } from "@/lib/api/client";
import { SECTION_LABELS, type Section } from "@/lib/api/enums";
import { mockGetAttempts } from "@/lib/attempts/mock-data";
import type { AttemptListItem } from "@/lib/attempts/types";

import { HistoryEmptyState } from "./history-empty-state";
import { HistoryList } from "./history-list";
import { HistoryPagination } from "./history-pagination";

const PAGE_SIZE = 5;

export function HistoryScreen() {
  const [section, setSection] = useState<Section | "ALL">("ALL");
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<AttemptListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    mockGetAttempts({
      section: section === "ALL" ? undefined : section,
      page,
      size: PAGE_SIZE,
    })
      .then((response) => {
        if (cancelled) return;
        setItems(response.items);
        setTotalPages(response.totalPages);
        setIsLoaded(true);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setErrorMessage(
          error instanceof ApiError ? error.message : "履歴の取得に失敗しました。"
        );
      });

    return () => {
      cancelled = true;
    };
  }, [section, page]);

  const handleSectionChange = (next: Section | "ALL") => {
    setSection(next);
    setPage(0);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <p className="text-sm font-bold tracking-wide text-brand-orange">S-06</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-navy">履歴一覧</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          過去の受験履歴を一覧表示する画面。各行から採点結果の確認、または同じ問題セットでの再受験を選べる
        </p>
      </div>

      <Tabs
        value={section}
        onValueChange={(value) => handleSectionChange(value as Section | "ALL")}
      >
        <TabsList>
          <TabsTrigger value="ALL">すべて</TabsTrigger>
          <TabsTrigger value="READING">{SECTION_LABELS.READING}</TabsTrigger>
          <TabsTrigger value="LISTENING">{SECTION_LABELS.LISTENING}</TabsTrigger>
        </TabsList>
      </Tabs>

      {errorMessage && <p className="text-sm font-medium text-destructive">{errorMessage}</p>}

      {isLoaded && (
        <>
          {items.length > 0 ? <HistoryList items={items} /> : <HistoryEmptyState />}
          <HistoryPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
