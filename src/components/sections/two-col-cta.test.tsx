import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TwoColCta } from "@/components/sections/two-col-cta";

describe("TwoColCta (S-01)", () => {
  it("links 使い方を見る to the #how-it-works anchor", () => {
    render(<TwoColCta />);

    // Button renders an <a> with an explicit role="button" (nativeButton={false}), not role="link".
    expect(screen.getByRole("button", { name: "使い方を見る" })).toHaveAttribute(
      "href",
      "#how-it-works",
    );
  });

  it("does not render a dangling よくある質問を見る CTA (no FAQ page exists yet)", () => {
    render(<TwoColCta />);

    expect(screen.queryByRole("button", { name: "よくある質問を見る" })).not.toBeInTheDocument();
  });
});
