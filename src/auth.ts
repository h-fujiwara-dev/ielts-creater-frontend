import NextAuth from "next-auth";
import Cognito from "next-auth/providers/cognito";
import { z } from "zod";

// GET /api/v1/meへの問い合わせがハングしてサインインフロー全体をブロックしないための上限（#00038）。
const FETCH_ME_TIMEOUT_MS = 8_000;
// appUserId未取得のまま確立したセッションについて、後続リクエストで再試行する際の最短間隔。
// リクエストのたびに無条件で再試行するとbackend障害時に問い合わせが集中するため間引く（#00038）。
const FETCH_ME_RETRY_COOLDOWN_MS = 30_000;

const meResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  displayName: z.string(),
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
  ],
  session: { strategy: "jwt" },
  // 未指定だとNextAuth標準の/api/auth/signin(?error=...)にエラーがリダイレクトされ、
  // (auth)/login/page.tsxが表示するAuthAlertに実際のOAuthエラーが到達しない（#00039）。
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
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
      }
      return session;
    },
  },
});

async function fetchMe(
  accessToken: string
): Promise<{ id: string; email: string; displayName: string } | null> {
  const backendOrigin = process.env.BACKEND_API_ORIGIN ?? "http://localhost:8080";

  let response: Response;
  try {
    response = await fetch(`${backendOrigin}/api/v1/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
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

  const body: unknown = await response.json().catch(() => null);
  const parsed = meResponseSchema.safeParse(body);
  if (!parsed.success) {
    console.error("[auth] GET /api/v1/me returned an unexpected response shape", parsed.error);
    return null;
  }

  return parsed.data;
}
