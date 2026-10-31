import { useState } from "react";
import { EMAIL, SOCIALS } from "../data/content";
import { say, setExpression } from "../bot/botStore";
import { lines } from "../bot/botLines";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      /* clipboard may be blocked; the mailto link still works */
    }
    setCopied(true);
    setExpression("happy", 1500);
    say(lines.copied);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const socials = SOCIALS.filter((s) => s.href);

  return (
    <>
      <section className="block contact" id="contact">
        <div className="container">
          <p className="eyebrow reveal">Contact</p>
          <h2 className="reveal">Got an app in mind?</h2>
          <p className="reveal">I'm open to internships and mobile projects. Say hello.</p>
          <div className="contact-actions reveal">
            <button className="btn btn-primary" onClick={copy}>
              {copied ? "Copied!" : EMAIL}
            </button>
            <a className="btn" href={`mailto:${EMAIL}`}>
              Open mail app
            </a>
          </div>
          {socials.length > 0 && (
            <div className="socials reveal">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
      <footer className="site-footer">
        <div className="container">
          <span>© {new Date().getFullYear()} Haseeb</span>
          <span>Built with React, three.js and GSAP</span>
        </div>
      </footer>
    </>
  );
}
