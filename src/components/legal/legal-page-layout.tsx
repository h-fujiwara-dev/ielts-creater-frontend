import Link from "next/link";
import type { ReactNode } from "react";

import { AuthHeader } from "@/components/sections/auth-header";
import { SiteFooter } from "@/components/sections/site-footer";

type LegalPageLayoutProps = {
  title: string;
  enactedDate: string;
  revisedDate: string;
  crossLink: { label: string; href: string };
  children: ReactNode;
};

export function LegalPageLayout({
  title,
  enactedDate,
  revisedDate,
  crossLink,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-brand-cream">
      <AuthHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold text-brand-navy">{title}</h1>
        <p className="mt-3 text-sm text-brand-navy/60">
          制定日: {enactedDate} ／ 最終改定日: {revisedDate}
        </p>

        <div className="mt-10 space-y-10">{children}</div>

        <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-brand-navy/10 pt-8 text-sm">
          <Link
            href={crossLink.href}
            className="font-medium text-brand-orange hover:underline"
          >
            {crossLink.label}
          </Link>
          <Link
            href="/"
            className="font-medium text-brand-navy/70 transition-colors duration-200 hover:text-brand-navy hover:underline"
          >
            Topへ戻る
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
