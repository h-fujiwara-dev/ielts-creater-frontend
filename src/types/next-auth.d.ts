import type { DefaultSession } from "next-auth";
import type { AppSessionUser } from "@/lib/auth/types";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    idToken?: string;
    user: AppSessionUser & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string;
    idToken?: string;
  }
}
