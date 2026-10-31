/** Generic iPhone-style phone: white outline, pill-shaped island. No real logos. */
export default function PhoneIphone({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 180 360" width="100%" role="presentation">
        <rect x="2" y="2" width="176" height="356" rx="42" fill="#050605" stroke="#f4f7f5" strokeWidth="3" />
        <rect x="10" y="10" width="160" height="340" rx="35" fill="#0a0f0c" />
        <rect x="66" y="18" width="48" height="14" rx="7" fill="#000" />
        <rect x="-1" y="100" width="3" height="26" rx="1.5" fill="#f4f7f5" />
        <rect x="178" y="130" width="3" height="52" rx="1.5" fill="#f4f7f5" />
      </svg>
      <div className="screen">
        <div className="glow" />
        <span className="line line-2" />
      </div>
    </div>
  );
}
