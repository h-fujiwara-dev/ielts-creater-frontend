// 共通エラーレスポンス形状（ielts-creater-backend docs/API一覧.md）。
// このチケット群は正常系のモックデータのみを扱うため実際には投げないが、
// 型としては一箇所にまとめておく。
export interface ApiErrorResponse {
  error: string;
  message: string;
  timestamp: string;
}
