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
});
