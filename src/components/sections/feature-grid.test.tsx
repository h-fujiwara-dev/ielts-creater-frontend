import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeatureGrid } from "@/components/sections/feature-grid";
import { featureGrid } from "@/lib/mock-data";

describe("FeatureGrid (S-01)", () => {
  it("renders one card per mock feature", () => {
    render(<FeatureGrid />);

    for (const feature of featureGrid) {
      expect(screen.getByRole("heading", { level: 3, name: feature.title })).toBeInTheDocument();
    }
  });

  it("links the CTAs to /login", () => {
    render(<FeatureGrid />);

    // Button renders an <a> with an explicit role="button" (nativeButton={false}), not role="link".
    expect(screen.getByRole("button", { name: "無料ではじめる" })).toHaveAttribute(
      "href",
      "/login?step=signup",
    );
    expect(screen.getByRole("button", { name: "ログイン" })).toHaveAttribute("href", "/login");
  });
});
