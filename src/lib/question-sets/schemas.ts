import { z } from "zod";

// 画面設計書 S-03 入力項目とバリデーション表に準拠。
export const sectionSchema = z.enum(["READING", "LISTENING"]);
export const difficultySchema = z.enum([
  "BAND_4_5",
  "BAND_5_6",
  "BAND_6_7",
  "BAND_7_8_PLUS",
]);

// トピックは任意入力・自由入力時は100文字以内（未入力時の挙動は実装メモ参照:
// backendがプリセットからランダム選択する）。
export const topicSchema = z
  .string()
  .max(100, "100文字以内で入力してください")
  .optional();

export const generationFormSchema = z.object({
  section: sectionSchema,
  topic: topicSchema,
  difficulty: difficultySchema,
});

export type GenerationFormValues = z.infer<typeof generationFormSchema>;
