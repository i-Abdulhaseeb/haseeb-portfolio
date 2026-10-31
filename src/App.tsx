import { lazy, Suspense, useEffect, useState } from "react";
import Intro from "./intro/Intro";
import Header from "./sections/Header";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import SpeechBubble from "./bot/SpeechBubble";
import BotBoundary from "./bot/BotBoundary";
import { botState, say } from "./bot/botStore";
import { lines } from "./bot/botLines";
import { initScroll } from "./lib/scroll";

// Starts downloading while the intro plays, so the bot is ready when the wipe ends.
const BotCanvas = lazy(() => import("./bot/BotCanvas"));

function shouldPlayIntro(): boolean {
  try {
    if (new URLSearchParams(window.location.search).has("intro")) return true; // ?intro replays it
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return !sessionStorage.getItem("introSeen");
  } catch {
    return true;
  }
}

export default function App() {
  const [introDone, setIntroDone] = useState(() => !shouldPlayIntro());
  const [docked, setDocked] = useState(false);

  // Smooth scroll
  useEffect(() => initScroll(), []);

  // Wake the bot and greet the visitor (differently if they've been here before)
  useEffect(() => {
    botState.awake = introDone;
    if (!introDone) return;
    const id = window.setTimeout(() => {
      let seen = false;
      try {
        seen = !!localStorage.getItem("botSeen");
        localStorage.setItem("botSeen", "1");
      } catch {
        /* ignore */
      }
      say(seen ? lines.returning : lines.first);
    }, 700);
    return () => window.clearTimeout(id);
  }, [introDone]);

  // Bot shrinks to a corner companion once the hero scrolls away
  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setDocked(entry.intersectionRatio < 0.35),
      { threshold: [0, 0.35, 0.6, 1] }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Bot comments on the section currently in the middle of the screen
  useEffect(() => {
    if (!introDone) return;
    const ids = ["about", "projects", "contact"] as const;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) say(lines.sections[e.target.id as (typeof ids)[number]]);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [introDone]);

  // Scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <div className={`bot-dock${docked ? " is-docked" : ""}`}>
        <SpeechBubble />
        <BotBoundary>
          <Suspense fallback={null}>
            <BotCanvas />
          </Suspense>
        </BotBoundary>
      </div>
    </>
  );
}
