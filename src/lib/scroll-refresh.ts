import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

let watching = false;

/**
 * Keeps every ScrollTrigger in step with the real page layout.
 *
 * Pinned sections measure their start and end when they are created. If anything above them
 * changes height afterwards (a section that measures itself after mount, late images or fonts),
 * those positions go stale and a pin fires in the wrong place. This watches the page height and
 * refreshes all triggers (debounced) whenever it actually changes, plus once after fonts and
 * window load. Refreshes only run when the height differs from the last refresh, so they never loop.
 */
export function watchScrollLayout(ScrollTrigger: typeof ScrollTriggerType) {
  if (watching || typeof window === "undefined") return;
  watching = true;
  const root = document.documentElement;
  let lastHeight = root.scrollHeight;
  let timer = 0;

  const refresh = (force = false) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (!force && root.scrollHeight === lastHeight) return;
      ScrollTrigger.refresh();
      lastHeight = root.scrollHeight;
    }, 150);
  };

  new ResizeObserver(() => refresh()).observe(document.body);
  void document.fonts?.ready.then(() => refresh(true));
  if (document.readyState === "complete") refresh(true);
  else window.addEventListener("load", () => refresh(true), { once: true });
}
