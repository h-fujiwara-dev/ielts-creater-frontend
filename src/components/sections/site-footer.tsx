import { BookOpenCheck, Globe, MessageCircle, Rss } from "lucide-react";

const socialLinks = [
  { label: "公式サイト", icon: Globe },
  { label: "コミュニティ", icon: MessageCircle },
  { label: "フィード", icon: Rss },
];

const navLinks = [
  { label: "特長", href: "#features" },
  { label: "使い方", href: "#how-it-works" },
  { label: "出題形式", href: "#formats" },
];

const legalLinks = ["プライバシーポリシー", "利用規約"];

export function SiteFooter() {
  return (
    <footer className="bg-brand-navy py-16 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold">
              <BookOpenCheck className="size-6 text-brand-orange" />
              IELTS Creator
            </div>
            <p className="mt-4 text-sm font-medium text-white/70">
              解いた分だけ、新しい問題に。
            </p>
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
          </div>

          <div>
            <p className="text-sm font-semibold text-white/90">ナビゲーション</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="cursor-pointer text-sm text-white/60 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-sm font-semibold text-white/90">規約</p>
            <div className="mt-4 flex flex-col gap-2.5">
              {legalLinks.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="cursor-pointer text-left text-sm text-white/60 transition-colors duration-200 hover:text-white"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/50">
          © 2026 IELTS Creator. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
