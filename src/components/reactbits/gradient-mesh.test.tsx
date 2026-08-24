import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GradientMesh } from "@/components/reactbits/gradient-mesh";

describe("GradientMesh (S-01)", () => {
  it("renders the static fallback without throwing under prefers-reduced-motion (test default)", () => {
    const { container } = render(<GradientMesh />);
    expect(container.querySelector(".gradient-mesh-container")).toBeInTheDocument();
    expect(container.querySelector(".gradient-mesh-fallback")).toBeInTheDocument();
  });

  it("does not render a canvas element when reduced motion is preferred", () => {
    const { container } = render(<GradientMesh />);
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
  });
});
