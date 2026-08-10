"use client";

import { BookOpenCheck, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "特長", href: "#features" },
  { label: "使い方", href: "#how-it-works" },
  { label: "出題形式", href: "#formats" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b border-brand-navy/5 bg-brand-cream/80 backdrop-blur-md"
      onKeyDown={(e) => {
        if (e.key === "Escape") setMenuOpen(false);
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex cursor-pointer items-center gap-2 text-lg font-bold text-brand-navy">
          <BookOpenCheck className="size-6 text-brand-orange" strokeWidth={2.5} />
          IELTS Creator
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-navy/70 transition-colors duration-200 hover:text-brand-navy"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer rounded-full border-brand-navy/20 px-5 text-brand-navy transition-colors duration-200 hover:bg-brand-navy/5"
          >
            ログイン
          </Button>
          <Button
            type="button"
            className="cursor-pointer rounded-full bg-brand-navy px-5 text-white shadow-sm transition-all duration-200 hover:bg-brand-navy-light hover:shadow-md"
          >
            無料ではじめる
          </Button>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="cursor-pointer text-brand-navy md:hidden"
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-brand-navy/5 bg-brand-cream px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-brand-navy/70 transition-colors duration-200 hover:bg-brand-navy/5 hover:text-brand-navy"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer rounded-full border-brand-navy/20 text-brand-navy"
            >
              ログイン
            </Button>
            <Button
              type="button"
              className="cursor-pointer rounded-full bg-brand-navy text-white"
            >
              無料ではじめる
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
