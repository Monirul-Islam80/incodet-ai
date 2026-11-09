import { watchScrollLayout } from "./scroll-refresh";

/** Load browser animation tools only after a component has committed. */
export async function loadScrollMotion() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  watchScrollLayout(ScrollTrigger);
  return { gsap, ScrollTrigger };
}
