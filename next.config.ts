import path from "node:path";
import type { NextConfig } from "next";

// backendはno-authモード(ローカル開発)ではCORS未設定のため、ブラウザからは同一オリジン
// 経由で叩けるようこのプロキシを通す（#00032）。cognitoモードでもBearerトークン付与は
// lib/api/client.ts側で行うため、プロキシ経由のリクエスト構成自体は変わらない。
// BACKEND_API_ORIGIN未設定時はローカルのbootRunデフォルトポート(8080)を向く。
const backendApiOrigin = process.env.BACKEND_API_ORIGIN ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  // ielts-creater-frontend is nested inside the ielts-creater workspace, which
  // has its own package-lock.json for root tooling — pin Turbopack's root here
  // so it doesn't infer the parent directory as the project root.
  turbopack: {
    root: path.join(__dirname),
  },
  // Next.js auto-appends an "agent rules" block to CLAUDE.md on `next dev`,
  // but its own H1 conflicts with this repo's markdownlint single-H1 rule
  // (MD025). Disable it rather than fight the auto-regeneration.
  agentRules: false,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendApiOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
