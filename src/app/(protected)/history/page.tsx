import type { Metadata } from "next";

import { HistoryScreen } from "@/components/history/history-screen";

export const metadata: Metadata = {
  title: "履歴一覧 | IELTS Creator",
};

export default function HistoryPage() {
  return <HistoryScreen />;
}
