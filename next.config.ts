import path from "node:path";
import type { NextConfig } from "next";

// backendはno-authモードでCORS未設定のため、ブラウザからは同一オリジン経由で
// 叩けるようこのプロキシを通す（#00032）。BACKEND_API_ORIGIN未設定時はローカルの
// bootRunデフォルトポート(8080)を向く。
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
