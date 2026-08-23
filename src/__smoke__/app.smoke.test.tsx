import { describe, expect, it, vi, beforeAll, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import App from "../App";

// Testing Library only registers its own afterEach cleanup when vitest runs
// with `globals: true`. This suite does not, so without this every render
// stacks another copy of the app into the same document.
afterEach(cleanup);

beforeAll(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

  // jsdom implements none of the three below, and all three are touched on the
  // first render. Element.animate matters most: framer-motion drives every
  // transition through the Web Animations API, so without it the render dies on
  // the first animated element and the test proves nothing.
  Element.prototype.animate = vi.fn(() => ({
    cancel: vi.fn(),
    finish: vi.fn(),
    play: vi.fn(),
    pause: vi.fn(),
    commitStyles: vi.fn(),
    finished: Promise.resolve(),
    currentTime: 0,
    playState: "finished",
    onfinish: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof Element.prototype.animate;

  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  vi.stubGlobal("IntersectionObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
    root = null;
    rootMargin = "";
    thresholds = [];
  });
});

describe("App", () => {
  it("renders without throwing under LazyMotion strict mode", () => {
    // strict mode throws on any surviving `motion.*` component, so a clean
    // render is the assertion that the m.* migration is complete.
    const errors: unknown[] = [];
    const spy = vi.spyOn(console, "error").mockImplementation((...a) => errors.push(a));

    render(<App />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Nayem");
    spy.mockRestore();
    if (errors.length) console.log("COLLECTED:", JSON.stringify(errors).slice(0, 1200));
    expect(errors).toEqual([]);
  });

  it("exposes the nav as real links, not buttons", () => {
    render(<App />);

    // As <button> these could not be middle-clicked, opened in a new tab or
    // copied, and never appeared in a screen reader's list of links.
    const about = screen.getAllByRole("link", { name: "About" });
    expect(about.length).toBeGreaterThan(0);
    expect(about[0].getAttribute("href")).toBe("#about");
  });

  it("offers a skip link that targets the main landmark", () => {
    render(<App />);

    const skip = screen.getByRole("link", { name: /skip to content/i });
    expect(skip.getAttribute("href")).toBe("#main");
    expect(document.querySelector("main")?.id).toBe("main");
  });

  it("labels the popover triggers as collapsed menus", () => {
    render(<App />);

    for (const name of [/change theme colour/i, /resume/i]) {
      const trigger = screen.getAllByRole("button", { name })[0];
      expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
    }
  });

  it("skips the preloader when the OS asks for reduced motion", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    const { shouldShowPreloader } = await import("../components/Preloader");
    expect(shouldShowPreloader()).toBe(false);
  });
});
