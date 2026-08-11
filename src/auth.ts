import NextAuth from "next-auth";
import Cognito from "next-auth/providers/cognito";

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
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        // 初回サインイン時のみGET /api/v1/meを呼び、backend側でapp_userを自動プロビジョニング
        // させつつ、以後のセッションで使うid(app_user.id)/email/displayNameを取得する
        // （S-02設計書「ログイン成功」欄）。以降のリクエストではaccountが渡されないため
        // このブロックは実行されず、毎回backendへ問い合わせることはない。
        const me = await fetchMe(token.accessToken);
        if (me) {
          token.appUserId = me.id;
          token.appUserEmail = me.email;
          token.appUserDisplayName = me.displayName;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      if (token.appUserId) {
        session.user.id = token.appUserId;
        session.user.email = token.appUserEmail ?? "";
        session.user.displayName = token.appUserDisplayName ?? "";
      }
      return session;
    },
  },
});

async function fetchMe(
  accessToken: string | undefined
): Promise<{ id: string; email: string; displayName: string } | null> {
  if (!accessToken) {
    return null;
  }
  const backendOrigin = process.env.BACKEND_API_ORIGIN ?? "http://localhost:8080";
  try {
    const response = await fetch(`${backendOrigin}/api/v1/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as { id: string; email: string; displayName: string };
  } catch {
    return null;
  }
}
