/** Generic Android-style phone: green outline, punch-hole camera. No real logos. */
export default function PhoneAndroid({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 180 360" width="100%" role="presentation">
        <rect x="2" y="2" width="176" height="356" rx="30" fill="#050605" stroke="#00ff7f" strokeWidth="3" />
        <rect x="10" y="10" width="160" height="340" rx="23" fill="#0a0f0c" />
        <circle cx="90" cy="24" r="5" fill="#050605" stroke="#1a211d" />
        <rect x="177" y="110" width="3" height="42" rx="1.5" fill="#00ff7f" />
      </svg>
      <div className="screen">
        <div className="glow" />
        <span className="line line-1" />
      </div>
    </div>
  );
}
