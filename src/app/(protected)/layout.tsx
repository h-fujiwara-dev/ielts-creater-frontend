import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell/app-shell";
import { MOCK_SESSION_USER } from "@/lib/auth/mock-user";

// (protected)配下のルーティング構造の箱のみを用意する。実セッション検証を行う
// middleware.tsは、実Cognito接続チケットまで見送る（現状は全画面モックデータのみ）。
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <AppShell user={MOCK_SESSION_USER}>{children}</AppShell>;
}
