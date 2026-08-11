import { NextResponse } from "next/server";

import { signOut } from "@/auth";

// NextAuthのローカルセッション破棄だけでは、Cognito Hosted UI側のセッションCookieが
// 残ってしまい、再度ログインボタンを押すと資格情報入力なしにSSO再認証されてしまう。
// ローカルセッションを破棄した上でCognitoのグローバルログアウトエンドポイントへリダイレクト
// し、Cognito側のセッションもあわせて終了させる（#00041、S-02設計書「今後の改善余地」）。
export async function GET(request: Request) {
  await signOut({ redirect: false });

  const logoutUri = new URL("/login", request.url).toString();
  const domain = process.env.COGNITO_HOSTED_UI_DOMAIN;
  const clientId = process.env.COGNITO_CLIENT_ID;

  if (!domain || !clientId) {
    return NextResponse.redirect(logoutUri);
  }

  const cognitoLogoutUrl = new URL(`https://${domain}/logout`);
  cognitoLogoutUrl.searchParams.set("client_id", clientId);
  cognitoLogoutUrl.searchParams.set("logout_uri", logoutUri);

  return NextResponse.redirect(cognitoLogoutUrl);
}
