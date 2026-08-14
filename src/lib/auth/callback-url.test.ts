import { describe, expect, it } from "vitest";

import { sanitizeCallbackUrl } from "./callback-url";

describe("sanitizeCallbackUrl (#00040)", () => {
  it("returns the callback URL when it is a same-origin relative path", () => {
    expect(sanitizeCallbackUrl("/history")).toBe("/history");
    expect(sanitizeCallbackUrl("/attempts/1/result?tab=reading")).toBe(
      "/attempts/1/result?tab=reading"
    );
  });

  it("falls back to /dashboard when the callback URL is missing", () => {
    expect(sanitizeCallbackUrl(undefined)).toBe("/dashboard");
  });

  it("rejects absolute URLs to prevent open redirects", () => {
    expect(sanitizeCallbackUrl("https://evil.example.com")).toBe("/dashboard");
  });

  it("rejects protocol-relative URLs to prevent open redirects", () => {
    expect(sanitizeCallbackUrl("//evil.example.com")).toBe("/dashboard");
  });

  it("supports a custom fallback", () => {
    expect(sanitizeCallbackUrl(undefined, "/login")).toBe("/login");
  });
});
