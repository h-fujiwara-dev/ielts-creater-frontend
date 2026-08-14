import { History, PenLine } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

const HUB_ACTIONS = [
  {
    href: "/practice/new",
    icon: PenLine,
    iconClassName: "bg-brand-lavender text-brand-blue",
    title: "問題を生成する",
    description: "新しいトピック・難易度でReading/Listeningを練習",
  },
  {
    href: "/history",
    icon: History,
    iconClassName: "bg-brand-orange/15 text-brand-orange",
    title: "履歴を見る",
    description: "過去の受験結果を確認・もう一度解く",
  },
] as const;

export function HubActionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {HUB_ACTIONS.map((action) => (
        <Link key={action.href} href={action.href}>
          <Card className="transition-shadow duration-200 hover:shadow-md">
            <CardContent className="flex items-center gap-4">
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${action.iconClassName}`}
              >
                <action.icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-brand-navy">{action.title}</p>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
