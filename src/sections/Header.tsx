import type { ReactNode } from "react";
import { scrollToId } from "../lib/scroll";

function NavLink({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={`#${id}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        scrollToId(id);
      }}
    >
      {children}
    </a>
  );
}

export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <NavLink id="top" className="brand">
          <strong>Haseeb</strong>
          <span>Flutter developer</span>
        </NavLink>
        <nav className="nav" aria-label="Main">
          <NavLink id="about">About</NavLink>
          <NavLink id="projects">Work</NavLink>
          <NavLink id="contact" className="btn btn-primary">
            Get in touch
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
