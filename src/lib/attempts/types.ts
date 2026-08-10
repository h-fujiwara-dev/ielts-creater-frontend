import type { AttemptStatus, Difficulty, Section } from "@/lib/api/enums";

// POST /api/v1/attempts のリクエスト/レスポンス型
// (backendリポジトリ docs/API設計書/POST_attempts.md)
export interface StartAttemptRequest {
  questionSetId: string;
}

export interface StartAttemptResponse {
  id: string;
  status: AttemptStatus;
}

export interface SavedAnswer {
  questionId: string;
  userAnswerText: string;
}

// PATCH /api/v1/attempts/{id}/answers のリクエスト型（レスポンスは204 No Content）
// (backendリポジトリ docs/API設計書/PATCH_attempts-id-answers.md)
export interface PatchAnswersRequest {
  answers: SavedAnswer[];
}

// GET /api/v1/attempts/{id}/answers のレスポンス型（採点情報を含まない、下書き復元用）
// (backendリポジトリ docs/API設計書/GET_attempts-id-answers.md)
export interface GetSavedAnswersResponse {
  attemptId: string;
  status: AttemptStatus;
  answers: SavedAnswer[];
}

// POST /api/v1/attempts/{id}/submit のレスポンス型。GET /api/v1/attempts/{id}
// （#00022 結果画面）と同一形状のため共有する。
// (backendリポジトリ docs/API設計書/POST_attempts-id-submit.md)
export interface AttemptAnswerResult {
  questionId: string;
  // 一度も回答されなかった設問はAttemptAnswer行自体が存在しないためnullになる。
  userAnswerText: string | null;
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string | null;
}

export interface AttemptResult {
  attemptId: string;
  rawScore: number;
  maxScore: number;
  answers: AttemptAnswerResult[];
}

// S-05結果画面のスコアサマリー表示に必要だが、AttemptResult型（バックエンドの
// submit/GET attempts/{id}レスポンス）には含まれない付随情報。questionSetId・
// submittedAtは遷移元（回答画面の提出直後 or 履歴一覧のAttemptListItem）から
// クエリパラメータで受け取り、section/topic/difficultyはquestionSetIdを使って
// GET /api/v1/question-sets/{id}から取得して組み立てる（結果画面側の責務）。
// durationMinutesは履歴一覧経由では取得できないため任意項目とする。
export interface AttemptResultMeta {
  section: Section;
  topic: string;
  difficulty: Difficulty;
  submittedAt: string;
  durationMinutes?: number;
}

// GET /api/v1/attempts のクエリ・レスポンス型（受験履歴一覧、ページング・絞り込み）
// (backendリポジトリ docs/API設計書/GET_attempts.md)
export interface AttemptListItem {
  attemptId: string;
  questionSetId: string;
  section: Section;
  submittedAt: string;
  rawScore: number;
  maxScore: number;
}

export interface AttemptListQuery {
  section?: Section;
  page?: number;
  size?: number;
}

export interface AttemptListResponse {
  items: AttemptListItem[];
  page: number;
  totalPages: number;
}
