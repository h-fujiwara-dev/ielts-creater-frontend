import path from "node:path";
import type { NextConfig } from "next";

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
};

export default nextConfig;
