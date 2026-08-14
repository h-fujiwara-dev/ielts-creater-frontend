"use client";

import { BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { AppSessionUser } from "@/lib/auth/types";

import { AppNavUserMenu } from "./app-nav-user-menu";

const NAV_LINKS = [
  { label: "ダッシュボード", href: "/dashboard" },
  { label: "問題生成", href: "/practice/new" },
  { label: "履歴一覧", href: "/history" },
] as const;

interface AppNavProps {
  user: AppSessionUser;
}

// ログイン後の全画面（S-03〜S-07）で共通利用するナビゲーションシェル。
// TOPのマーケティング用ヘッダー（site-header.tsx）・認証画面用ヘッダー（auth-header.tsx）
// とは別物として独立コンポーネント化している。
export function AppNav({ user }: AppNavProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center gap-2 text-lg font-bold text-brand-navy"
        >
          <BookOpenCheck className="size-6 text-brand-orange" strokeWidth={2.5} />
          IELTS Creator
        </Link>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap text-brand-navy/60 transition-colors duration-200 hover:bg-muted hover:text-brand-navy",
                  isActive && "bg-brand-lavender text-brand-navy"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <AppNavUserMenu user={user} />
      </div>
    </header>
  );
}
