import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { techLogos } from "@/components/reactbits/tech-logos";
import { TechMarquee } from "@/components/sections/tech-marquee";

describe("TechMarquee (S-01)", () => {
  it("renders a label for every tech logo (static fallback under prefers-reduced-motion, the test default)", () => {
    render(<TechMarquee />);

    for (const { name } of techLogos) {
      // Each logo's <svg><title> also matches on text content, so scope to the
      // visible label span.
      expect(screen.getByText(name, { selector: "span" })).toBeInTheDocument();
    }
  });
});
