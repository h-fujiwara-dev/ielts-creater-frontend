import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/sections/site-header";

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;
  observe = () => {};
  unobserve = () => {};
  disconnect = () => {};

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeIntersectionObserver.instances.push(this);
  }

  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this as never);
  }
}

function renderWithSentinel(intersecting: boolean) {
  render(
    <>
      <span id="hero-top-sentinel" />
      <SiteHeader />
    </>,
  );
  const observer = FakeIntersectionObserver.instances.at(-1);
  act(() => observer?.trigger(intersecting));
}

describe("SiteHeader (S-01)", () => {
  const originalIntersectionObserver = global.IntersectionObserver;

  beforeEach(() => {
    FakeIntersectionObserver.instances = [];
    // @ts-expect-error -- narrower fake than the DOM type, sufficient for this test
    global.IntersectionObserver = FakeIntersectionObserver;
  });

  afterEach(() => {
    global.IntersectionObserver = originalIntersectionObserver;
  });

  it("renders the dark-over-Hero skin while the hero sentinel is intersecting", () => {
    renderWithSentinel(true);

    expect(screen.getByRole("link", { name: "IELTS Creator" })).toHaveClass("text-white");
  });

  it("flips to the light skin once the hero sentinel scrolls out of view", () => {
    renderWithSentinel(false);

    expect(screen.getByRole("link", { name: "IELTS Creator" })).toHaveClass("text-brand-navy");
  });

  it("links the logo back to the top page", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "IELTS Creator" })).toHaveAttribute("href", "/");
  });

  it("links the desktop login/signup CTAs to /login", () => {
    render(<SiteHeader />);

    // Button renders an <a> with an explicit role="button" (nativeButton={false}), not role="link".
    const loginCtas = screen.getAllByRole("button", { name: "ログイン" });
    const signupCtas = screen.getAllByRole("button", { name: "無料ではじめる" });

    expect(loginCtas[0]).toHaveAttribute("href", "/login");
    expect(signupCtas[0]).toHaveAttribute("href", "/login?step=signup");
  });

  it("links the top page sections with a root-absolute path so navigation works from other pages", () => {
    render(<SiteHeader />);

    // Mobile menu is collapsed by default, so only the desktop nav links are in the DOM.
    expect(screen.getByRole("link", { name: "特長" })).toHaveAttribute("href", "/#features");
    expect(screen.getByRole("link", { name: "使い方" })).toHaveAttribute(
      "href",
      "/#how-it-works",
    );
    expect(screen.getByRole("link", { name: "出題形式" })).toHaveAttribute("href", "/#formats");
  });

  it("toggles the mobile menu open and closed", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const toggle = screen.getByRole("button", { name: "メニューを開く" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(screen.getByRole("button", { name: "メニューを閉じる" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });
});
