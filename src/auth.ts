import NextAuth from "next-auth";
import Cognito from "next-auth/providers/cognito";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { BACKEND_API_ORIGIN } from "@/lib/env/backend-api-origin";
import { buildBearerHeader, safeJson } from "@/lib/api/http";

// GET /api/v1/meへの問い合わせがハングしてサインインフロー全体をブロックしないための上限（#00038）。
const FETCH_ME_TIMEOUT_MS = 8_000;
// appUserId未取得のまま確立したセッションについて、後続リクエストで再試行する際の最短間隔。
// リクエストのたびに無条件で再試行するとbackend障害時に問い合わせが集中するため間引く（#00038）。
const FETCH_ME_RETRY_COOLDOWN_MS = 30_000;

const meResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  displayName: z.string(),
  isGuest: z.boolean(),
});

const guestTokenResponseSchema = z.object({
  accessToken: z.string(),
  idToken: z.string().nullish(),
});

// Cognito Hosted UIへのリダイレクト（Authorization Code + PKCE）でログインする（#00034）。
// aws.cognito.signin.user.adminスコープは、backend UserProvisioningServiceがCognitoの
// GetUser APIでプロフィール属性(email等)を取得するために必須
// （infraリポジトリ terraform/modules/cognito と対）。
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Cognito({
      clientId: process.env.COGNITO_CLIENT_ID ?? "",
      clientSecret: process.env.COGNITO_CLIENT_SECRET ?? "",
      issuer: process.env.COGNITO_ISSUER ?? "",
      authorization: {
        params: { scope: "openid email profile aws.cognito.signin.user.admin" },
      },
    }),
    // ゲスト機能（#00056）。ユーザー入力は不要で、backendのPOST /api/v1/auth/guest-tokenが
    // 共有デモアカウントのCognitoトークンを発行する。Hosted UIへのリダイレクトは発生しない。
    Credentials({
      id: "guest",
      name: "Guest",
      credentials: {},
      async authorize() {
        const token = await fetchGuestToken();
        if (!token) {
          return null;
        }
        return { id: "guest", accessToken: token.accessToken, idToken: token.idToken ?? undefined };
      },
    }),
  ],
  session: { strategy: "jwt" },
  // 未指定だとNextAuth標準の/api/auth/signin(?error=...)にエラーがリダイレクトされ、
  // (auth)/login/page.tsxが表示するAuthAlertに実際のOAuthエラーが到達しない（#00039）。
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.access_token) {
        // Cognito Hosted UI（Authorization Code + PKCE、#00034）でのサインイン
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      } else if (user?.accessToken) {
        // ゲスト（#00056）。Credentialsプロバイダーのauthorize()が返したトークンをそのまま使う
        token.accessToken = user.accessToken;
        token.idToken = user.idToken;
      }

      // GET /api/v1/meはbackend側でapp_userを自動プロビジョニングしつつ、以後のセッションで
      // 使うid(app_user.id)/email/displayNameを取得するために必要（S-02設計書「ログイン成功」欄）。
      // 初回サインイン時（account present）に加えて、appUserId未取得のまま確立してしまった
      // セッション（backend一時障害等）についても、クールダウンを挟みつつ後続リクエストで
      // 再試行する。成功済みのセッションではtoken.appUserIdが常にtruthyなためこのブロックは
      // 実行されず、毎回backendへ問い合わせることはない。
      if (!token.appUserId && token.accessToken) {
        const lastAttemptedAt = token.appUserFetchAttemptedAt ?? 0;
        const shouldAttempt =
          Boolean(account) || Date.now() - lastAttemptedAt > FETCH_ME_RETRY_COOLDOWN_MS;
        if (shouldAttempt) {
          token.appUserFetchAttemptedAt = Date.now();
          const me = await fetchMe(token.accessToken);
          if (me) {
            token.appUserId = me.id;
            token.appUserEmail = me.email;
            token.appUserDisplayName = me.displayName;
            token.appUserIsGuest = me.isGuest;
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      if (token.appUserId) {
        session.user.id = token.appUserId;
        // GET /api/v1/meが一時的に失敗した場合でも、同じOAuth交換で取得済みのCognito OIDC
        // クレーム（token.email/token.name）をフォールバックとして使う（#00038）。
        session.user.email = token.appUserEmail ?? token.email ?? "";
        session.user.displayName = token.appUserDisplayName ?? token.name ?? "";
        session.user.isGuest = token.appUserIsGuest ?? false;
      }
      return session;
    },
  },
});

async function fetchMe(
  accessToken: string
): Promise<{ id: string; email: string; displayName: string; isGuest: boolean } | null> {
  let response: Response;
  try {
    response = await fetch(`${BACKEND_API_ORIGIN}/api/v1/me`, {
      headers: buildBearerHeader(accessToken),
      signal: AbortSignal.timeout(FETCH_ME_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("[auth] GET /api/v1/me failed (network error / timeout)", error);
    return null;
  }

  if (!response.ok) {
    console.error(`[auth] GET /api/v1/me returned ${response.status}`);
    return null;
  }

  const body = await safeJson(response);
  const parsed = meResponseSchema.safeParse(body);
  if (!parsed.success) {
    console.error("[auth] GET /api/v1/me returned an unexpected response shape", parsed.error);
    return null;
  }

  return parsed.data;
}

// ゲスト（#00056）の共有デモアカウントでbackendがInitiateAuthを実行しトークンを発行する。
// backendのGuestAuthController実装を参照（backendリポジトリ docs/API設計書/POST_auth-guest-token.md）。
async function fetchGuestToken(): Promise<{
  accessToken: string;
  idToken?: string | null;
} | null> {
  let response: Response;
  try {
    response = await fetch(`${BACKEND_API_ORIGIN}/api/v1/auth/guest-token`, {
      method: "POST",
      signal: AbortSignal.timeout(FETCH_ME_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("[auth] POST /api/v1/auth/guest-token failed (network error / timeout)", error);
    return null;
  }

  if (!response.ok) {
    console.error(`[auth] POST /api/v1/auth/guest-token returned ${response.status}`);
    return null;
  }

  const body = await safeJson(response);
  const parsed = guestTokenResponseSchema.safeParse(body);
  if (!parsed.success) {
    console.error(
      "[auth] POST /api/v1/auth/guest-token returned an unexpected response shape",
      parsed.error
    );
    return null;
  }

  return parsed.data;
}
