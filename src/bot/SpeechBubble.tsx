import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { onSay } from "./botStore";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

export default function SpeechBubble() {
  const text = useRef<HTMLSpanElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);
  const [full, setFull] = useState("");
  const [shown, setShown] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const off = onSay((line) => {
      setFull(line);
      setShown(true);

      const el = text.current;
      if (el) {
        gsap.killTweensOf(el);
        if (reduced) {
          el.textContent = line;
        } else {
          gsap.fromTo(
            el,
            { text: "" },
            { text: line, duration: Math.max(0.4, line.length * 0.024), ease: "none" }
          );
        }
      }

      window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setShown(false), 8000);
    });
    return () => {
      off();
      window.clearTimeout(hideTimer.current);
    };
  }, [reduced]);

  return (
    <div className={`bubble${shown ? " is-shown" : ""}`} aria-live="polite">
      <span className="sr-only">{full}</span>
      <span aria-hidden="true" ref={text} />
    </div>
  );
}
