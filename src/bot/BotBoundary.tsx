import { Component, type ReactNode } from "react";

/** Static SVG bot shown if WebGL is unavailable or the 3D scene throws. */
function BotFallback() {
  return (
    <div className="bot-fallback" role="img" aria-label="Illustration of a friendly robot">
      <svg viewBox="0 0 200 240" fill="none">
        <circle cx="100" cy="14" r="6" fill="#00ff7f" />
        <rect x="98" y="14" width="4" height="30" fill="#f4f7f5" />
        <rect x="30" y="44" width="140" height="100" rx="22" fill="#111613" stroke="#1a211d" strokeWidth="2" />
        <rect x="44" y="60" width="112" height="68" rx="12" fill="#020403" />
        <rect x="72" y="80" width="14" height="28" rx="7" fill="#00ff7f" />
        <rect x="114" y="80" width="14" height="28" rx="7" fill="#00ff7f" />
        <rect x="72" y="150" width="56" height="14" rx="4" fill="#1b231f" />
        <rect x="50" y="164" width="100" height="70" rx="16" fill="#111613" stroke="#1a211d" strokeWidth="2" />
        <circle cx="86" cy="196" r="4" fill="#00ff7f" />
        <rect x="100" y="193" width="12" height="6" rx="2" fill="#00ff7f" />
      </svg>
    </div>
  );
}

export default class BotBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <BotFallback /> : this.props.children;
  }
}
