import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeroSceneFallback } from "@/components/three/hero-scene-fallback";

describe("HeroSceneFallback", () => {
  it("renders a static headphones + book illustration without a canvas", () => {
    const { container, getByText } = render(<HeroSceneFallback />);

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
    expect(getByText("LISTENING")).toBeInTheDocument();
    expect(getByText("READING")).toBeInTheDocument();
  });
});
