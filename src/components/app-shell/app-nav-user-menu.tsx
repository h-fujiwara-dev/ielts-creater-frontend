import type { AppSessionUser } from "@/lib/auth/types";

function getInitials(displayName: string): string {
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

interface AppNavUserMenuProps {
  user: AppSessionUser;
}

// 現時点はホバー表示のピルのみ（ドロップダウンなし）。サインアウト等の実インタラクションは
// 実Cognito接続チケットでこのファイルに閉じて拡張する想定。
export function AppNavUserMenu({ user }: AppNavUserMenuProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-transparent px-2 py-1 transition-colors duration-200 hover:border-border hover:bg-muted">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-semibold text-white">
        {getInitials(user.displayName)}
      </span>
      <span className="hidden text-sm font-semibold text-brand-navy sm:inline">
        {user.displayName}
      </span>
    </div>
  );
}
