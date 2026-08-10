"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ScoreTrendPoint } from "@/lib/dashboard/types";

const chartConfig = {
  accuracy: {
    label: "正答率",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface ScoreTrendChartProps {
  scoreTrend: ScoreTrendPoint[];
}

function formatDateLabel(date: string) {
  const [, month, day] = date.split("-");
  return `${Number(month)}/${Number(day)}`;
}

export function ScoreTrendChart({ scoreTrend }: ScoreTrendChartProps) {
  const data = scoreTrend.map((point) => ({
    date: formatDateLabel(point.date),
    accuracy: Math.round(point.accuracy * 100),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>スコア推移</CardTitle>
        <CardDescription>選択した期間の正答率の推移</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-52 w-full">
          <AreaChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
              tickFormatter={(value: number) => `${value}%`}
              width={40}
            />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value) => `${value}%`} />}
            />
            <Area
              dataKey="accuracy"
              type="monotone"
              stroke="var(--chart-1)"
              fill="url(#scoreTrendFill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
