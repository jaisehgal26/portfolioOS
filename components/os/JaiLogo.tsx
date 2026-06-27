/**
 * The JaiOS brand mark — a warm terracotta squircle "tile" with a crafted
 * paper "J", a soft top sheen and an etched rim. Fixed colors (not theme
 * tokens) so the logo stays consistent across themes/accents.
 * Mirrored in app/icon.svg (favicon) and app/apple-icon.svg.
 */
export function JaiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="jai-tile" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2854E" />
          <stop offset="1" stopColor="#DC4E2A" />
        </linearGradient>
        <linearGradient id="jai-sheen" x1="24" y1="4" x2="24" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="13" fill="url(#jai-tile)" />
      <rect x="4" y="4" width="40" height="40" rx="13" fill="url(#jai-sheen)" />
      <path
        d="M32 13.5V27a8 8 0 0 1-16 0"
        stroke="#FFF7F0"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="4.75" y="4.75" width="38.5" height="38.5" rx="12.4" stroke="#FFFFFF" strokeOpacity="0.25" />
    </svg>
  );
}
