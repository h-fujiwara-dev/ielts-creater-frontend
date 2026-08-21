import type { DefaultSession } from "next-auth";
import type { AppSessionUser } from "@/lib/auth/types";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    idToken?: string;
    // src/auth.tsのsessionコールバックはtoken.appUserId取得済みの場合のみid/email/
    // displayNameを代入するため、実行時にはこれらがundefinedのセッションも存在しうる。
    // Partialにすることで、hasAppUser()（src/lib/auth/types.ts）による絞り込みを経ずに
    // session.user.idを直接使おうとするコードをコンパイル時に検出できるようにする（#00042）。
    user: Partial<AppSessionUser> & DefaultSession["user"];
  }

  // ゲスト（#00056）のCredentialsプロバイダーのauthorize()が返す値。jwtコールバックが
  // account.access_token（OAuth）の代わりにこちらを読む。
  interface User {
    accessToken?: string;
    idToken?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string;
    idToken?: string;
    appUserId?: string;
    appUserEmail?: string;
    appUserDisplayName?: string;
    appUserIsGuest?: boolean;
    appUserFetchAttemptedAt?: number;
  }
}
