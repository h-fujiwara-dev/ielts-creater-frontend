// バックエンドAPI（ielts-creater-backend docs/ER図・テーブル定義.md, API一覧.md）の
// enum定義に対応する共有型。各ドメインのtypes.tsから再利用し、重複定義しない。

export type Section = "READING" | "LISTENING";

export const SECTION_LABELS: Record<Section, string> = {
  READING: "Reading",
  LISTENING: "Listening",
};

export type Difficulty = "BAND_4_5" | "BAND_5_6" | "BAND_6_7" | "BAND_7_8_PLUS";

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  BAND_4_5: "Band 4-5",
  BAND_5_6: "Band 5-6",
  BAND_6_7: "Band 6-7",
  BAND_7_8_PLUS: "Band 7-8+",
};

export type QuestionSetStatus = "GENERATING" | "READY" | "FAILED";

// FORM_COMPLETION/NOTE_COMPLETIONはバックエンドのenumには存在するが、
// 対象5画面のHTML叩き台・画面設計書のスコープには含まれない。
export type FormatType = "TFNG" | "MCQ" | "FILL_BLANK" | "MATCHING_HEADINGS";

export const FORMAT_LABELS: Record<FormatType, string> = {
  TFNG: "True / False / Not Given",
  MCQ: "Multiple Choice",
  FILL_BLANK: "Fill in the Blank",
  MATCHING_HEADINGS: "Matching Headings",
};

export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED";
