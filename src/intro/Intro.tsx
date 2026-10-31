import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PhoneAndroid from "./PhoneAndroid";
import PhoneIphone from "./PhoneIphone";
import "./intro.css";

/**
 * ~3.8s intro: Android and iPhone slide in, bump, type the punchline,
 * merge into a green dot, then a circle wipe reveals the page.
 */
export default function Intro({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    tlRef.current?.kill();
    try {
      sessionStorage.setItem("introSeen", "1");
    } catch {
      /* storage can be blocked; the intro just replays next visit */
    }
    onDone();
  };

  // Lock scrolling while the intro is up; Escape skips it.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const phone = el.querySelector<HTMLElement>(".phone");
      const off = (phone?.offsetWidth ?? 150) * 0.6;

      gsap.set(".phone", { xPercent: -50, yPercent: -50, opacity: 0 });
      gsap.set(".dot", { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });

      const tl = gsap.timeline({ onComplete: finish });
      tlRef.current = tl;

      tl
        // boot cursor, then phones slide in from opposite sides
        .to(".boot", { opacity: 0, duration: 0.1 }, 0.4)
        .fromTo(
          ".phone-android",
          { x: "-60vw", rotate: -12 },
          { x: -off, rotate: 6, opacity: 1, duration: 0.8, ease: "power3.out" },
          0.4
        )
        .fromTo(
          ".phone-iphone",
          { x: "60vw", rotate: 12 },
          { x: off, rotate: -6, opacity: 1, duration: 0.8, ease: "power3.out" },
          0.4
        )
        // bump
        .to(".phone-android", { x: -off * 0.3, rotate: 0, duration: 0.25, ease: "power2.in" }, 1.2)
        .to(".phone-iphone", { x: off * 0.3, rotate: 0, duration: 0.25, ease: "power2.in" }, 1.2)
        .to(".stage", { x: 6, repeat: 5, yoyo: true, duration: 0.03 }, 1.45)
        .set(".stage", { x: 0 }, 1.65)
        // screens light up, punchline types out
        .to(".glow", { opacity: 1, duration: 0.3 }, 1.5)
        .to(".line-1", { text: "One codebase.", duration: 0.4, ease: "none" }, 1.5)
        .to(".line-2", { text: "Two platforms.", duration: 0.4, ease: "none" }, 1.9)
        .to(".line-3", { text: "Zero arguments.", duration: 0.5, ease: "none" }, 2.3)
        // merge into one dot
        .to(".caption", { opacity: 0, duration: 0.2 }, 2.65)
        .to(
          ".phone",
          { x: 0, rotate: 0, scale: 0.05, opacity: 0, duration: 0.5, ease: "power3.in" },
          2.8
        )
        .to(".dot", { scale: 1, opacity: 1, duration: 0.2 }, 3.1)
        // circle wipe reveals the landing page
        .to(
          el,
          { clipPath: "circle(0% at 50% 50%)", duration: 0.6, ease: "power3.inOut" },
          3.2
        );
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className="intro"
      role="presentation"
      style={{ clipPath: "circle(150% at 50% 50%)" }}
    >
      <button className="skip" onClick={finish}>
        Skip
      </button>
      <div className="stage">
        <span className="boot" aria-hidden="true">
          _
        </span>
        <PhoneAndroid className="phone phone-android" />
        <PhoneIphone className="phone phone-iphone" />
        <div className="dot" />
        <div className="caption" aria-hidden="true">
          <span className="line-3" />
        </div>
      </div>
    </div>
  );
}
