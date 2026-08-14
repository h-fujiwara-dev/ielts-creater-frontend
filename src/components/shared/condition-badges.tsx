import { Badge } from "@/components/ui/badge";
import { DIFFICULTY_LABELS, SECTION_LABELS, type Difficulty, type Section } from "@/lib/api/enums";

interface ConditionBadgesProps {
  section: Section;
  topic: string;
  difficulty: Difficulty;
}

// 生成条件（セクション/トピック/難易度）を表すバッジ3点セット。
// #00020の生成中/失敗状態、#00021の回答画面ヘッダーで共通利用する。
export function ConditionBadges({ section, topic, difficulty }: ConditionBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="navy">{SECTION_LABELS[section]}</Badge>
      <Badge variant="secondary">{topic}</Badge>
      <Badge variant="secondary">{DIFFICULTY_LABELS[difficulty]}</Badge>
    </div>
  );
}
