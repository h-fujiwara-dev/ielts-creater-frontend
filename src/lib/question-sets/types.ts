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

// バックエンド設計書の例JSONにはMCQ/見出しマッチングの選択肢が明記されていないため、
// 追加的な拡張としてoptionsを持たせる（TFNG/穴埋めでは未使用）。
export interface QuestionOption {
  id: string;
  label: string;
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
