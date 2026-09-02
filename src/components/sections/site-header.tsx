"use client";

import { BookOpenCheck, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/components/sections/nav-links";
import { useScrolledPast } from "@/lib/use-scrolled-past";

const HEADER_OFFSET_PX = 72;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const light = useScrolledPast("hero-top-sentinel", HEADER_OFFSET_PX);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        light
          ? "border-brand-navy/5 bg-brand-cream/80"
          : "border-white/10 bg-brand-navy/40"
      }`}
      onKeyDown={(e) => {
        if (e.key === "Escape") setMenuOpen(false);
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className={`flex items-center gap-2 text-lg font-bold transition-colors duration-300 ${
            light ? "text-brand-navy" : "text-white"
          }`}
        >
          <BookOpenCheck className="size-6 text-brand-orange" strokeWidth={2.5} />
          IELTS Creator
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                light
                  ? "text-brand-navy/70 hover:text-brand-navy"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="outline"
            render={<Link href="/login" />}
            nativeButton={false}
            className={`cursor-pointer rounded-full px-5 transition-colors duration-200 ${
              light
                ? "border-brand-navy/20 text-brand-navy hover:bg-brand-navy/5"
                : "border-white/25 text-white hover:bg-white/10"
            }`}
          >
            ログイン
          </Button>
          <Button
            render={<Link href="/login?step=signup" />}
            nativeButton={false}
            className={`cursor-pointer rounded-full px-5 shadow-sm transition-all duration-200 hover:shadow-md ${
              light
                ? "bg-brand-navy text-white hover:bg-brand-navy-light"
                : "bg-white text-brand-navy hover:bg-brand-cream"
            }`}
          >
            無料ではじめる
          </Button>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className={`cursor-pointer transition-colors duration-200 md:hidden ${
            light ? "text-brand-navy" : "text-white"
          }`}
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {menuOpen && (
        <div
          className={`border-t px-6 py-4 md:hidden ${
            light ? "border-brand-navy/5 bg-brand-cream" : "border-white/10 bg-brand-navy"
          }`}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-2 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  light
                    ? "text-brand-navy/70 hover:bg-brand-navy/5 hover:text-brand-navy"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <Button
              variant="outline"
              render={<Link href="/login" onClick={() => setMenuOpen(false)} />}
              nativeButton={false}
              className={`cursor-pointer rounded-full ${
                light ? "border-brand-navy/20 text-brand-navy" : "border-white/25 text-white"
              }`}
            >
              ログイン
            </Button>
            <Button
              render={<Link href="/login?step=signup" onClick={() => setMenuOpen(false)} />}
              nativeButton={false}
              className={`cursor-pointer rounded-full ${
                light ? "bg-brand-navy text-white" : "bg-white text-brand-navy"
              }`}
            >
              無料ではじめる
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
