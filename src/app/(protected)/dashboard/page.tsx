import type { Metadata } from "next";

import { DashboardScreen } from "@/components/dashboard/dashboard-screen";

export const metadata: Metadata = {
  title: "ダッシュボード | IELTS Creator",
};

export default function DashboardPage() {
  return <DashboardScreen />;
}
