import type { Session } from "next-auth";

// NextAuth.js Cognitoプロバイダ連携を想定した型定義。
// 実際の認証方式（Cognito Hosted UIへのOAuthリダイレクト or カスタムAPIによる
// USER_PASSWORD_AUTH等の直接認証）は、Cognito実接続を行う別チケットで決定する。
// このチケットではどちらの方式にも転用できる形に留める。

export interface SignInWithPasswordInput {
  email: string;
  password: string;
}

export type SignInError = "CredentialsSignin" | "UserNotConfirmed" | "UnknownError";

export type SignInResult = { ok: true } | { ok: false; error: SignInError };

export interface SignUpInput {
  email: string;
  password: string;
}

export type SignUpError = "UsernameExists" | "InvalidPassword" | "UnknownError";

export type SignUpResult = { ok: true } | { ok: false; error: SignUpError };

export interface ConfirmSignUpInput {
  email: string;
  code: string;
}

export type ConfirmSignUpError = "CodeMismatch" | "ExpiredCode" | "UnknownError";

export type ConfirmSignUpResult = { ok: true } | { ok: false; error: ConfirmSignUpError };

// GET /api/v1/me のレスポンス形状に対応
// (backendリポジトリ docs/API設計書/GET_me.md)
export interface AppSessionUser {
  id: string;
  email: string;
  displayName: string;
  // ゲスト（#00056）の共有デモアカウントかどうか。trueの場合、生成回数上限・データの
  // 自動削除についてUI上で案内する（AppNavUserMenu参照）。
  isGuest: boolean;
}

// middleware.tsと(protected)/layout.tsxで別々の基準（!req.auth と !session?.user?.id）
// を使っていた認可判定を1箇所に統一する（#00038）。GET /api/v1/meが未完了のセッション
// （auth自体は成立しているがapp_userに紐付いていない）は未認証として扱う。
export function hasAppUser(
  session: Session | null | undefined
): session is Session & { user: AppSessionUser } {
  return Boolean(session?.user?.id);
}
