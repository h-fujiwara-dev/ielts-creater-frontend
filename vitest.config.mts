import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: [path.resolve(import.meta.dirname, "vitest.setup.ts")],
    css: false,
    // e2e/**はPlaywright専用（@playwright/test）のため、Vitestの対象から除外する。
    exclude: ["node_modules/**", ".next/**", "e2e/**"],
  },
});
