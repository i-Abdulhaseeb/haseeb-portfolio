import { useEffect, useState } from "react";
import { scrollToId } from "../lib/scroll";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

const WORDS = ["Android", "iPhone"];

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % WORDS.length), 2600);
    return () => window.clearInterval(id);
  }, [reduced]);

  const word = reduced ? "Android and iPhone" : WORDS[i];

  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true" />
      <div className="container">
        <div className="hero-copy">
          <p className="eyebrow">Mobile app developer</p>
          <h1 aria-label="I build apps for Android and iPhone.">
            I build apps for{" "}
            <span className="swap" key={word} aria-hidden="true">
              {word}
            </span>
            <span aria-hidden="true">.</span>
          </h1>
          <p className="lead">
            I'm Haseeb, a Flutter developer and Computer Science student at UCP Lahore. One codebase, clean
            architecture, and apps that feel native on both platforms.
          </p>
          <div className="hero-actions">
            <a
              className="btn btn-primary"
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("projects");
              }}
            >
              View work
            </a>
            <a
              className="btn"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("contact");
              }}
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
      <span className="scroll-hint" aria-hidden="true">
        scroll
      </span>
    </section>
  );
}
