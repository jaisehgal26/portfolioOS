/**
 * The JaiOS brand mark — a warm squircle badge with a bold rounded "J" and a
 * mint "live" status dot. Fixed colors (not theme tokens) so the logo stays
 * consistent across themes/accents. Mirrored exactly in app/icon.svg (favicon).
 */
export function JaiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="jai-bg" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9A62" />
          <stop offset="0.55" stopColor="#F0612F" />
          <stop offset="1" stopColor="#E8476A" />
        </linearGradient>
        <linearGradient id="jai-gloss" x1="24" y1="4" x2="24" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="12.5" fill="url(#jai-bg)" />
      <rect x="4" y="4" width="40" height="40" rx="12.5" fill="url(#jai-gloss)" />
      <path
        d="M29 12.5V25a7.5 7.5 0 0 1-15 0"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="34.5" cy="13.5" r="2.9" fill="#46E0A6" />
      <circle cx="34.5" cy="13.5" r="2.9" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1" />
      <rect x="4.5" y="4.5" width="39" height="39" rx="12" stroke="#FFFFFF" strokeOpacity="0.28" />
    </svg>
  );
}
