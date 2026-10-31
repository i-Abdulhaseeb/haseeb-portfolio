import { useEffect, useRef } from "react";

export interface CursorTarget {
  /** Pixel position of the last pointer event. */
  px: number;
  py: number;
  active: boolean;
  lastMove: number;
  /** When the pointer left the window (0 = never / back inside). */
  leftAt: number;
}

/** Tracks the pointer across the whole window, not just over the canvas. */
export function useCursorTarget() {
  const target = useRef<CursorTarget>({ px: 0, py: 0, active: false, lastMove: 0, leftAt: 0 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const t = target.current;
      t.px = e.clientX;
      t.py = e.clientY;
      t.active = true;
      t.leftAt = 0;
      t.lastMove = performance.now();
    };
    const leave = () => {
      target.current.active = false;
      target.current.leftAt = performance.now();
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return target;
}
