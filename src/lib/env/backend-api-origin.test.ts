import { afterEach, describe, expect, it, vi } from "vitest";

describe("BACKEND_API_ORIGIN (#00042)", () => {
  const originalEnv = process.env.BACKEND_API_ORIGIN;

  afterEach(() => {
    process.env.BACKEND_API_ORIGIN = originalEnv;
    vi.resetModules();
  });

  it("falls back to the local bootRun default when unset", async () => {
    delete process.env.BACKEND_API_ORIGIN;
    vi.resetModules();

    const { BACKEND_API_ORIGIN } = await import("./backend-api-origin");

    expect(BACKEND_API_ORIGIN).toBe("http://localhost:8080");
  });

  it("uses the configured environment variable when set", async () => {
    process.env.BACKEND_API_ORIGIN = "https://api.example.com";
    vi.resetModules();

    const { BACKEND_API_ORIGIN } = await import("./backend-api-origin");

    expect(BACKEND_API_ORIGIN).toBe("https://api.example.com");
  });
});
