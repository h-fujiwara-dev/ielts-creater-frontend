import type { ReactNode } from "react";

import type { AppSessionUser } from "@/lib/auth/types";

import { AppNav } from "./app-nav";

interface AppShellProps {
  user: AppSessionUser;
  children: ReactNode;
}

// 認証必須画面（S-03〜S-07）の共通レイアウト。ナビゲーションシェル＋コンテンツ領域を
// 合成した独立コンポーネントとして、`(protected)/layout.tsx`から利用する。
export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-muted/50">
      <AppNav user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
