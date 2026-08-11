import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { hasAppUser } from "@/lib/auth/types";

// (protected)配下のルーティング（S-03〜S-07）を未ログイン時にログイン画面へリダイレクトする
// （S-02設計書「認証連携（フロントエンド側）実装方針」）。
// hasAppUser()で(protected)/layout.tsxと同じ基準を用いる（#00038）。
export default auth((req) => {
  if (!hasAppUser(req.auth)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/practice/:path*", "/history/:path*", "/attempts/:path*"],
};
