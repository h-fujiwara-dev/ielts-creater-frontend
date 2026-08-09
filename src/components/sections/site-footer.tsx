import { BookOpenCheck, Globe, MessageCircle, Rss } from "lucide-react";

const socialLinks = [
  { label: "公式サイト", icon: Globe },
  { label: "コミュニティ", icon: MessageCircle },
  { label: "フィード", icon: Rss },
];

export function SiteFooter() {
  return (
    <footer className="bg-brand-navy py-16 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-medium text-white/70">
          解いた分だけ、新しい問題に。
        </p>
        <div className="mt-4 flex items-center gap-2 text-lg font-bold">
          <BookOpenCheck className="size-6 text-brand-orange" />
          IELTS Creator
        </div>
        <div className="mt-5 flex gap-3">
          {socialLinks.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="cursor-pointer text-white/70 transition-colors duration-200 hover:text-white"
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <span>© 2026 IELTS Creator. All rights reserved.</span>
          <div className="flex gap-4">
            <button
              type="button"
              className="cursor-pointer transition-colors duration-200 hover:text-white/80"
            >
              プライバシーポリシー
            </button>
            <button
              type="button"
              className="cursor-pointer transition-colors duration-200 hover:text-white/80"
            >
              利用規約
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
