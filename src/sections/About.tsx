import { ABOUT } from "../data/content";

export default function About() {
  return (
    <section className="block" id="about">
      <div className="container">
        <p className="eyebrow reveal">About</p>
        <h2 className="reveal">Apps that hold up in production.</h2>
        <div className="about-grid">
          <div className="reveal">
            {ABOUT.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ul className="facts reveal">
            {ABOUT.facts.map((f) => (
              <li key={f.label}>
                <b>{f.label}</b>
                <span>{f.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
