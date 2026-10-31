import { PROJECTS, type Project } from "../data/content";
import { botState, say, setExpression } from "../bot/botStore";
import { lines } from "../bot/botLines";

function Mock({ kind, name }: { kind: Project["kind"]; name: string }) {
  if (kind === "terminal") {
    return (
      <div className="mock-term" aria-hidden="true">
        <header>
          <i />
          <i />
          <i />
        </header>
        <pre>
          {"$ ./avengers\n"}
          <span className="dim">{"> clearance: level 7\n> mode: deploy\n> loading roster.json"}</span>
          {"\n$ _"}
        </pre>
      </div>
    );
  }
  return (
    <div className="mock" aria-hidden="true">
      <div className="mock-screen">
        <div className="mock-title">{name}</div>
        <div className="mock-bar accent" />
        <div className="mock-card" />
        <div className="mock-bar w70" />
        <div className="mock-bar w40" />
        <div className="mock-card" />
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section className="block" id="projects">
      <div className="container">
        <p className="eyebrow reveal">Selected work</p>
        <h2 className="reveal">Things I've built.</h2>
        <div className="project-list">
          {PROJECTS.map((p) => (
            <article
              key={p.id}
              className="project reveal"
              onPointerEnter={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                botState.lookAt = { px: r.left + r.width / 2, py: r.top + r.height / 2 };
                setExpression("happy", 1500);
                say(lines.projects[p.id]);
              }}
              onPointerLeave={() => {
                botState.lookAt = null;
              }}
            >
              <div className="mock-wrap">
                <Mock kind={p.kind} name={p.name} />
              </div>
              <div>
                <span className="status">{p.status}</span>
                <h3>{p.name}</h3>
                <p>{p.blurb}</p>
                <ul className="tags">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
