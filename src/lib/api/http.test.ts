import { describe, expect, it } from "vitest";

import { buildBearerHeader, safeJson } from "./http";

describe("buildBearerHeader (#00042)", () => {
  it("returns an Authorization header when a token is given", () => {
    expect(buildBearerHeader("token-abc")).toEqual({ Authorization: "Bearer token-abc" });
  });

  it("returns an empty object when no token is given", () => {
    expect(buildBearerHeader(undefined)).toEqual({});
  });
});

describe("safeJson (#00042)", () => {
  it("parses a valid JSON response", async () => {
    const response = new Response(JSON.stringify({ ok: true }));
    await expect(safeJson(response)).resolves.toEqual({ ok: true });
  });

  it("resolves to null instead of throwing for a non-JSON response", async () => {
    const response = new Response("not json");
    await expect(safeJson(response)).resolves.toBeNull();
  });
});
