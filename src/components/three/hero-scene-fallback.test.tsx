import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeroSceneFallback } from "@/components/three/hero-scene-fallback";

describe("HeroSceneFallback", () => {
  it("renders nine static bars without a canvas", () => {
    const { container } = render(<HeroSceneFallback />);

    expect(container.querySelectorAll(":scope > div > div")).toHaveLength(9);
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
  });

  it("marks band 9 as the focus bar", () => {
    const { getByText } = render(<HeroSceneFallback />);
    expect(getByText("9")).toHaveClass("text-brand-orange");
  });
});
