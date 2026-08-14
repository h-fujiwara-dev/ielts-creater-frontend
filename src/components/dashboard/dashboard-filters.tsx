"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SECTION_LABELS, type Section } from "@/lib/api/enums";
import type { DashboardPeriod } from "@/lib/dashboard/types";

const PERIOD_OPTIONS: { value: DashboardPeriod; label: string }[] = [
  { value: "7D", label: "1週間" },
  { value: "30D", label: "1ヶ月" },
  { value: "ALL", label: "全期間" },
];

interface DashboardFiltersProps {
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
  section: Section | "ALL";
  onSectionChange: (section: Section | "ALL") => void;
}

export function DashboardFilters({
  period,
  onPeriodChange,
  section,
  onSectionChange,
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tabs
        value={period}
        onValueChange={(value) => onPeriodChange(value as DashboardPeriod)}
      >
        <TabsList>
          {PERIOD_OPTIONS.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Select
        value={section}
        onValueChange={(value) => onSectionChange(value as Section | "ALL")}
      >
        <SelectTrigger>
          <SelectValue placeholder="すべてのセクション" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">すべてのセクション</SelectItem>
          <SelectItem value="READING">{SECTION_LABELS.READING}</SelectItem>
          <SelectItem value="LISTENING">{SECTION_LABELS.LISTENING}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
