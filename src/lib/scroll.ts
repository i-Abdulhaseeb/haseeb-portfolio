import Lenis from "lenis";
import gsap from "gsap";

let lenis: Lenis | null = null;

/** Smooth scrolling. Skipped entirely for visitors who prefer reduced motion. */
export function initScroll(): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }
  const instance = new Lenis({ lerp: 0.1 });
  lenis = instance;

  const tick = (time: number) => {
    instance.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    instance.destroy();
    lenis = null;
  };
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el);
  else el.scrollIntoView({ behavior: "auto" });
}
