import NextAuth from "next-auth";
import Cognito from "next-auth/providers/cognito";

// Cognitoプロバイダの設定骨格。#00018時点ではCognito User Pool未払い出しのため
// 環境変数は未設定でよく、このプロバイダはPhase 1では実行されない
// （UIはsrc/lib/auth/dev-user.tsの固定devユーザーでローカル判定する）。
// 実際の認証方式（Hosted UIへのリダイレクト or カスタムAPIによる直接認証）は
// Cognito実接続を行う別チケットで決定する。
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Cognito({
      clientId: process.env.COGNITO_CLIENT_ID ?? "",
      clientSecret: process.env.COGNITO_CLIENT_SECRET ?? "",
      issuer: process.env.COGNITO_ISSUER ?? "",
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      return session;
    },
  },
});
