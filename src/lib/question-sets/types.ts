import type { Difficulty, FormatType, QuestionSetStatus, Section } from "@/lib/api/enums";

// POST /api/v1/question-sets のリクエスト/レスポンス型
// (backendリポジトリ docs/API設計書/POST_question-sets.md)
export interface CreateQuestionSetRequest {
  section: Section;
  topic?: string;
  difficulty: Difficulty;
}

export interface CreateQuestionSetResponse {
  id: string;
  status: QuestionSetStatus;
  topic: string;
}

// GET /api/v1/question-sets/{id} のレスポンス型
// (backendリポジトリ docs/API設計書/GET_question-sets-id.md)
export interface PassageParagraph {
  id: string;
  text: string;
}

export interface Passage {
  title: string;
  paragraphs: PassageParagraph[];
}

// MCQ/見出しマッチングの選択肢（backend AnswerOptionResponse）。`label`が採点キー
// （例: "A"/"h2"）、`text`が画面に表示する文言（TFNG/穴埋めでは未使用）。
export interface QuestionOption {
  label: string;
  text: string;
}

export interface Question {
  id: string;
  promptText: string;
  displayOrder: number;
  options?: QuestionOption[];
}

export interface QuestionGroup {
  formatType: FormatType;
  instructions: string;
  questions: Question[];
}

export interface QuestionSetDetail {
  id: string;
  section: Section;
  topic: string;
  difficulty: Difficulty;
  status: QuestionSetStatus;
  passage?: Passage;
  // Listeningのみ。台本本文の代わりに場面設定の要約を返す（backend QuestionSetDetailResponse）。
  listeningContext?: string;
  questionGroups: QuestionGroup[];
}

// GET /api/v1/question-sets/{id}/audio-segments のレスポンス型
// (backendリポジトリ docs/API設計書/GET_question-sets-id-audio-segments.md)
export interface AudioSegment {
  turnIndex: number;
  url: string;
  durationMs: number;
}

export interface AudioSegmentsResponse {
  segments: AudioSegment[];
}
